import { test as base } from '@playwright/test'
import { resetLists } from './users'

export { expect } from '@playwright/test'

// For the logged-in tests: each starts with no lists or cards, so nothing piles up from the tests before it
export const test = base.extend<{ cleanSlate: void }>({
  cleanSlate: [async ({}, use) => {
    resetLists()
    await use()
  }, { auto: true }],
})
