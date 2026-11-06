import { test, expect } from '../support/test'
import { cookbookMenu, createCookbook, open } from '../support/helpers'

test('without a cookbook the recipes page asks to make one first', async ({ page }) => {
  await open(page, '/recipes')
  await expect(page.getByText('Make a cookbook first')).toBeVisible()
  await expect(page.getByRole('button', { name: 'New recipe' })).toHaveCount(0)
})

test('make, rename and delete a cookbook', async ({ page }) => {
  const name = await createCookbook(page, 'cookbook')
  const select = page.getByTestId('cookbook-select')

  // The selected cookbook is in the address, so a reload keeps it
  await expect(page).toHaveURL(/\/recipes\?cookbook=\d+$/)
  await page.reload()
  await expect(select.locator('option:checked')).toContainText(name)

  const renamed = `${name} renamed`
  await cookbookMenu(page, 'Edit cookbook')
  await expect(page.getByRole('heading', { name: 'Edit cookbook' })).toBeVisible()
  // The creator is the only one with access so far
  await expect(page.getByText('Has access (1)')).toBeVisible()
  const nameInput = page.getByPlaceholder('E.g. Cooking together')
  await nameInput.fill(renamed)
  await nameInput.press('Enter')
  await expect(page.getByText('Cookbook updated.')).toBeVisible()
  await expect(select.locator('option:checked')).toContainText(renamed)

  // Deleting asks to type its name
  await cookbookMenu(page, 'Delete cookbook')
  const dialog = page.getByRole('dialog', { name: 'Delete cookbook?' })
  await expect(dialog.getByText('To confirm, type the name of the cookbook:')).toBeVisible()
  const deleteButton = dialog.getByRole('button', { name: 'Delete cookbook' })
  await expect(deleteButton).toBeDisabled()
  await dialog.getByRole('textbox').fill(renamed)
  await deleteButton.click()
  await expect(page.getByText('Cookbook deleted.')).toBeVisible()
  await expect(page.getByText('Make a cookbook first')).toBeVisible()
})
