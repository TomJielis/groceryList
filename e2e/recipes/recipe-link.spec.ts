import { test, expect } from '../support/test'
import { createCookbook, createRecipe } from '../support/helpers'
import { testUser } from '../support/users'

// The link to one recipe is made in the app (the website has no button for it); the website is where it lands for
// someone without the app: the recipe itself, and how to save it in the app
const API = process.env.E2E_API_URL || 'http://localhost/api'

test('a recipe shared by link opens on the website for someone without the app; a withdrawn link says it expired', async ({ page, browser, request }) => {
  await createCookbook(page, 'recipe-link')
  await createRecipe(page, 'E2E Linked pasta')
  const recipeId = page.url().split('/').pop()

  // The link, made the way the app makes it
  const user = testUser('user')
  const login = await (await request.post(`${API}/login`, { data: { email: user.email, password: user.password } })).json()
  const headers = { Accept: 'application/json', Authorization: `Bearer ${login.access_token}` }
  const link = (await (await request.post(`${API}/recipes/${recipeId}/share-link`, { headers, data: {} })).json()).data
  const path = new URL(link.url).pathname
  expect(path).toMatch(/^\/auth\/recipe\/.+/)

  // Someone not logged in (no app) sees the whole recipe, who shared it, and how to keep it
  const visitor = await browser.newContext()
  const guest = await visitor.newPage()
  await guest.goto(path)
  await expect(guest.getByText('E2E Linked pasta')).toBeVisible()
  await expect(guest.getByText(/Shared by E2E Web/)).toBeVisible()
  await expect(guest.getByText(/4 servings/)).toBeVisible()
  await expect(guest.getByRole('heading', { name: 'Ingredients' })).toBeVisible()
  await expect(guest.getByText(/200 g spaghetti/)).toBeVisible()
  await expect(guest.getByRole('heading', { name: 'Method' })).toBeVisible()
  await expect(guest.getByText('Boil the pasta.')).toBeVisible()
  await expect(guest.getByText(/Want to keep this recipe in your own cookbook\?/)).toBeVisible()
  await expect(guest.getByText(/\{app\}/)).toHaveCount(0)

  // Withdrawn in the app: the same link now says so, without the recipe
  const token = path.split('/').pop()
  await request.delete(`${API}/recipe-links/${token}/delete`, { headers })
  await guest.goto(path)
  await expect(guest.getByText('This link has expired')).toBeVisible()
  await expect(guest.getByText('E2E Linked pasta')).toHaveCount(0)

  // A code that never existed
  await guest.goto('/auth/recipe/does-not-exist')
  await expect(guest.getByText('Link not found')).toBeVisible()
  await visitor.close()
})
