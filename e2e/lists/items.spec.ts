import { test, expect } from '../support/test'
import { addScreenRow, createList, itemRow, listRow } from '../support/helpers'

test('add a product, change its quantity with + and −, check and uncheck it', async ({ page }) => {
  const product = 'E2E Milk'
  const name = await createList(page, 'items')
  await listRow(page, name).click()
  await expect(page.getByText('No Items Yet')).toBeVisible()

  await page.getByRole('button', { name: 'Add your first item' }).click()
  await page.getByPlaceholder('Enter new item').fill(product)
  // The typed name is offered as the first suggestion; clicking it adds it to the list
  await page.locator('div.cursor-pointer.group').filter({ hasText: product }).first().click()

  const inList = addScreenRow(page, product)
  const quantity = inList.locator('span.select-none')
  await expect(quantity).toHaveText('1')
  await inList.getByRole('button', { name: '+' }).click()
  await expect(quantity).toHaveText('2')
  await inList.getByRole('button', { name: '−' }).click()
  await expect(quantity).toHaveText('1')

  // Back to the list
  await page.locator('.list-add-shell button').first().click()
  await expect(itemRow(page, product)).toContainText('1x')

  await itemRow(page, product).locator('label').click()
  await expect(page.getByText('All done!')).toBeVisible()
  const completed = page.getByRole('button', { name: /Completed/ })
  await expect(completed).toContainText('1')

  // Unchecking brings it back to the open products
  await completed.click()
  await itemRow(page, product).locator('label').click()
  await expect(page.getByText('All done!')).toBeHidden()
  await expect(page.getByRole('button', { name: /Completed/ })).toHaveCount(0)
  await expect(itemRow(page, product)).toBeVisible()
})

test('a quick + then − keeps the product, even when the + reaches the server slowly', async ({ page }) => {
  const product = 'E2E Bread'
  const name = await createList(page, 'quick')
  await listRow(page, name).click()
  await page.getByRole('button', { name: 'Add your first item' }).click()
  await page.getByPlaceholder('Enter new item').fill(product)
  await page.locator('div.cursor-pointer.group').filter({ hasText: product }).first().click()
  const inList = addScreenRow(page, product)
  await expect(inList.locator('span.select-none')).toHaveText('1')

  // The + takes a while to reach the server; the − is tapped right after it
  await page.route('**/api/groceryListItem/increase', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    await route.continue()
  })
  await inList.getByRole('button', { name: '+' }).click()
  await inList.getByRole('button', { name: '−' }).click()
  await expect(inList.locator('span.select-none')).toHaveText('1')

  // What the server has: the product is still there with 1
  await page.waitForResponse('**/api/groceryListItem/decrease')
  await page.reload()
  await expect(itemRow(page, product)).toContainText('1x')
})
