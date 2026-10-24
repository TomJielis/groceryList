import { test, expect } from '../support/test'
import { createList, listRow, openListMenu } from '../support/helpers'

test('delete a list after typing its name', async ({ page }) => {
  const name = await createList(page, 'delete')
  await openListMenu(page, name)
  await page.getByRole('menuitem', { name: 'Delete' }).click()

  const dialog = page.getByRole('dialog', { name: 'Delete List' })
  const deleteButton = dialog.getByRole('button', { name: 'Delete' })
  await expect(deleteButton).toBeDisabled()
  await dialog.getByRole('textbox').fill(name)
  await deleteButton.click()

  await expect(dialog).toBeHidden()
  await expect(listRow(page, name)).toHaveCount(0)
})
