import { test, expect } from '@playwright/test'
import { open } from '../support/helpers'

test('an invalid activation link says so and links to login', async ({ page }) => {
  await open(page, '/auth/not-a-valid-code')

  await expect(page.getByText('This link is invalid. Please use the link from the most recent email.')).toBeVisible()
  await page.getByRole('button', { name: 'Go to login' }).click()
  await expect(page).toHaveURL(/\/auth\/login$/)
})
