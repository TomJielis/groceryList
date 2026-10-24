import { test, expect } from '../support/test'
import { addItem, createList, itemRow, listRow, open, openListMenu, shareList } from '../support/helpers'
import { FRIEND_EMAIL } from '../support/users'

// The lists page sums each list up: progress, what is left, and who it is shared with (initials)
test('the lists page shows progress and the people a list is shared with', async ({ page }) => {
  const name = await createList(page, 'overview')
  const row = listRow(page, name)
  await expect(row).toContainText('0%')
  await expect(row).toContainText('—') // not shared yet

  await addItem(page, name, 'E2E Koffie')
  await addItem(page, name, 'E2E Thee')
  await open(page, '/')
  await expect(row).toContainText('0%')
  await expect(row.locator('div.text-sm.w-24')).toHaveText(/2\s*\/\s*2/)

  // Everything checked: 100% and nothing left
  await row.click()
  await itemRow(page, 'E2E Koffie').locator('label').click()
  await expect(page.getByRole('button', { name: /Completed/ })).toContainText('1')
  await open(page, '/')
  await expect(row).toContainText('50%')
  await expect(row.locator('div.text-sm.w-24')).toHaveText(/1\s*\/\s*2/)
  await row.click()
  await itemRow(page, 'E2E Thee').locator('label').click()
  await expect(page.getByText('All done!')).toBeVisible()
  await open(page, '/')
  await expect(row).toContainText('100%')
  await expect(row.locator('div.text-sm.w-24')).toHaveText(/0\s*\/\s*2/)

  // Shared: the friend's initial appears in the "Shared with" column
  await shareList(page, name, FRIEND_EMAIL)
  await expect(row.locator('span.rounded-full').filter({ hasText: /^E$/ })).toBeVisible()
  await expect(row).not.toContainText('—')

  // Removed from the list again: the initial goes, "—" comes back
  await openListMenu(page, name)
  await page.getByRole('menuitem', { name: 'Edit' }).click()
  await page.locator('div.flex.items-center.justify-between').filter({ hasText: FRIEND_EMAIL }).getByRole('button').click()
  await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click()
  await expect(page.getByText('User removed from list')).toBeVisible()
  await open(page, '/')
  await expect(row.locator('span.rounded-full').filter({ hasText: /^E$/ })).toHaveCount(0)
  await expect(row).toContainText('—')
})
