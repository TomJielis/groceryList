import { test, expect } from '@playwright/test'
import { open } from '../support/helpers'
import { linkFromMail } from '../support/mailhog'
import { testUser } from '../support/users'

test('the emails page filters sent mails and shows one in detail', async ({ page }) => {
  // A mail of our own to look at: a reset link for a throwaway user (its log row goes with the teardown)
  const RESET_EMAIL = testUser('mail').email
  await page.request.post('/api/user/resetPassword', { data: { email: RESET_EMAIL } })
  await linkFromMail(RESET_EMAIL, '/auth/password/')

  await open(page, '/admin/emails')
  await expect(page.getByText(/\d+ emails/)).toBeVisible()
  // (The "Grocery list invite" type finds nothing: the API logs those as grocery_list_invite_mail)
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
