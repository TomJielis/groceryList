import { test, expect } from '@playwright/test'
import { open } from '../support/helpers'

test('the language button on the login page shows the active language and switches it', async ({ page }) => {
  await open(page, '/auth/login')
  await expect(page.getByText('Welcome back to TomJielis.com')).toBeVisible()

  const toggle = page.getByRole('button', { name: /English|Nederlands/ })
  await expect(toggle).toHaveText('🇬🇧 English')
  await toggle.click()

  await expect(toggle).toHaveText('🇳🇱 Nederlands')
  await expect(page.getByText('Inloggen - TomJielis.com')).toBeVisible()

  await toggle.click()
  await expect(toggle).toHaveText('🇬🇧 English')
})
