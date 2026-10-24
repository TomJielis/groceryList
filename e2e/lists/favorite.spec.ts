import { test, expect } from '../support/test'
import { createList, openListMenu } from '../support/helpers'

test('mark a list as favorite and remove it again', async ({ page }) => {
  const name = await createList(page, 'favorite')

  await openListMenu(page, name)
  await page.getByRole('menuitem', { name: 'Mark as favorite' }).click()
  await expect(page.getByText('List marked as favorite!')).toBeVisible()

  await openListMenu(page, name)
  await page.getByRole('menuitem', { name: 'Remove favorite' }).click()

  await openListMenu(page, name)
  await expect(page.getByRole('menuitem', { name: 'Mark as favorite' })).toBeVisible()
})
