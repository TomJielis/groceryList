import { test as setup, expect, type Page } from '@playwright/test'
import { listsHeading, logIn } from '../support/helpers'
import { testUser } from '../support/users'

// Logs in once and saves the session for the logged-in (lists, pages) and admin tests
async function saveSession(page: Page, which: 'user' | 'admin', path: string) {
  const user = testUser(which)
  await logIn(page, user.email, user.password)
  await expect(listsHeading(page)).toBeVisible()
  await page.context().storageState({ path })
}

setup('log in', async ({ page }) => {
  await saveSession(page, 'user', 'node_modules/.cache/e2e/auth/state.json')
})

setup('log in as admin', async ({ page }) => {
  await saveSession(page, 'admin', 'node_modules/.cache/e2e/auth/admin.json')
})
