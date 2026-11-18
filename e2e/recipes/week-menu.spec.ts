import { test, expect } from '../support/test'
import { createCookbook, createList, createRecipe, itemRow, listRow, open, sessionAs } from '../support/helpers'
import { testUser } from '../support/users'

// A day as the page knows it (YYYY-MM-DD in the browser's time)
function dateKey(offset = 0) {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

async function openWeekMenu(page: import('@playwright/test').Page) {
  await open(page, '/recipes')
  await page.getByTestId('recipes-week-menu').click()
  await expect(page).toHaveURL(/\/recipes\/week-menu$/)
}

// Plans the recipe called `title` on the day `key` (the week shown must contain it)
async function plan(page: import('@playwright/test').Page, key: string, title: string) {
  await page.getByTestId(`week-menu-add-${key}`).click()
  await page.getByRole('dialog').getByRole('button', { name: title }).click()
  await expect(page.getByTestId(`week-menu-day-${key}`).getByText(title)).toBeVisible()
}

test('make a week menu, plan dishes with servings, open one and put only the new dishes on a list', async ({ page }) => {
  const listName = await createList(page, 'week')
  await createCookbook(page, 'week')
  await createRecipe(page, 'E2E Week pasta')

  // Nobody has a week menu until they make one
  await openWeekMenu(page)
  await expect(page.getByTestId('week-menu-empty')).toBeVisible()
  await page.getByTestId('week-menu-create').click()
  await expect(page.getByTestId('week-menu-week')).toBeVisible()

  // Today (always in the week shown), for 2 more servings, right on the dish
  const today = dateKey()
  await plan(page, today, 'E2E Week pasta')
  const todayCard = page.getByTestId(`week-menu-day-${today}`)
  await todayCard.getByRole('button', { name: /^More servings for/ }).click()
  await todayCard.getByRole('button', { name: /^More servings for/ }).click()
  await expect(todayCard.getByText('6 servings')).toBeVisible()
  // Saved: still 6 after loading the page again (both changes reached the server)
  await expect(async () => {
    await page.reload()
    await expect(todayCard.getByText('6 servings')).toBeVisible({ timeout: 2000 })
  }).toPass()

  // Opening it shows the whole recipe for the planned servings; back goes to the week menu
  await todayCard.getByText('E2E Week pasta').click()
  await expect(page).toHaveURL(/\/recipes\/\d+\?servings=6&from=week-menu$/)
  await expect(page.getByTestId('recipe-servings')).toHaveText('6 servings')
  await expect(page.getByText('300 g spaghetti')).toBeVisible()
  await expect(page.getByTestId('recipe-save-copy')).toHaveCount(0)
  await page.getByRole('link', { name: 'Back' }).first().click()
  await expect(page).toHaveURL(/\/recipes\/week-menu$/)

  // The new dish on the list
  await expect(page.getByTestId('week-menu-add-week')).toHaveText(/Put on my list \(1 new\)/)
  await page.getByTestId('week-menu-add-week').click()
  const dialog = page.getByRole('dialog', { name: 'On your shopping list' })
  await expect(dialog.getByText('spaghetti', { exact: true })).toBeVisible()
  await dialog.getByRole('button', { name: listName }).click()
  await dialog.getByTestId('week-menu-list-add').click()
  await expect(page.getByText(`The ingredients are on "${listName}"`)).toBeVisible()

  // The dish has its check with the list; nothing new to add
  await expect(todayCard.getByText(`On "${listName}"`)).toBeVisible()
  await expect(page.getByTestId('week-menu-add-week')).toHaveText(/All dishes are on a list/)
  await expect(page.getByTestId('week-menu-add-week')).toBeDisabled()

  // Planned from the recipe page for tomorrow (within this week or next): only that one is new
  await open(page, '/recipes')
  await page.getByText('E2E Week pasta').first().click()
  await page.getByTestId('recipe-plan').click()
  await page.getByTestId(`recipe-plan-${dateKey(1)}`).click()
  await expect(page.getByText(/E2E Week pasta is on/)).toBeVisible()
  await openWeekMenu(page)
  await expect(page.getByTestId('week-menu-week')).toBeVisible()
  // On a Sunday, tomorrow is in next week
  if (new Date().getDay() === 0) await page.getByTestId('week-menu-next').click()
  await expect(page.getByTestId(`week-menu-day-${dateKey(1)}`).getByText('E2E Week pasta')).toBeVisible()

  // "Put on the list again": the check goes and the dish counts as new again
  await open(page, '/recipes/week-menu')
  await todayCard.getByRole('button', { name: /^Options for/ }).click()
  await page.getByTestId('week-menu-add-again').click()
  await expect(todayCard.getByText(`On "${listName}"`)).toHaveCount(0)

  await open(page, '/')
  await listRow(page, listName).click()
  await expect(itemRow(page, 'Spaghetti')).toBeVisible()
})

test('a shared week menu: the friend sees a private dish, can open and save it, but not invite others', async ({ page, browser }) => {
  await createCookbook(page, 'week-share')
  await createRecipe(page, 'E2E Private curry')
  await openWeekMenu(page)
  await page.getByTestId('week-menu-create').click()
  await plan(page, dateKey(), 'E2E Private curry')

  // Only the creator shares it, by link (to the clipboard without a share sheet)
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.evaluate(() => { delete (Navigator.prototype as any).share })
  await page.getByTestId('week-menu-share').click()
  await expect(page.getByText('Link copied')).toBeVisible()
  const url = await page.evaluate(() => navigator.clipboard.readText())
  expect(url).toMatch(/\/auth\/invite\/[A-Za-z0-9]+$/)

  const friend = await sessionAs(browser, testUser('friend'))
  await open(friend.page, new URL(url).pathname)
  await expect(friend.page.getByText('invites you to share a week menu')).toBeVisible()
  await friend.page.getByRole('button', { name: 'Join', exact: true }).click()
  await expect(friend.page).toHaveURL(/\/recipes\/week-menu$/)
  await expect(friend.page.getByText('E2E Private curry')).toBeVisible()
  // A member doesn't invite others
  await expect(friend.page.getByTestId('week-menu-share')).toHaveCount(0)

  // The friend opens the private recipe (read-only, no favourite) and keeps an own copy
  await friend.page.getByText('E2E Private curry').click()
  await expect(friend.page.getByRole('heading', { name: 'E2E Private curry' })).toBeVisible()
  await expect(friend.page.getByTestId('recipe-favorite')).toHaveCount(0)
  // It isn't in the friend's recipe book until they save it (once the page has loaded: the friend has no cookbook)
  await open(friend.page, '/recipes')
  await expect(friend.page.getByText('Make a cookbook first')).toBeVisible()
  await expect(friend.page.getByText('E2E Private curry')).toHaveCount(0)
  await friend.page.goBack()
  await friend.page.getByTestId('recipe-save-copy').click()
  await expect(friend.page.getByText('Make a cookbook first to save this recipe in.')).toBeVisible()
  await friend.context.close()
})

test('joining a week menu while having an own one: the dishes come along and one menu is left', async ({ page, browser }) => {
  // The friend planned a dish in an own menu
  const friend = await sessionAs(browser, testUser('friend'))
  await createCookbook(friend.page, 'week-own')
  await createRecipe(friend.page, 'E2E Friends soup')
  await openWeekMenu(friend.page)
  await friend.page.getByTestId('week-menu-create').click()
  await plan(friend.page, dateKey(), 'E2E Friends soup')

  // The user's menu, shared by link
  await openWeekMenu(page)
  await page.getByTestId('week-menu-create').click()
  await expect(page.getByTestId('week-menu-week')).toBeVisible()
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.evaluate(() => { delete (Navigator.prototype as any).share })
  await page.getByTestId('week-menu-share').click()
  await expect(page.getByText('Link copied')).toBeVisible()
  const url = await page.evaluate(() => navigator.clipboard.readText())

  // The friend is asked whether to bring the own dishes along, and does
  await open(friend.page, new URL(url).pathname)
  await expect(friend.page.getByText(/You already have the week menu .* with 1 dish\./)).toBeVisible()
  await friend.page.getByTestId('invite-join-bring').click()
  await expect(friend.page).toHaveURL(/\/recipes\/week-menu$/)
  await expect(friend.page.getByText('E2E Friends soup')).toBeVisible()
  // One menu: no choice between two
  await expect(friend.page.getByRole('button', { name: 'Week menu', exact: true })).toHaveCount(0)

  // The user sees the friend's dish in the shared menu, by the friend
  await open(page, '/recipes/week-menu')
  await expect(page.getByText('E2E Friends soup')).toBeVisible()
  await friend.context.close()
})

test('a second week menu is only made after a warning', async ({ page }) => {
  await openWeekMenu(page)
  await page.getByTestId('week-menu-create').click()
  await expect(page.getByTestId('week-menu-week')).toBeVisible()

  // Asked first; cancelled, there's still one menu (no choice between two)
  await page.getByTestId('week-menu-options').click()
  await page.getByTestId('week-menu-new').click()
  await expect(page.getByText('You already have a week menu')).toBeVisible()
  await page.getByRole('button', { name: 'Cancel' }).click()
  await expect(page.getByRole('button', { name: 'Week menu', exact: true })).toHaveCount(0)

  // Confirmed: a second one, and a choice between the two
  await page.getByTestId('week-menu-options').click()
  await page.getByTestId('week-menu-new').click()
  await page.getByTestId('week-menu-new-confirm').click()
  await expect(page.getByRole('button', { name: 'Week menu', exact: true })).toHaveCount(2)
})

test('putting dishes on a list: choose the days, the others stay new', async ({ page }) => {
  const listName = await createList(page, 'week-days')
  await createCookbook(page, 'week-days')
  await createRecipe(page, 'E2E Day one')
  await open(page, '/recipes')
  await createRecipe(page, 'E2E Day two')

  await openWeekMenu(page)
  await page.getByTestId('week-menu-create').click()
  await expect(page.getByTestId('week-menu-week')).toBeVisible()
  // Another day in this week: tomorrow, or on a Sunday yesterday
  const today = dateKey()
  const other = new Date().getDay() === 0 ? dateKey(-1) : dateKey(1)
  await plan(page, today, 'E2E Day one')
  await plan(page, other, 'E2E Day two')

  // Only today: the other day's dish isn't shopped for now
  await page.getByTestId('week-menu-add-week').click()
  const dialog = page.getByRole('dialog', { name: 'On your shopping list' })
  await expect(dialog.getByText('For which days?')).toBeVisible()
  await expect(dialog.getByTestId(`week-menu-list-day-${today}`)).toHaveAttribute('aria-pressed', 'true')
  const otherDay = dialog.getByTestId(`week-menu-list-day-${other}`)
  if (await otherDay.getAttribute('aria-pressed') === 'true') await otherDay.click()
  await expect(otherDay).toHaveAttribute('aria-pressed', 'false')
  await expect(dialog.getByText('For: E2E Day one').first()).toBeVisible()
  await expect(dialog.getByText(/For: .*E2E Day two/)).toHaveCount(0)
  await dialog.getByRole('button', { name: listName }).click()
  await dialog.getByTestId('week-menu-list-add').click()
  await expect(page.getByText(`The ingredients are on "${listName}"`)).toBeVisible()

  // Today's dish has its check; the other one is still new
  await expect(page.getByTestId(`week-menu-day-${today}`).getByText(`On "${listName}"`)).toBeVisible()
  await expect(page.getByTestId(`week-menu-day-${other}`).getByText(`On "${listName}"`)).toHaveCount(0)
  await expect(page.getByTestId('week-menu-add-week')).toHaveText(/Put on my list \(1 new\)/)
})

// Two people with the same week menu open: what one plans or changes shows up for the other without reloading
test('planning together: changes show up live for the other person', async ({ page, browser }) => {
  await createCookbook(page, 'week-live')
  await createRecipe(page, 'E2E Live lasagne')
  await openWeekMenu(page)
  await page.getByTestId('week-menu-create').click()
  await expect(page.getByTestId('week-menu-week')).toBeVisible()
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.evaluate(() => { delete (Navigator.prototype as any).share })
  await page.getByTestId('week-menu-share').click()
  await expect(page.getByText('Link copied')).toBeVisible()
  const url = await page.evaluate(() => navigator.clipboard.readText())

  const friend = await sessionAs(browser, testUser('friend'))
  await open(friend.page, new URL(url).pathname)
  await friend.page.getByRole('button', { name: 'Join', exact: true }).click()
  await expect(friend.page).toHaveURL(/\/recipes\/week-menu$/)
  await expect(friend.page.getByTestId('week-menu-week')).toBeVisible()

  // Planned by the creator: the friend sees it come in (no reload)
  const today = dateKey()
  await plan(page, today, 'E2E Live lasagne')
  await expect(friend.page.getByTestId(`week-menu-day-${today}`).getByText('E2E Live lasagne')).toBeVisible()

  // More servings by the friend: the creator sees the new number
  const friendsCard = friend.page.getByTestId(`week-menu-day-${today}`)
  await friendsCard.getByRole('button', { name: /^More servings for/ }).click()
  const servings = (await friendsCard.getByText(/\d+ servings/).textContent())?.trim() ?? ''
  await expect(page.getByTestId(`week-menu-day-${today}`).getByText(servings)).toBeVisible()
  await friend.context.close()
})
