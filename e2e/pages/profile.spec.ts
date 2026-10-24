import { test, expect } from '../support/test'
import { open } from '../support/helpers'
import { USER_EMAIL } from '../support/users'

test('the profile page', async ({ page }) => {
  await open(page, '/profile')
  await expect(page.getByText('Profile Information')).toBeVisible()
  await expect(page.getByText(USER_EMAIL).first()).toBeVisible()
  await expect(page.getByText('Language Settings')).toBeVisible()
  // Only admins get the dashboard link
  await expect(page.getByText('Admin Dashboard')).toHaveCount(0)
})
