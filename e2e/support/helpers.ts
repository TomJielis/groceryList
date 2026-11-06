import { expect, type Browser, type Page } from '@playwright/test'
import { join } from 'node:path'
import type { TestUser } from './users'

// Server-rendered pages ignore clicks and typing until Vue has hydrated them, so wait for the app to mount
export async function open(page: Page, path: string) {
  await page.goto(path)
  await page.waitForFunction(() => Boolean((document.querySelector('#__nuxt') as any)?.__vue_app__))
}

export async function logIn(page: Page, email: string, password: string) {
  await open(page, '/auth/login')
  await page.getByPlaceholder('example@gmail.com').fill(email)
  await page.getByPlaceholder('••••••••').fill(password)
  await page.getByRole('button', { name: 'Login', exact: true }).click()
}

export const listsHeading = (page: Page) => page.getByRole('heading', { name: 'Your grocery lists' })

export function listRow(page: Page, name: string) {
  return page.locator('div.cursor-pointer.py-4').filter({ hasText: name })
}

export async function openListMenu(page: Page, name: string) {
  await listRow(page, name).locator('button').click()
}

/** Creates a list through the lists page and leaves the page there; the name is unique per call */
export async function createList(page: Page, label: string): Promise<string> {
  const name = `E2E ${label} ${Date.now()}`
  await open(page, '/')
  await page.getByRole('button', { name: /New list|Create your first list/ }).first().click()
  const nameInput = page.getByPlaceholder('Enter new list')
  await nameInput.fill(name)
  await nameInput.press('Enter')
  await expect(listRow(page, name)).toBeVisible()
  return name
}

/** Opens the list, adds `product` through the add screen and returns to the list */
export async function addItem(page: Page, listName: string, product: string) {
  await open(page, '/')
  await listRow(page, listName).click()
  await page.getByRole('button', { name: /Add your first item|Add items/ }).first().click()
  await page.getByPlaceholder('Enter new item').fill(product)
  await page.locator('div.cursor-pointer.group').filter({ hasText: product }).first().click()
  await expect(addScreenRow(page, product)).toBeVisible()
  await page.locator('.list-add-shell button').first().click()
  await expect(itemRow(page, product)).toBeVisible()
}

/** A product's row in the "In your list" part of the add screen */
export function addScreenRow(page: Page, product: string) {
  return page.locator('div.py-3').filter({ hasText: product }).filter({ has: page.getByRole('button', { name: '+' }) })
}

/** A product's row on the list page (the desktop table; the mobile rows are hidden) */
export function itemRow(page: Page, product: string) {
  return page.locator('.list-item-row:visible').filter({ hasText: product })
}

/** A second browser session, logged in as another throwaway user (for sharing) */
export async function sessionAs(browser: Browser, user: TestUser) {
  const context = await browser.newContext()
  const page = await context.newPage()
  await logIn(page, user.email, user.password)
  await expect(listsHeading(page)).toBeVisible()
  return { context, page }
}

/**
 * Shares the list through its menu, which is only by invite link: without a share sheet (desktop Chromium, made sure
 * of here) the link goes to the clipboard. Returns the link's path, so it opens on the server under test.
 */
export async function shareLink(page: Page, listName: string): Promise<string> {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.addInitScript(() => { delete (Navigator.prototype as any).share })
  await open(page, '/')
  await openListMenu(page, listName)
  await page.getByRole('menuitem', { name: 'Share' }).click()
  await expect(page.getByText('Link copied')).toBeVisible()
  const url = await page.evaluate(() => navigator.clipboard.readText())
  expect(url).toMatch(/\/auth\/invite\/[A-Za-z0-9]+$/)
  return new URL(url).pathname
}

/** Opens an invite link while logged in: asked once who invites to what, "Join" adds you and opens the list */
export async function joinByLink(page: Page, invitePath: string, listName: string) {
  await open(page, invitePath)
  await expect(page.getByText(listName).first()).toBeVisible()
  await page.getByRole('button', { name: 'Join', exact: true }).click()
  await expect(page).toHaveURL(/\/list\/\d+$/)
  await expect(page.getByText(`You have joined ${listName}.`)).toBeVisible()
}

/** Shares the owner's list by link and lets `member` join through it */
export async function shareWith(owner: Page, listName: string, member: Page) {
  const invitePath = await shareLink(owner, listName)
  await joinByLink(member, invitePath, listName)
  return invitePath
}

/** Uploads e2e/fixtures/card.png as a card called `title` from the cards page */
export async function uploadCard(page: Page, title: string) {
  await open(page, '/cards')
  await page.getByRole('button', { name: /Upload your first card|Add card/ }).first().click()
  await page.getByPlaceholder('E.g. Albert Heijn Bonus Card').fill(title)
  await page.locator('input[type="file"]').setInputFiles(join(import.meta.dirname, '../fixtures/card.png'))
  await page.getByRole('button', { name: 'Upload', exact: true }).click()
  await expect(page.getByText('Card uploaded')).toBeVisible()
  await expect(page.getByRole('heading', { name: title })).toBeVisible()
}
