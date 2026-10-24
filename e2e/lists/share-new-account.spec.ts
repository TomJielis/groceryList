import { test, expect } from '../support/test'
import { createList, listRow, listsHeading, logIn, open, shareList } from '../support/helpers'
import { linkFromMail, pathOf } from '../support/mailhog'
import { uniqueEmail } from '../support/users'

// Sharing with an address without an account mails an invite; registering through it gives access to the list.
// The new account is an @e2e.test address, removed again by the global teardown.
test('someone without an account registers from the invite mail and gets the list', async ({ page, browser }) => {
  const email = uniqueEmail('invited')
  const password = `Invited-${Date.now()}`
  const name = await createList(page, 'share-new-account')
  await shareList(page, name, email)

  const context = await browser.newContext()
  const invited = await context.newPage()

  // The invite links to the register page with the address filled in (and locked)
  const inviteLink = pathOf(await linkFromMail(email, '/auth/register'))
  await open(invited, inviteLink)
  const emailInput = invited.getByPlaceholder('example@gmail.com')
  await expect(emailInput).toHaveValue(email)
  await expect(emailInput).toBeDisabled()
  await invited.getByPlaceholder('Your name').fill('E2E Invited')
  await invited.getByPlaceholder('••••••••').fill(password)
  await invited.locator('label[for="terms"]').click()
  await invited.getByRole('button', { name: 'Register', exact: true }).click()
  await expect(invited.getByText('Verify your email')).toBeVisible()

  // The invite's button a second time: the account exists now, so registering again is refused
  await open(invited, inviteLink)
  await invited.getByPlaceholder('Your name').fill('E2E Invited again')
  await invited.getByPlaceholder('••••••••').fill(password)
  await invited.getByRole('button', { name: 'Register', exact: true }).click()
  await expect(invited.getByText('An account with this email address already exists.')).toBeVisible()

  await open(invited, pathOf(await linkFromMail(email, '/auth/')))
  await expect(invited.getByText('Your email has been verified. You can now log in to your account.')).toBeVisible()
  await logIn(invited, email, password)
  await expect(listsHeading(invited)).toBeVisible()

  // The invite is waiting on the profile page
  await open(invited, '/profile')
  const invite = invited.locator('div').filter({ hasText: name }).filter({ has: invited.getByRole('button', { name: 'Approve' }) }).last()
  await invite.getByRole('button', { name: 'Approve' }).click()
  await expect(invited.getByText('List has been added to your lists.')).toBeVisible()
  await open(invited, '/')
  await expect(listRow(invited, name)).toBeVisible()
  await context.close()
})
