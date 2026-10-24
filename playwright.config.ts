import { defineConfig, devices } from '@playwright/test'

// End-to-end tests against the running dev server (npm run dev) and the local API, one file per feature:
//   e2e/auth   logged out: login, language, register, mails
//   e2e/lists  logged in: the lists and their items
//   e2e/cards  logged in: the loyalty cards
//   e2e/pages  logged in: profile
//   e2e/admin  logged in as admin
// Run with `npm run test:e2e`; see the README for what has to be running.
const output = 'node_modules/.cache/e2e' // outside the folders Vite watches, which would reload the page under test

export default defineConfig({
  testDir: './e2e',
  // The throwaway users are shared, so the tests run one after the other
  workers: 1,
  fullyParallel: false,
  retries: 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { open: 'never', outputFolder: `${output}/report` }]],
  outputDir: `${output}/results`,
  globalSetup: './e2e/setup/global-setup.ts',
  globalTeardown: './e2e/setup/global-teardown.ts',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',
    locale: 'en-GB',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'setup', testMatch: 'setup/auth.setup.ts' },
    { name: 'auth', testMatch: 'auth/**/*.spec.ts' },
    {
      name: 'logged-in',
      testMatch: ['lists/**/*.spec.ts', 'cards/**/*.spec.ts', 'pages/**/*.spec.ts'],
      dependencies: ['setup'],
      use: { storageState: `${output}/auth/state.json` },
    },
    {
      name: 'admin',
      testMatch: 'admin/**/*.spec.ts',
      dependencies: ['setup'],
      use: { storageState: `${output}/auth/admin.json` },
    },
  ],
})
