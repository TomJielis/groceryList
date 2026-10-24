import { test, expect } from '../support/test'
import { createList, openListMenu } from '../support/helpers'
import { FRIEND_EMAIL } from '../support/users'

test('share a list with someone (invite)', async ({ page }) => {
  const name = await createList(page, 'share')
  await openListMenu(page, name)
  await page.getByRole('menuitem', { name: 'Share' }).click()

  const dialog = page.getByRole('dialog', { name: 'Share List' })
  const emailInput = dialog.getByPlaceholder('Email address')
  const shareButton = dialog.getByRole('button', { name: 'Share' })
  await emailInput.fill('not-an-email')
  await expect(dialog.getByText('Please enter a valid email address')).toBeVisible()
  await expect(shareButton).toBeDisabled()

  await emailInput.fill(FRIEND_EMAIL)
  await shareButton.click()
  await expect(page.getByText('List has been shared!')).toBeVisible()
  await expect(dialog).toBeHidden()
})
