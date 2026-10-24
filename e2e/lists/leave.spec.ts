import { test, expect } from '../support/test'
import { createList, listRow, open, openListMenu, sessionAs, shareList } from '../support/helpers'
import { FRIEND_EMAIL, testUser } from '../support/users'

test('a member leaves a shared list; the owner keeps it', async ({ page, browser }) => {
  const name = await createList(page, 'leave')
  await shareList(page, name, FRIEND_EMAIL)

  const friend = await sessionAs(browser, testUser('friend'))
  await open(friend.page, '/profile')
  const invite = friend.page.locator('div').filter({ hasText: name }).filter({ has: friend.page.getByRole('button', { name: 'Approve' }) }).last()
  await invite.getByRole('button', { name: 'Approve' }).click()
  await open(friend.page, '/')

  // Members only get favorite and leave in the menu
  await openListMenu(friend.page, name)
  await expect(friend.page.getByRole('menuitem', { name: 'Edit' })).toHaveCount(0)
  await friend.page.getByRole('menuitem', { name: 'Leave list' }).click()
  const dialog = friend.page.getByRole('dialog')
  await dialog.getByRole('textbox').fill(name)
  await dialog.getByRole('button', { name: 'Delete' }).click()
  await expect(listRow(friend.page, name)).toHaveCount(0)
  await friend.context.close()

  await open(page, '/')
  await expect(listRow(page, name)).toBeVisible()
})
