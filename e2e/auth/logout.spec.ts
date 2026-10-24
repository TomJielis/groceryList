import { test, expect } from '@playwright/test'
import { listsHeading, logIn, open } from '../support/helpers'
import { testUser } from '../support/users'

test('log out from the profile page', async ({ page }) => {
  // Its own login: logging out only ends this session, not the one the other tests share
  const user = testUser()
  await logIn(page, user.email, user.password)
  await expect(listsHeading(page)).toBeVisible()

  await open(page, '/profile')
  await page.getByRole('button', { name: 'Log out' }).click()
  await expect(page).not.toHaveURL(/\/profile$/)

  // The lists are no longer reachable
  await open(page, '/')
  await expect(page).toHaveURL(/\/information$/)
})
