import { test, expect } from '../support/test'
import { addItem, addScreenRow, createList, itemRow, listRow, open } from '../support/helpers'

test('remove a product from the add screen', async ({ page }) => {
  const name = await createList(page, 'remove-item')
  await addItem(page, name, 'E2E Eggs')

  await page.getByRole('button', { name: 'Add items' }).first().click()
  const row = addScreenRow(page, 'E2E Eggs')
  // The × at the end of the row takes it off the list again
  await row.locator('button').last().click()
  await expect(row).toHaveCount(0)

  await page.locator('.list-add-shell button').first().click()
  await expect(page.getByText('No Items Yet')).toBeVisible()
})

test('remove a product by setting its quantity to 0', async ({ page }) => {
  const name = await createList(page, 'remove-item-zero')
  await addItem(page, name, 'E2E Butter')

  await itemRow(page, 'E2E Butter').click()
  const editor = page.locator('.list-item-row:visible').filter({ has: page.getByPlaceholder('Product naam') })
  await editor.getByRole('button', { name: '−' }).click()
  // At 0 the save button turns into delete
  await editor.getByRole('button', { name: 'Delete' }).click()

  await expect(itemRow(page, 'E2E Butter')).toHaveCount(0)
  await open(page, '/')
  await expect(listRow(page, name)).toBeVisible()
})
