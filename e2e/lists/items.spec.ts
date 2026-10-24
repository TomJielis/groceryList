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
