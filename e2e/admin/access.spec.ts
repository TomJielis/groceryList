import { test, expect } from '@playwright/test'
import { open } from '../support/helpers'

test('a normal user cannot open the admin pages', async ({ browser }) => {
  const context = await browser.newContext({ storageState: 'node_modules/.cache/e2e/auth/state.json' })
  const page = await context.newPage()
  await open(page, '/admin')
  await expect(page).not.toHaveURL(/\/admin/)
  await context.close()
})

test('the profile page links an admin to the dashboard', async ({ page }) => {
  await open(page, '/profile')
  await page.getByText('Admin Dashboard').click()
  await expect(page).toHaveURL(/\/admin$/)
})
