import { test, expect } from '@playwright/test'
import { open } from '../support/helpers'
import { ADMIN_EMAIL } from '../support/users'

test('the users page lists users and opens their details', async ({ page }) => {
  await open(page, '/admin/users')
  await expect(page.getByText(/\d+ Total users/)).toBeVisible()
  for (const label of ['Active users', 'Verified emails', 'Blocked']) {
    await expect(page.getByText(label, { exact: true }).first(), label).toBeVisible()
  }

  // Sorted by last activity, so the admin who just logged in is on the first page
  await page.getByRole('row').filter({ hasText: ADMIN_EMAIL }).getByRole('link', { name: 'Details' }).click()
  await expect(page).toHaveURL(/\/admin\/users\/\d+$/)
  await expect(page.getByText('User Info')).toBeVisible()
})
