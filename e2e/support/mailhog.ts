import { expect } from '@playwright/test'

// The local API sends its mail to MailHog (MAIL_PORT=1025); its web UI and API are on :8025
const MAILHOG = process.env.E2E_MAILHOG_URL || 'http://localhost:8025'

type Message = { ID: string; Content: { Headers: Record<string, string[]>; Body: string } }

function decodeQuotedPrintable(body: string) {
  return body.replace(/=\r?\n/g, '').replace(/=([0-9A-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
}

async function messagesTo(email: string): Promise<Message[]> {
  const res = await fetch(`${MAILHOG}/api/v2/search?kind=to&limit=250&query=${encodeURIComponent(email)}`)
  return (await res.json()).items ?? []
}

/** Waits for a mail to `email` with a link containing `pathPart`, returns that link and deletes the mail */
export async function linkFromMail(email: string, pathPart: string): Promise<string> {
  let link: string | undefined
  await expect.poll(async () => {
    for (const message of await messagesTo(email)) {
      const found = decodeQuotedPrintable(message.Content.Body)
        .match(/https?:\/\/[^\s"'<>]+/g)
        ?.find(url => url.includes(pathPart))
      if (found) {
        link = found.replace(/&amp;/g, '&')
        await fetch(`${MAILHOG}/api/v1/messages/${message.ID}`, { method: 'DELETE' })
        return true
      }
    }
    return false
  }, { message: `mail to ${email} with a ${pathPart} link`, timeout: 30_000 }).toBe(true)
  return link!
}

/** The path of a link from a mail, so it opens on the server under test */
export function pathOf(link: string) {
  const url = new URL(link)
  return url.pathname + url.search
}

/** Waits for a mail to `email` that mentions `text`, and deletes it */
export async function expectMail(email: string, text: string) {
  await expect.poll(async () => {
    for (const message of await messagesTo(email)) {
      if (decodeQuotedPrintable(message.Content.Body).includes(text)) {
        await fetch(`${MAILHOG}/api/v1/messages/${message.ID}`, { method: 'DELETE' })
        return true
      }
    }
    return false
  }, { message: `mail to ${email} mentioning ${text}`, timeout: 30_000 }).toBe(true)
}

/** Deletes every mail to an @e2e.test address (run by the global teardown); MailHog may not be running */
export async function deleteTestMails() {
  try {
    for (const message of await messagesTo('@e2e.test')) {
      await fetch(`${MAILHOG}/api/v1/messages/${message.ID}`, { method: 'DELETE' })
    }
  } catch {
    // Nothing to clean when MailHog is down
  }
}
