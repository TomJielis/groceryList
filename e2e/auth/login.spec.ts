import { test, expect } from '@playwright/test'
import { listsHeading, open } from '../support/helpers'
import { testUser } from '../support/users'

test('an empty login is refused and a filled-in one logs in', async ({ page }) => {
  const user = testUser()
  await open(page, '/auth/login')

  const loginButton = page.getByRole('button', { name: 'Login', exact: true })
  // The button stays disabled until both fields are filled, so an empty login never reaches the API
  await expect(loginButton).toBeDisabled()
  await page.getByPlaceholder('example@gmail.com').fill(user.email)
  await expect(loginButton).toBeDisabled()
  await page.getByPlaceholder('••••••••').fill(user.password)
  await expect(loginButton).toBeEnabled()
  await loginButton.click()

  await expect(listsHeading(page)).toBeVisible()
})

test('links to the register and forgot-password pages', async ({ page }) => {
  await open(page, '/auth/login')
  await page.getByRole('link', { name: 'Forgot password?' }).click()
  await expect(page).toHaveURL(/\/auth\/password\/reset$/)

  await open(page, '/auth/login')
  await page.getByRole('button', { name: 'Create new account' }).click()
  await expect(page).toHaveURL(/\/auth\/register$/)
})
