import { test, expect } from '../support/test'
import { open, uploadCard } from '../support/helpers'

test('create a card with a photo and view it', async ({ page }) => {
  await uploadCard(page, 'E2E Bonus card')

  // Still there after a reload, with its picture
  await open(page, '/cards')
  const image = page.getByRole('img', { name: 'E2E Bonus card' })
  await expect(image.first()).toBeVisible()
  // A hover overlay covers the picture, so click the card's picture area
  await page.locator('div.cursor-pointer').filter({ has: image }).first().click()
  // Opens large in an overlay, with a close button
  const overlay = page.locator('div.fixed.inset-0').filter({ has: page.getByRole('img', { name: 'E2E Bonus card' }) })
  await expect(overlay).toBeVisible()
  await overlay.getByRole('button').click()
  await expect(overlay).toBeHidden()
})

test('a card needs a title and a photo', async ({ page }) => {
  await open(page, '/cards')
  await page.getByRole('button', { name: 'Upload your first card' }).click()
  const upload = page.getByRole('button', { name: 'Upload', exact: true })
  await expect(upload).toBeDisabled()
  await page.getByPlaceholder('E.g. Albert Heijn Bonus Card').fill('E2E No photo')
  await expect(upload).toBeDisabled()
})
