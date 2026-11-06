import { join } from 'node:path'
import { test, expect } from '../support/test'
import { createCookbook, createRecipe, open } from '../support/helpers'

test('add a recipe, view it for more servings, edit it with a photo, favourite and delete it', async ({ page }) => {
  await createCookbook(page, 'recipes')
  await createRecipe(page, 'E2E Spaghetti')

  // The ingredients and steps as typed; for 5 servings instead of 4 the amounts go up by a quarter
  await expect(page.getByText('200 g spaghetti')).toBeVisible()
  await expect(page.getByText('Season with salt.')).toBeVisible()
  await page.getByRole('button', { name: '+ servings' }).click()
  await expect(page.getByTestId('recipe-servings')).toHaveText('5 servings')
  await expect(page.getByText('250 g spaghetti')).toBeVisible()

  // Edit: another title and a photo
  await page.getByRole('button', { name: 'Edit recipe' }).click()
  await expect(page.getByPlaceholder("E.g. Grandma's lasagne")).toHaveValue('E2E Spaghetti')
  await page.getByPlaceholder("E.g. Grandma's lasagne").fill('E2E Spaghetti aglio')
  await page.getByTestId('recipe-photo-input').setInputFiles(join(import.meta.dirname, '../fixtures/card.png'))
  await page.getByRole('button', { name: 'Save recipe' }).click()
  await expect(page.getByText('Recipe saved')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'E2E Spaghetti aglio' })).toBeVisible()
  // The photo comes through this site (the API's address needs the login)
  const photo = page.getByRole('img', { name: 'E2E Spaghetti aglio' })
  await expect(photo).toBeVisible()
  await expect(photo).toHaveAttribute('src', /^\/api\/recipes\/\d+\/image\?v=/)
  expect(await photo.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0)

  // Favourite: shown with a star in the overview and under "Favourites"
  await page.getByTestId('recipe-favorite').click()
  await expect(page.getByText('Added to your favourites')).toBeVisible()
  await open(page, '/recipes')
  await page.getByRole('button', { name: 'Favourites' }).click()
  const card = page.locator('a[data-testid^="recipe-card-"]').filter({ hasText: 'E2E Spaghetti aglio' })
  await expect(card).toBeVisible()
  await expect(card.getByLabel('Favourite')).toBeVisible()

  // Found by an ingredient
  await page.getByRole('button', { name: 'All', exact: true }).click()
  await page.getByPlaceholder('Search by recipe or ingredient').fill('spaghet')
  await expect(card).toBeVisible()
  await page.getByPlaceholder('Search by recipe or ingredient').fill('lasagne')
  await expect(page.getByText('No recipes found')).toBeVisible()

  // Delete
  await page.getByPlaceholder('Search by recipe or ingredient').fill('')
  await card.click()
  await page.getByTestId('recipe-delete').click()
  await page.getByRole('dialog', { name: 'Delete recipe?' }).getByRole('button', { name: 'Delete recipe' }).click()
  await expect(page.getByText('Recipe deleted')).toBeVisible()
  await expect(page).toHaveURL(/\/recipes$/)
  await expect(page.getByText('No recipes yet')).toBeVisible()
})

test('a recipe needs a title', async ({ page }) => {
  await createCookbook(page, 'recipe-title')
  await page.getByRole('button', { name: 'Add your first recipe' }).click()
  await expect(page.getByRole('button', { name: 'Add recipe', exact: true })).toBeDisabled()
  await page.getByPlaceholder("E.g. Grandma's lasagne").fill('E2E Title only')
  await expect(page.getByRole('button', { name: 'Add recipe', exact: true })).toBeEnabled()
})

test('a recipe that is not in your cookbooks says so', async ({ page }) => {
  await open(page, '/recipes/999999999')
  await expect(page.getByText("This recipe doesn't exist (any more)")).toBeVisible()
})
