import { test, expect } from '../support/test'
import { listRow, listsHeading, open } from '../support/helpers'

test('create a list', async ({ page }) => {
  const name = `E2E create ${Date.now()}`
  await open(page, '/')
  await expect(listsHeading(page)).toBeVisible()

  await page.getByRole('button', { name: /New list|Create your first list/ }).first().click()
  const nameInput = page.getByPlaceholder('Enter new list')
  await nameInput.fill(name)
  await nameInput.press('Enter')

  await expect(page.getByText('List is created!')).toBeVisible()
  await expect(listRow(page, name)).toBeVisible()
})
