import { test, expect } from '@playwright/test'
import { open } from '../support/helpers'
import { uniqueEmail } from '../support/users'

test('asking for a reset link shows the check-your-email message', async ({ page }) => {
  await open(page, '/auth/password/reset')
  await expect(page.getByText('Forgot password', { exact: true })).toBeVisible()

  // An address without an account gets the same answer, so nobody can probe which addresses exist
  await page.getByPlaceholder('example@gmail.com').fill(uniqueEmail('forgot'))
  await page.getByRole('button', { name: 'Send' }).click()

  await expect(page.getByText('Check your email!')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Back to login' })).toBeVisible()
})
