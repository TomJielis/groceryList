import { test, expect } from '../support/test'
import { addItem, createList, listRow } from '../support/helpers'

// A product typed in by hand (not one of the standard suggestions) is offered as a suggestion in every list from then on
test('a product added by hand shows up in the suggestions afterwards', async ({ page }) => {
  const product = `E2E Homemade ${Date.now()}`
  const first = await createList(page, 'own-product')
  // Only added, not checked off: that's enough
  await addItem(page, first, product)

  // In another list, without typing anything
  const second = await createList(page, 'own-product-2')
  await listRow(page, second).click()
  await page.getByRole('button', { name: 'Add your first item' }).click()
  await expect(page.locator('div.cursor-pointer.group').filter({ hasText: product })).toBeVisible()

  // Typing part of it finds it too
  await page.getByPlaceholder('Enter new item').fill(product.slice(0, 12))
  await expect(page.locator('div.cursor-pointer.group').filter({ hasText: product })).toBeVisible()
})
