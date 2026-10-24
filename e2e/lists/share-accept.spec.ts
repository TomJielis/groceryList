import { test, expect } from '../support/test'
import { createList, listRow, open, openListMenu, sessionAs, shareList } from '../support/helpers'
import { expectMail } from '../support/mailhog'
import { FRIEND_EMAIL, testUser } from '../support/users'

test('the invited user accepts, sees the list, and the owner removes them again', async ({ page, browser }) => {
  const name = await createList(page, 'share-accept')
  await shareList(page, name, FRIEND_EMAIL)
  // An existing account gets an invite mail naming the list
  await expectMail(FRIEND_EMAIL, name)

  const friend = await sessionAs(browser, testUser('friend'))
  await expect(listRow(friend.page, name)).toHaveCount(0)
  // Pending invitations are on the profile page
  await open(friend.page, '/profile')
  const invite = friend.page.locator('div').filter({ hasText: name }).filter({ has: friend.page.getByRole('button', { name: 'Approve' }) }).last()
  await invite.getByRole('button', { name: 'Approve' }).click()
  await expect(friend.page.getByText('List has been added to your lists.')).toBeVisible()
  await open(friend.page, '/')
  await expect(listRow(friend.page, name)).toBeVisible()

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
