import { test, expect } from '@playwright/test'
import { open } from '../support/helpers'

test('the top items page, for this and the previous month', async ({ page }) => {
  await open(page, '/admin/top-items')
  await expect(page.getByText('Most Added').first()).toBeVisible()
  await expect(page.getByText('Most Checked').first()).toBeVisible()

  const subtitle = page.locator('p').filter({ hasText: /\d{4}/ }).first()
  const currentPeriod = await subtitle.textContent()
  await page.getByRole('button', { name: 'Previous month' }).click()
  await expect(subtitle).not.toHaveText(currentPeriod ?? '')
  await expect(page.getByText('Most Added').first()).toBeVisible()
})
