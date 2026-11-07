import { test, expect } from '@playwright/test'
import { open } from '../support/helpers'

// The Android app as a download (logged out, like someone who doesn't have the app yet). Whether there is an APK
// depends on the server (NUXT_ANDROID_APK_PATH), so the page has to match what the server says.
test('the Android page offers the APK when the server has one, with how to install it', async ({ page, request }) => {
  const info = (await (await request.get('/api/android/info')).json()).data

  await open(page, '/android')
  await expect(page.getByRole('heading', { name: 'Shoplisto for Android' })).toBeVisible()
  // iPhone users are sent to TestFlight while the app is in beta, otherwise to the App Store
  await expect(page.getByRole('link', { name: /Try Shoplisto via TestFlight|Get Shoplisto in the App Store/ }))
    .toHaveAttribute('href', /^https:\/\/(testflight|apps)\.apple\.com\//)

  if (!info.available) {
    await expect(page.getByTestId('android-unavailable')).toBeVisible()
    await expect(page.getByTestId('android-download')).toHaveCount(0)
    return
  }

  await expect(page.getByRole('button', { name: 'Download for Android' })).toBeVisible()
  await expect(page.getByText(`${Math.round(info.size / 1_000_000)} MB`)).toBeVisible()
  await expect(page.getByText('How to install it')).toBeVisible()
  await expect(page.getByText('Install unknown apps', { exact: false })).toBeVisible()

  // The file comes as an app a phone offers to install
  const download = await request.head('/downloads/shoplisto.apk')
  expect(download.status()).toBe(200)
  expect(download.headers()['content-type']).toBe('application/vnd.android.package-archive')
  expect(download.headers()['content-disposition']).toContain('Shoplisto.apk')
  expect(Number(download.headers()['content-length'])).toBe(info.size)
})

test('the information page links to the Android download', async ({ page }) => {
  await open(page, '/information')
  await page.getByRole('link', { name: 'Download for Android' }).click()
  await expect(page).toHaveURL(/\/android$/)
})
