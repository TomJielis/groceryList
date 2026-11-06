import { test, expect } from '../support/test'
import { cookbookMenu, createCookbook, createRecipe, joinCookbookByLink, open, selectCookbook, sessionAs, shareCookbookLink } from '../support/helpers'
import { testUser } from '../support/users'

test('sharing a cookbook by link: the friend joins on the website, sees its recipes, and the creator removes them', async ({ page, browser }) => {
  const name = await createCookbook(page, 'cookbook-share')
  await createRecipe(page, 'E2E Shared soup')
  const invitePath = await shareCookbookLink(page, name)

  // The friend opens the link, joins, and lands on the cookbook with its recipe
  const friend = await sessionAs(browser, testUser('friend'))
  await joinCookbookByLink(friend.page, invitePath, name)
  await expect(friend.page.getByText('E2E Shared soup')).toBeVisible()
  // Not the creator: no rename or share, only leave
  await friend.page.getByTestId('cookbook-menu').click()
  await expect(friend.page.getByRole('menuitem', { name: 'Leave cookbook' })).toBeVisible()
  await expect(friend.page.getByRole('menuitem', { name: 'Share cookbook' })).toHaveCount(0)
  await expect(friend.page.getByRole('menuitem', { name: 'Edit cookbook' })).toHaveCount(0)
  await friend.page.keyboard.press('Escape')

  // The creator sees the friend under "Has access" and removes them
  await open(page, '/recipes')
  await selectCookbook(page, name)
  await cookbookMenu(page, 'Edit cookbook')
  await expect(page.getByText('Has access (2)')).toBeVisible()
  await page.getByRole('button', { name: 'Remove from cookbook' }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click()
  await expect(page.getByText('This person no longer has access.')).toBeVisible()

  await open(friend.page, '/recipes')
  await expect(friend.page.getByText('Make a cookbook first')).toBeVisible()
  await friend.context.close()
})

test('someone a cookbook is shared with can leave it; the creator keeps it', async ({ page, browser }) => {
  const name = await createCookbook(page, 'cookbook-leave')
  await createRecipe(page, 'E2E Leave stew')
  const invitePath = await shareCookbookLink(page, name)

  const friend = await sessionAs(browser, testUser('friend'))
  await joinCookbookByLink(friend.page, invitePath, name)
  await cookbookMenu(friend.page, 'Leave cookbook')
  // Leaving doesn't ask to type the name (it only goes for them)
  const dialog = friend.page.getByRole('dialog', { name: 'Leave cookbook?' })
  await expect(dialog.getByText('You no longer see its recipes. The others keep the cookbook.')).toBeVisible()
  await expect(dialog.getByRole('textbox')).toHaveCount(0)
  await dialog.getByRole('button', { name: 'Leave cookbook' }).click()
  await expect(friend.page.getByText('You left the cookbook.')).toBeVisible()
  await expect(friend.page.getByText('Make a cookbook first')).toBeVisible()
  await friend.context.close()

  // The creator still has it with its recipe, now without the friend
  await open(page, '/recipes')
  await selectCookbook(page, name)
  await expect(page.getByText('E2E Leave stew')).toBeVisible()
  await cookbookMenu(page, 'Edit cookbook')
  await expect(page.getByText('Has access (1)')).toBeVisible()
})

test('a recipe shown in a shared cookbook but living in someone else\'s is read only', async ({ page, browser }) => {
  // The friend has a cookbook of their own with a recipe, and shows that recipe in a second cookbook shared with the user
  const friend = await sessionAs(browser, testUser('friend'))
  const own = await createCookbook(friend.page, 'friend-own')
  await createRecipe(friend.page, 'E2E Friend pie')
  const shared = await createCookbook(friend.page, 'friend-shared')
  await open(friend.page, '/recipes')
  await friend.page.getByText('E2E Friend pie').click()
  await friend.page.getByRole('button', { name: 'Edit recipe' }).click()
  await friend.page.locator('label').filter({ hasText: shared }).click()
  await friend.page.getByRole('button', { name: 'Save recipe' }).click()
  await expect(friend.page.getByText('Recipe saved')).toBeVisible()
  const invitePath = await shareCookbookLink(friend.page, shared)
  await friend.context.close()

  await joinCookbookByLink(page, invitePath, shared)
  await page.getByText('E2E Friend pie').click()
  // From the friend's own cookbook, which the user isn't in: no editing or deleting, only a favourite
  await expect(page.getByText(`From ${own}`)).toBeVisible()
  await expect(page.getByText('read only')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Edit recipe' })).toHaveCount(0)
  await expect(page.getByTestId('recipe-delete')).toHaveCount(0)
  await expect(page.getByTestId('recipe-favorite')).toBeVisible()

  // Typing the edit address doesn't help either
  await open(page, `${new URL(page.url()).pathname}/edit`)
  await expect(page.getByText('This recipe belongs to another cookbook; only the people in it can change it.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Save recipe' })).toHaveCount(0)
})
