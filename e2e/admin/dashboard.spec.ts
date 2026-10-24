import { test, expect } from '@playwright/test'
import { open } from '../support/helpers'

// Admin pages show real users' data, so the admin tests only read (except for their own throwaway data)
test('the admin dashboard shows every statistic and links on', async ({ page }) => {
  await open(page, '/admin')
  await expect(page.getByText('Admin Dashboard').first()).toBeVisible()
  for (const title of [
    'Total users', 'New users', 'Active users', 'Verified emails', 'Invalid login attempts (this month)',
    'Items added', 'Items checked', 'Lists created', 'Shared lists', 'Total spend',
    'Daily Activity', 'Version Distribution', 'Top 10 Active Lists',
  ]) {
    await expect(page.getByText(title, { exact: true }).first(), title).toBeVisible()
  }

  await page.locator('a[href="/admin/top-items"]').first().click()
  await expect(page).toHaveURL(/\/admin\/top-items$/)
})
