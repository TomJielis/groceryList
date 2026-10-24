import { test, expect } from '../support/test'
import { createList, listRow, open, sessionAs, shareList } from '../support/helpers'
import { FRIEND_EMAIL, testUser } from '../support/users'

test('the invited user declines and does not get the list', async ({ page, browser }) => {
  const name = await createList(page, 'share-decline')
  await shareList(page, name, FRIEND_EMAIL)

  const friend = await sessionAs(browser, testUser('friend'))
  await open(friend.page, '/profile')
  const invite = friend.page.locator('div').filter({ hasText: name }).filter({ has: friend.page.getByRole('button', { name: 'Decline' }) }).last()
  await invite.getByRole('button', { name: 'Decline' }).click()
  await expect(friend.page.getByText('List invitation has been declined.')).toBeVisible()

  await open(friend.page, '/')
  await expect(listRow(friend.page, name)).toHaveCount(0)
  await friend.context.close()
})
