import { test, expect } from '@playwright/test'
import { open } from '../support/helpers'
import { FRIEND_EMAIL, testUser } from '../support/users'

test('a user\'s details: info, lists, activity and top items', async ({ page }) => {
  await open(page, `/admin/users/${testUser('friend').id}`)

  await expect(page.getByRole('heading', { name: 'E2E Friend' })).toBeVisible()
  await expect(page.getByText(FRIEND_EMAIL).first()).toBeVisible()
  for (const label of [
    'User Info', 'Registered', 'Email verified', 'Last active', 'App version', 'Status',
    'Owned lists', 'Shared with user', 'Total access',
    'Items Activity', 'Items added (this month)', 'Items checked (this month)', 'Previous month', 'Top Items of this User',
  ]) {
    await expect(page.getByText(label, { exact: true }).first(), label).toBeVisible()
  }
  await expect(page.getByText('Active', { exact: true })).toBeVisible()

  await page.getByRole('link').filter({ has: page.locator('svg') }).first().click()
  await expect(page).toHaveURL(/\/admin\/users$/)
})
