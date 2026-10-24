import { test, expect } from '@playwright/test'
import { open } from '../support/helpers'

test('a used or invalid reset link offers a new one', async ({ page }) => {
  await open(page, '/auth/password/not-a-valid-token')

  await expect(page.getByText('Link no longer valid')).toBeVisible()
  const requestNew = page.getByRole('button', { name: 'Request a new link' })
  await expect(requestNew).toBeVisible()

  await requestNew.click()
  await expect(page).toHaveURL(/\/auth\/password\/reset$/)
})
