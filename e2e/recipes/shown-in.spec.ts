import { test, expect } from '../support/test'
import { cookbookMenu, createCookbook, createRecipe, open, selectCookbook } from '../support/helpers'

test('a recipe also shown in another cookbook, and the warning when its own cookbook is deleted', async ({ page }) => {
  const home = await createCookbook(page, 'home')
  await createRecipe(page, 'E2E Curry')
  const second = await createCookbook(page, 'second')
  // The second cookbook is empty so far
  await expect(page.getByText('No recipes yet')).toBeVisible()

  // "Also show in" the second cookbook
  await selectCookbook(page, home)
  await page.getByText('E2E Curry').click()
  await page.getByRole('button', { name: 'Edit recipe' }).click()
  await expect(page.getByText('Also show in')).toBeVisible()
  await page.locator('label').filter({ hasText: second }).click()
  await page.getByRole('button', { name: 'Save recipe' }).click()
  await expect(page.getByText('Recipe saved')).toBeVisible()

  // Now in both, and once under "All recipes"
  await open(page, '/recipes')
  await selectCookbook(page, second)
  await expect(page.getByText('E2E Curry')).toBeVisible()
  await page.getByTestId('cookbook-select').selectOption({ label: 'All recipes' })
  await expect(page.locator('a[data-testid^="recipe-card-"]')).toHaveCount(1)

  // Deleting its own cookbook says the recipe goes, also from the second one
  await selectCookbook(page, home)
  await cookbookMenu(page, 'Delete cookbook')
  const dialog = page.getByRole('dialog', { name: 'Delete cookbook?' })
  await expect(dialog.getByText(
    `The cookbook and the recipe in it will be deleted for good, also for anyone you share it with. It is also shown in ${second} and will disappear there too.`,
  )).toBeVisible()
  await dialog.getByRole('textbox').fill(home)
  await dialog.getByRole('button', { name: 'Delete cookbook' }).click()
  await expect(page.getByText('Cookbook deleted.')).toBeVisible()

  // Gone from the second cookbook too
  await selectCookbook(page, second)
  await expect(page.getByText('No recipes yet')).toBeVisible()
})

test('deleting a cookbook with several recipes counts them', async ({ page }) => {
  const name = await createCookbook(page, 'many')
  await createRecipe(page, 'E2E One')
  await open(page, '/recipes')
  await selectCookbook(page, name)
  await createRecipe(page, 'E2E Two')

  await open(page, '/recipes')
  await selectCookbook(page, name)
  await cookbookMenu(page, 'Delete cookbook')
  await expect(page.getByRole('dialog').getByText(
    'The cookbook and the 2 recipes in it will be deleted for good, also for anyone you share it with.',
  )).toBeVisible()
})
