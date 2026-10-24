import { test, expect } from '@playwright/test'
import { listsHeading, logIn, open } from '../support/helpers'
import { linkFromMail, pathOf } from '../support/mailhog'
import { testUser } from '../support/users'

// Uses its own throwaway user, whose password it changes
test('reset the password through the mail link', async ({ page }) => {
  const RESET_EMAIL = testUser('reset').email
  const newPassword = `Reset-${Date.now()}`

  await open(page, '/auth/password/reset')
  await page.getByPlaceholder('example@gmail.com').fill(RESET_EMAIL)
  await page.getByRole('button', { name: 'Send' }).click()
  await expect(page.getByText('Check your email!')).toBeVisible()

  const resetLink = pathOf(await linkFromMail(RESET_EMAIL, '/auth/password/'))
  await open(page, resetLink)
  await expect(page.getByText('Choose a new password for your account')).toBeVisible()

  const [newField, repeatField] = await page.getByPlaceholder('••••••••').all()
  const submit = page.getByRole('button', { name: 'Reset password' })
  await page.getByPlaceholder('example@gmail.com').fill(RESET_EMAIL)

  // The rules are checked before anything is sent
  await newField.fill('short')
  await repeatField.fill('short')
  await submit.click()
  await expect(page.getByText('Your password must be at least 8 characters.')).toBeVisible()
  await newField.fill(newPassword)
  await repeatField.fill(`${newPassword}x`)
  await submit.click()
  await expect(page.getByText('The passwords do not match.')).toBeVisible()

  await repeatField.fill(newPassword)
  await submit.click()
  await expect(page.getByText('Password updated')).toBeVisible()

  // The link works only once
  await open(page, resetLink)
  await expect(page.getByText('Link no longer valid')).toBeVisible()

  await logIn(page, RESET_EMAIL, newPassword)
  await expect(listsHeading(page)).toBeVisible()
})
