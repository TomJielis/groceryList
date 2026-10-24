import { test, expect } from '../support/test'
import { acceptInvite, addItem, createList, itemRow, listRow, open, sessionAs, shareList } from '../support/helpers'
import { FRIEND_EMAIL, testUser } from '../support/users'

// Owner and member of a shared list see each other's products and checks
test('both users of a shared list see each other\'s products', async ({ page, browser }) => {
  const name = await createList(page, 'shared-items')
  await addItem(page, name, 'E2E Owner apples')
  await shareList(page, name, FRIEND_EMAIL)

  const friend = await sessionAs(browser, testUser('friend'))
  await acceptInvite(friend.page, name)

  // The member sees what the owner added, and adds something too
  await addItem(friend.page, name, 'E2E Friend pears')
  await expect(itemRow(friend.page, 'E2E Owner apples')).toBeVisible()

  // The owner sees the member's product
  await open(page, '/')
  await listRow(page, name).click()
  await expect(itemRow(page, 'E2E Friend pears')).toBeVisible()
  await expect(itemRow(page, 'E2E Owner apples')).toBeVisible()

  // A check by the member reaches the owner
  await itemRow(friend.page, 'E2E Owner apples').locator('label').click()
  await expect(friend.page.getByRole('button', { name: /Completed/ })).toContainText('1')
  await page.reload()
  await expect(page.getByRole('button', { name: /Completed/ })).toContainText('1')
  await friend.context.close()
})
