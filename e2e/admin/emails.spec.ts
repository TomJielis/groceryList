import { test, expect } from '@playwright/test'
import { createList, open, shareList } from '../support/helpers'
import { linkFromMail } from '../support/mailhog'
import { FRIEND_EMAIL, testUser } from '../support/users'

test('the emails page filters sent mails and shows one in detail', async ({ page }) => {
  // A mail of our own to look at: a reset link for a throwaway user (its log row goes with the teardown)
  const RESET_EMAIL = testUser('mail').email
  await page.request.post('/api/user/resetPassword', { data: { email: RESET_EMAIL } })
  await linkFromMail(RESET_EMAIL, '/auth/password/')

  await open(page, '/admin/emails')
  await expect(page.getByText(/\d+ emails/)).toBeVisible()
  await page.locator('select').first().selectOption('reset_password')
  await page.locator('select').nth(1).selectOption('sent')

  const row = page.getByRole('row').filter({ hasText: RESET_EMAIL }).first()
  await expect(row).toBeVisible()
  await row.click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog).toContainText(RESET_EMAIL)
  await expect(dialog).toContainText('reset password')
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
})

test('the emails page filters on invites', async ({ page }) => {
  // An invite of our own: the friend, to a list of the admin's
  const name = await createList(page, 'admin-mail')
  await shareList(page, name, FRIEND_EMAIL)

  await open(page, '/admin/emails')
  await page.locator('select').first().selectOption('grocery_list_invite_mail')
  const row = page.getByRole('row').filter({ hasText: FRIEND_EMAIL }).first()
  await expect(row).toBeVisible()
  await expect(page.getByRole('row').filter({ hasText: testUser('mail').email })).toHaveCount(0)

  await row.click()
  await expect(page.getByRole('dialog')).toContainText(FRIEND_EMAIL)
  await expect(page.getByRole('dialog')).toContainText('grocery list invite mail')
})
