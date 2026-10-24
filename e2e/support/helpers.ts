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

/** Shares the list with `email` through its menu */
export async function shareList(page: Page, listName: string, email: string) {
  await open(page, '/')
  await openListMenu(page, listName)
  await page.getByRole('menuitem', { name: 'Share' }).click()
  const dialog = page.getByRole('dialog', { name: 'Share List' })
  await dialog.getByPlaceholder('Email address').fill(email)
  await dialog.getByRole('button', { name: 'Share' }).click()
  await expect(page.getByText('List has been shared!')).toBeVisible()
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

/** Accepts the pending invite for `listName` on the profile page */
export async function acceptInvite(page: Page, listName: string) {
  await open(page, '/profile')
  const invite = page.locator('div').filter({ hasText: listName }).filter({ has: page.getByRole('button', { name: 'Approve' }) }).last()
  await invite.getByRole('button', { name: 'Approve' }).click()
  await expect(page.getByText('List has been added to your lists.')).toBeVisible()
}
