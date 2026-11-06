import { test, expect } from '../support/test'
import { createList, joinByLink, listRow, open, openListMenu, sessionAs, shareLink } from '../support/helpers'
import { FRIEND_EMAIL, testUser } from '../support/users'

test('opening an invite link while logged in asks once, then joins; the owner removes the member again', async ({ page, browser }) => {
  const name = await createList(page, 'share-accept')
  const invitePath = await shareLink(page, name)

  const friend = await sessionAs(browser, testUser('friend'))
  await expect(listRow(friend.page, name)).toHaveCount(0)

  // "No thanks": back to the lists, not in it (and the link still works afterwards)
  await open(friend.page, invitePath)
  await friend.page.getByRole('button', { name: 'No thanks', exact: true }).click()
  await expect(friend.page).toHaveURL(/\/$/)
  await expect(listRow(friend.page, name)).toHaveCount(0)

  // "Join" adds the friend and opens the list
  await joinByLink(friend.page, invitePath, name)
  await open(friend.page, '/')
  await expect(listRow(friend.page, name)).toBeVisible()

  // Opening it again as a member goes straight to the list, without asking or joining twice
  await open(friend.page, invitePath)
  await expect(friend.page).toHaveURL(/\/list\/\d+$/)
  await expect(friend.page.getByText(`You have joined ${name}.`)).toHaveCount(0)

  // The owner sees the friend under "Shared with" and removes them
  await open(page, '/')
  await openListMenu(page, name)
  await page.getByRole('menuitem', { name: 'Edit' }).click()
  const shared = page.locator('div.flex.items-center.justify-between').filter({ hasText: FRIEND_EMAIL })
  await shared.getByRole('button').click()
  await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click()
  await expect(page.getByText('User removed from list')).toBeVisible()

  await open(friend.page, '/')
  await expect(listRow(friend.page, name)).toHaveCount(0)
  await friend.context.close()
})

test('an invite link that does not exist says so', async ({ page }) => {
  await open(page, '/auth/invite/doesNotExist1234567890')
  await expect(page.getByText('Link not found')).toBeVisible()
  await expect(page).toHaveURL(/\/auth\/invite\//)
})
