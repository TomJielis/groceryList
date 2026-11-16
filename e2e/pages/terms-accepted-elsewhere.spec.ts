import { test, expect } from '../support/test'
import { open } from '../support/helpers'

test('terms accepted in the app meanwhile are not asked again on the website', async ({ page }) => {
  // The login saved in this browser still says an older version; the account accepted the current one (in the app)
  await open(page, '/profile')
  await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('auth') || '{}')
    saved.user.accepted_terms_version = '1.0'
    localStorage.setItem('auth', JSON.stringify(saved))
  })

  await open(page, '/')

  // The accept page asks the server, sees it's accepted already and goes on to the lists
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('button', { name: /New list|Create your first list/ }).first()).toBeVisible()
})
