import { test, expect, type Page } from '@playwright/test'
import { open } from '../support/helpers'
import { testUser, uniqueEmail } from '../support/users'

// Register is rate-limited per address, so every attempt uses a fresh one (nothing gets registered)
async function submit(page: Page, data: { name?: string; email?: string; password?: string }) {
  await page.getByPlaceholder('Your name').fill(data.name ?? '')
  await page.getByPlaceholder('example@gmail.com').fill(data.email ?? '')
  await page.getByPlaceholder('••••••••').fill(data.password ?? '')
  await page.getByRole('button', { name: 'Register', exact: true }).click()
}

test('the register page shows a message for each invalid field', async ({ page }) => {
  await open(page, '/auth/register')
  await expect(page.getByText('Create a free account')).toBeVisible()

  await submit(page, { email: uniqueEmail('register'), password: 'longenough1' })
  await expect(page.getByText('Please enter your name.')).toBeVisible()

  // The browser itself refuses an invalid address (type="email"), before anything is sent
  await submit(page, { name: 'E2E', email: `not-an-email-${Date.now()}`, password: 'longenough1' })
  const emailInput = page.getByPlaceholder('example@gmail.com')
  expect(await emailInput.evaluate((input: HTMLInputElement) => input.validationMessage)).not.toBe('')
  await expect(page.getByText('Create a free account')).toBeVisible()

  await submit(page, { name: 'E2E', email: uniqueEmail('register'), password: 'short' })
  await expect(page.getByText('Your password must be at least 8 characters.')).toBeVisible()

  // An address that has an account; a fresh one each run, as the rate limit counts per address
  await submit(page, { name: 'E2E', email: testUser('mail').email, password: 'longenough1' })
  await expect(page.getByText('An account with this email address already exists.')).toBeVisible()
})
