import { test, expect } from '../support/test'
import { createList, listRow, logIn, open, shareLink } from '../support/helpers'
import { testUser } from '../support/users'

test('opening an invite link logged out, then logging in, joins the list', async ({ page, browser }) => {
  const name = await createList(page, 'share-login')
  const invitePath = await shareLink(page, name)

  // Logged out: a context of its own, without the project's login
  const context = await browser.newContext({ storageState: { cookies: [], origins: [] } })
  const guest = await context.newPage()
  await open(guest, invitePath)
  await expect(guest.getByText('Log in or create an account to join.')).toBeVisible()
  await guest.getByRole('button', { name: 'Log in', exact: true }).click()
  await expect(guest).toHaveURL(/\/auth\/login$/)

  const friend = testUser('friend')
  await logIn(guest, friend.email, friend.password)
  // Back to the invite after logging in: asked once, "Join" adds them
  await guest.getByRole('button', { name: 'Join', exact: true }).click()
  await expect(guest).toHaveURL(/\/list\/\d+$/)
  await expect(guest.getByText(`You have joined ${name}.`)).toBeVisible()
  await open(guest, '/')
  await expect(listRow(guest, name)).toBeVisible()

  // Logging in again later goes to the lists as usual: the invite is not remembered after joining
  await guest.evaluate(() => localStorage.getItem('pendingInviteToken')).then(v => expect(v).toBeNull())
  await context.close()
})
