import { test, expect } from '@playwright/test'
import { open } from '../support/helpers'
import { uniqueEmail } from '../support/users'

test('asking for a reset link shows the check-your-email message', async ({ page }) => {
  await open(page, '/auth/password/reset')
  await expect(page.getByText('Forgot password', { exact: true })).toBeVisible()

  // An address without an account gets the same answer, so nobody can probe which addresses exist
  await page.getByPlaceholder('example@gmail.com').fill(uniqueEmail('forgot'))
  await page.getByRole('button', { name: 'Send' }).click()

  await expect(page.getByText('Check your email!')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Back to login' })).toBeVisible()
})

test('tapping Send twice still sends one reset request', async ({ page }) => {
  // A second request sends a second mail and makes the link in the first one invalid (every request replaces the
  // code). Counted at the website's own endpoint, with a fresh address, so the API's limit of 3 an hour doesn't matter.
  let requests = 0
  page.on('request', request => {
    if (request.method() === 'POST' && request.url().includes('/api/user/resetPassword')) requests++
  })

  await open(page, '/auth/password/reset')
  await page.getByPlaceholder('example@gmail.com').fill(uniqueEmail('forgot-twice'))
  await page.getByRole('button', { name: 'Send' }).dblclick()

  await expect(page.getByText('Check your email!')).toBeVisible()
  expect(requests).toBe(1)
})
