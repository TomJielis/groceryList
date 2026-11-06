import { test, expect } from '../support/test'
import { createList, listRow, logIn, open, shareLink } from '../support/helpers'
import { linkFromMail, pathOf } from '../support/mailhog'
import { uniqueEmail } from '../support/users'

// Someone without an account opens an invite link, registers, verifies the address and logs in: they're asked once on
// the invite and added with one tap. The new account is an @e2e.test address, removed again by the global teardown.
test('someone without an account registers from an invite link and gets the list', async ({ page, browser }) => {
  const email = uniqueEmail('invited')
  const password = `Invited-${Date.now()}`
  const name = await createList(page, 'share-new-account')
  const invitePath = await shareLink(page, name)

  // Logged out: a context of its own, without the project's login
  const context = await browser.newContext({ storageState: { cookies: [], origins: [] } })
  const invited = await context.newPage()
  await open(invited, invitePath)
  await invited.getByRole('link', { name: 'Create an account' }).click()
  await expect(invited).toHaveURL(/\/auth\/register$/)

  await invited.getByPlaceholder('example@gmail.com').fill(email)
  await invited.getByPlaceholder('Your name').fill('E2E Invited')
  await invited.getByPlaceholder('••••••••').fill(password)
  await invited.locator('label[for="terms"]').click()
  await invited.getByRole('button', { name: 'Register', exact: true }).click()
  await expect(invited.getByText('Verify your email')).toBeVisible()

  await open(invited, pathOf(await linkFromMail(email, '/auth/')))
  await expect(invited.getByText('Your email has been verified. You can now log in to your account.')).toBeVisible()
  await logIn(invited, email, password)

  // Back to the invite: asked once, "Join" and into the list
  await invited.getByRole('button', { name: 'Join', exact: true }).click()
  await expect(invited).toHaveURL(/\/list\/\d+$/)
  await expect(invited.getByText(`You have joined ${name}.`)).toBeVisible()
  await open(invited, '/')
  await expect(listRow(invited, name)).toBeVisible()
  await context.close()
})
