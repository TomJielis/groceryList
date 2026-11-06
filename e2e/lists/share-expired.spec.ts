import { test, expect } from '../support/test'
import { createList, listRow, open, sessionAs, shareLink } from '../support/helpers'
import { testUser } from '../support/users'

// The local API itself (Valet); the website has no button to withdraw a link, so the test does it there
const API = process.env.E2E_API_URL || 'http://localhost'

test('a withdrawn invite link says it no longer works and does not add you', async ({ page, browser }) => {
  const name = await createList(page, 'share-expired')
  const invitePath = await shareLink(page, name)
  const linkToken = invitePath.split('/').pop()!

  // Withdrawn by its maker (the API treats withdrawn like expired)
  const bearer = await page.evaluate(() => JSON.parse(localStorage.getItem('auth') || '{}').token as string)
  const res = await page.request.delete(`${API}/api/invite-links/${linkToken}/delete`, {
    headers: { Authorization: `Bearer ${bearer}`, Accept: 'application/json' },
  })
  expect(res.ok()).toBe(true)

  const friend = await sessionAs(browser, testUser('friend'))
  await open(friend.page, invitePath)
  await expect(friend.page.getByText('This link has expired')).toBeVisible()
  await expect(friend.page.getByText(/no longer works: it has expired or was withdrawn/)).toBeVisible()
  await expect(friend.page).toHaveURL(/\/auth\/invite\//)
  await open(friend.page, '/')
  await expect(listRow(friend.page, name)).toHaveCount(0)
  await friend.context.close()
})
