import { test, expect } from '@playwright/test'
import { listsHeading, logIn, open } from '../support/helpers'
import { linkFromMail, pathOf } from '../support/mailhog'
import { uniqueEmail } from '../support/users'

// A brand-new @e2e.test account; the global teardown removes it again
test('register, get refused until activated, activate through the mail and log in', async ({ page }) => {
  const email = uniqueEmail('register')
  const password = `Register-${Date.now()}`

  await open(page, '/auth/register')
  await page.getByPlaceholder('Your name').fill('E2E Registered')
  await page.getByPlaceholder('example@gmail.com').fill(email)
  await page.getByPlaceholder('••••••••').fill(password)
  await page.locator('label[for="terms"]').click()
  await page.getByRole('button', { name: 'Register', exact: true }).click()
  await expect(page.getByText('Verify your email')).toBeVisible()

  await logIn(page, email, password)
  await expect(page.getByText(/Email not verified/)).toBeVisible()
  await expect(page).toHaveURL(/\/auth\/login$/)

  const activationLink = pathOf(await linkFromMail(email, '/auth/'))
  await open(page, activationLink)
  await expect(page.getByText('Your email has been verified. You can now log in to your account.')).toBeVisible()

  // The same mail button again: already verified, not an error
  await open(page, activationLink)
  await expect(page.getByText('Your email address has already been verified. You can log in to your account.')).toBeVisible()

  await logIn(page, email, password)
  await expect(listsHeading(page)).toBeVisible()
  await expect(page.getByText('No Lists Yet')).toBeVisible()
})
