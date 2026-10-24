import { test, expect } from '../support/test'
import { addItem, createList, itemRow } from '../support/helpers'

test('edit a product: quantity, price and name', async ({ page }) => {
  const name = await createList(page, 'edit-item')
  await addItem(page, name, 'E2E Bread')

  await itemRow(page, 'E2E Bread').click()
  const editor = page.locator('.list-item-row:visible').filter({ has: page.getByPlaceholder('Product naam') })
  await editor.getByPlaceholder('Product naam').fill('E2E Brown bread')
  await editor.getByRole('button', { name: '+' }).click()
  await editor.getByPlaceholder('0.00').fill('1.50')
  await editor.getByRole('button', { name: 'Save' }).click()

  const row = itemRow(page, 'E2E Brown bread')
  await expect(row).toContainText('2x')
  await expect(row).toContainText('€1.50')
  await expect(row).toContainText('€3.00')
})
