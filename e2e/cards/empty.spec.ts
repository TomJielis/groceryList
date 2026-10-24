import { test, expect } from '../support/test'
import { open } from '../support/helpers'

test('the cards page without cards', async ({ page }) => {
  await open(page, '/cards')
  await expect(page.getByText('No cards yet')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Upload your first card' })).toBeVisible()
})
