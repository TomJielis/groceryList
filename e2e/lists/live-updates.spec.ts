import { test, expect } from '../support/test'
import { addItem, createList, itemRow, listRow, open, sessionAs, shareWith } from '../support/helpers'
import { testUser } from '../support/users'

// Two people with the same list open: a check by one reaches the other through the socket, without reloading
test('a check on a shared list shows up live for the other user', async ({ page, browser }) => {
  const name = await createList(page, 'live-updates')
  await addItem(page, name, 'E2E Live apples')

  const friend = await sessionAs(browser, testUser('friend'))
  await shareWith(page, name, friend.page)

  await open(friend.page, '/')
  await listRow(friend.page, name).click()
  await expect(itemRow(friend.page, 'E2E Live apples')).toBeVisible()

  await open(page, '/')
  await listRow(page, name).click()
  await expect(itemRow(page, 'E2E Live apples')).toBeVisible()

  await itemRow(page, 'E2E Live apples').locator('label').click()
  await expect(page.getByRole('button', { name: /Completed/ })).toContainText('1')

  // No reload here: this only passes when the signal came through
  await expect(friend.page.getByRole('button', { name: /Completed/ })).toContainText('1')
  await friend.context.close()
})
