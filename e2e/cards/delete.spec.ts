import { test, expect } from '../support/test'
import { uploadCard } from '../support/helpers'

test('delete a card after typing its name', async ({ page }) => {
  await uploadCard(page, 'E2E Old card')

  await page.getByTitle('Delete card').click()
  const dialog = page.getByRole('dialog', { name: 'Delete Card' })
  const confirm = dialog.getByRole('button', { name: 'Delete card' })
  await expect(confirm).toBeDisabled()
  await dialog.getByRole('textbox').fill('E2E Old card')
  await confirm.click()

  await expect(page.getByRole('heading', { name: 'E2E Old card' })).toHaveCount(0)
  await expect(page.getByText('No cards yet')).toBeVisible()
})
