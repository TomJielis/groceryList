import { test, expect } from '../support/test'
import { createCookbook, createRecipe, open } from '../support/helpers'

// A phone: the bottom bar instead of the top links, and nothing wider than the screen
test.use({ viewport: { width: 390, height: 844 } })

async function expectNoSidewaysScroll(page: import('@playwright/test').Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow, `page is ${overflow}px wider than the screen`).toBeLessThanOrEqual(0)
}

test('recipes on a phone: through the bottom bar, the overview, a recipe and the form fit the screen', async ({ page }) => {
  await open(page, '/')
  await page.locator('.app-bottombar a[href="/recipes"]').click()
  await expect(page).toHaveURL(/\/recipes$/)
  await expect(page.getByText('Make a cookbook first')).toBeVisible()
  await expectNoSidewaysScroll(page)

  await createCookbook(page, 'mobile')
  await createRecipe(page, 'E2E Phone pasta')
  // The recipe page, with its ingredients and steps one under the other
  await expect(page.getByText('200 g spaghetti')).toBeVisible()
  await expect(page.getByText('Boil the pasta.')).toBeVisible()
  await expectNoSidewaysScroll(page)

  // The form: the ingredient row (amount, unit, name) still shows the name field
  await page.getByRole('button', { name: 'Edit recipe' }).click()
  const row = page.getByTestId('ingredient-row').first()
  await expect(row.getByLabel('Ingredient')).toBeVisible()
  await expect(row.getByLabel('Ingredient')).toHaveValue('spaghetti')
  await expectNoSidewaysScroll(page)

  // The overview: the tile, and the category filter scrolls on its own instead of the page
  await open(page, '/recipes')
  await expect(page.getByText('E2E Phone pasta')).toBeVisible()
  await expectNoSidewaysScroll(page)
})
