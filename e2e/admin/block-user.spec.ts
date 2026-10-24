import { test, expect } from '@playwright/test'
import { open } from '../support/helpers'
import { FRIEND_EMAIL, testUser } from '../support/users'

test('block and unblock a user', async ({ page }) => {
  await open(page, `/admin/users/${testUser('friend').id}`)
  await expect(page.getByText(FRIEND_EMAIL).first()).toBeVisible()
  await expect(page.getByText('Active', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Block', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByText('Are you sure you want to block this user?')).toBeVisible()
  await dialog.getByRole('button', { name: 'Block', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Unblock', exact: true })).toBeVisible()
  await expect(page.getByText('Blocked', { exact: true }).first()).toBeVisible()

  await page.getByRole('button', { name: 'Unblock', exact: true }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Unblock', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Block', exact: true })).toBeVisible()
  await expect(page.getByText('Active', { exact: true })).toBeVisible()
})
