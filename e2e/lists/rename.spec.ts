import { test, expect } from '../support/test'
import { createList, listRow, openListMenu } from '../support/helpers'

test('rename a list', async ({ page }) => {
  const name = await createList(page, 'rename')
  const renamed = `${name} renamed`
  await openListMenu(page, name)
  await page.getByRole('menuitem', { name: 'Edit' }).click()

  await expect(page.getByRole('heading', { name: 'Edit list' })).toBeVisible()
  const nameInput = page.getByPlaceholder('Enter new list')
  await expect(nameInput).toHaveValue(name)
  await nameInput.fill(renamed)
  await nameInput.press('Enter')

  await expect(page.getByText('List is updated!')).toBeVisible()
  await expect(listRow(page, renamed)).toBeVisible()
})
