import { test, expect } from '../support/test'
import { open } from '../support/helpers'

test('the statistics page, from the profile page', async ({ page }) => {
  await open(page, '/profile')
  await page.locator('a[href="/profile/stats"]').click()
  await expect(page).toHaveURL(/\/profile\/stats$/)
  await expect(page.getByText('View your item activity and top items')).toBeVisible()
  await expect(page.getByText('Item Activity').first()).toBeVisible()
  await expect(page.getByText('Top Items').first()).toBeVisible()
  await expect(page.getByText('Monthly Spend').first()).toBeVisible()
})
