import { test, expect } from '../support/test'
import { createCookbook, createRecipe, open } from '../support/helpers'

test('the statistics page, from the profile page', async ({ page }) => {
  await open(page, '/profile')
  await page.locator('a[href="/profile/stats"]').click()
  await expect(page).toHaveURL(/\/profile\/stats$/)
  await expect(page.getByText('View your item activity and top items')).toBeVisible()
  await expect(page.getByText('Item Activity').first()).toBeVisible()
  await expect(page.getByText('Top Items').first()).toBeVisible()
  await expect(page.getByText('Monthly Spend').first()).toBeVisible()
})

test('the statistics count the recipes and cookbooks you added', async ({ page }) => {
  await createCookbook(page, 'stats')
  await createRecipe(page, 'E2E Stats soup')

  await open(page, '/profile/stats')
  await expect(page.getByRole('heading', { name: 'Recipes' })).toBeVisible()
  for (const [title, value] of [
    ['Recipes added', '1'], ['Cookbooks created', '1'], ['Recipes added (all time)', '1'], ['Recipes in your cookbooks', '1'],
  ]) {
    const card = page.locator('div.py-4').filter({ has: page.getByText(title, { exact: true }) })
    await expect(card.getByText(value, { exact: true }).first(), title).toBeVisible()
  }
})
