import { test, expect } from '@playwright/test'
import { open } from '../support/helpers'

// The information page, as a visitor without an account sees it: the apps to download first, then what's in them
test('the information page offers the apps first and shows the app and website pictures', async ({ page }) => {
  await open(page, '/information')

  const download = page.getByTestId('app-download')
  await expect(download.getByRole('heading', { name: 'Download the app' })).toBeVisible()
  // iPhone: TestFlight while in beta, otherwise the App Store; Android: the download page on this site
  await expect(download.getByTestId('download-ios')).toHaveAttribute('href', /^https:\/\/(testflight|apps)\.apple\.com\//)
  await expect(download.getByTestId('download-android')).toHaveAttribute('href', '/android')

  // The new features
  for (const title of ['Recipes & cookbooks', 'Cook with timers', 'Widget & Apple Watch']) {
    await expect(page.getByText(title, { exact: true }), title).toBeVisible()
  }

  // Every picture loads: the 10 App Store slides and the 4 website screenshots, in the page's language
  const appScreens = page.getByTestId('app-screens').locator('img')
  await expect(appScreens).toHaveCount(10)
  await expect(appScreens.first()).toHaveAttribute('src', /\/info-screenshots-app\/en\//)
  const websiteScreens = page.locator('img[src*="/info-screenshots/en/"]')
  await expect(websiteScreens).toHaveCount(4)
  for (const img of [...await appScreens.all(), ...await websiteScreens.all()]) {
    await img.scrollIntoViewIfNeeded()
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0), { message: await img.getAttribute('src') ?? '' }).toBe(true)
  }
})

test('on an Android phone the Android download comes first', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 },
    userAgent: 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36',
  })
  const page = await context.newPage()
  await open(page, '/information')
  const android = page.getByTestId('download-android')
  const ios = page.getByTestId('download-ios')
  await expect(android).toBeVisible()
  // Above the iPhone button, and the highlighted one
  await expect.poll(async () => (await android.boundingBox())!.y < (await ios.boundingBox())!.y).toBe(true)
  await expect(android.locator('button')).not.toHaveClass(/p-button-outlined/)
  await expect(ios.locator('button')).toHaveClass(/p-button-outlined/)
  await context.close()
})

test('after switching the language the pictures of the other language show too', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'nl-NL', viewport: { width: 1280, height: 900 } })
  const page = await context.newPage()
  await open(page, '/information')
  const appScreens = page.getByTestId('app-screens').locator('img')
  await expect(appScreens.first()).toHaveAttribute('src', /\/info-screenshots-app\/nl\//)

  // The language menu in the navigation bar
  await page.locator('.navbar-locale-select').click()
  await page.getByRole('option', { name: /EN/ }).click()
  await expect(appScreens.first()).toHaveAttribute('src', /\/info-screenshots-app\/en\//)

  // Not only swapped, but visible (the fade-in also applies to the new pictures)
  for (const img of [...await appScreens.all(), ...await page.locator('img[src*="/info-screenshots/en/"]').all()]) {
    await img.scrollIntoViewIfNeeded()
    await expect.poll(() => img.evaluate((el) => getComputedStyle(el).opacity)).toBe('1')
  }
  await context.close()
})
