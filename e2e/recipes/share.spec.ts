import { test, expect } from '../support/test'
import { cookbookMenu, createCookbook, createRecipe, open, sessionAs } from '../support/helpers'
import { testUser } from '../support/users'

test('sharing a cookbook by link: the friend joins on the website, sees its recipes, and the creator removes them', async ({ page, browser }) => {
  const name = await createCookbook(page, 'cookbook-share')
  await createRecipe(page, 'E2E Shared soup')

  // Without a share sheet (desktop Chromium, made sure of here) the link goes to the clipboard
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.addInitScript(() => { delete (Navigator.prototype as any).share })
  await open(page, '/recipes')
  await page.getByTestId('cookbook-select').selectOption({ label: `${name} (1)` })
  await cookbookMenu(page, 'Share cookbook')
  await expect(page.getByText('Link copied')).toBeVisible()
  const url = await page.evaluate(() => navigator.clipboard.readText())
  expect(url).toMatch(/\/auth\/invite\/[A-Za-z0-9]+$/)

  // The friend opens the link, joins, and lands on the cookbook with its recipe
  const friend = await sessionAs(browser, testUser('friend'))
  await open(friend.page, new URL(url).pathname)
  await expect(friend.page.getByText('invites you to share a cookbook')).toBeVisible()
  await friend.page.getByRole('button', { name: 'Join', exact: true }).click()
  await expect(friend.page).toHaveURL(/\/recipes\?cookbook=\d+$/)
  await expect(friend.page.getByText(`You have joined ${name}.`)).toBeVisible()
  await expect(friend.page.getByText('E2E Shared soup')).toBeVisible()
  // Not the creator: no rename or share, only leave
  await friend.page.getByTestId('cookbook-menu').click()
  await expect(friend.page.getByRole('menuitem', { name: 'Leave cookbook' })).toBeVisible()
  await expect(friend.page.getByRole('menuitem', { name: 'Share cookbook' })).toHaveCount(0)
  await friend.page.keyboard.press('Escape')

  // The creator sees the friend under "Has access" and removes them
  await open(page, '/recipes')
  await page.getByTestId('cookbook-select').selectOption({ label: `${name} · shared (1)` })
  await cookbookMenu(page, 'Edit cookbook')
  await expect(page.getByText('Has access (2)')).toBeVisible()
  await page.getByRole('button', { name: 'Remove from cookbook' }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click()
  await expect(page.getByText('This person no longer has access.')).toBeVisible()

  await open(friend.page, '/recipes')
  await expect(friend.page.getByText('Make a cookbook first')).toBeVisible()
  await friend.context.close()
})
