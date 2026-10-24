import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

// Throwaway users live in the local API's database; `php artisan e2e:user` only accepts @e2e.test addresses
const API_DIR = process.env.E2E_API_DIR || join(homedir(), 'projects/groceryListApi')
// Outside the folders Vite watches: writing there would reload the page under test
const AUTH_DIR = join(import.meta.dirname, '../../node_modules/.cache/e2e/auth')
const USERS_FILE = join(AUTH_DIR, 'users.json')

export const USER_EMAIL = 'e2e-web@e2e.test'
export const FRIEND_EMAIL = 'e2e-web-friend@e2e.test'
export const ADMIN_EMAIL = 'e2e-web-admin@e2e.test'
// Every address the website tests use starts with this, so cleanup can't touch the app tests' users
const PREFIX = 'e2e-web'

export type TestUser = { id: number; email: string; password: string }
// `reset` gets its password changed by the reset-password test and `mail` receives the mail the admin emails test
// looks at. Reset mails are rate-limited per address (3 an hour), so both get a fresh address every run.
type Users = { user: TestUser; friend: TestUser; admin: TestUser; reset: TestUser; mail: TestUser }

function artisan(...args: string[]): string {
  return execFileSync('php', ['artisan', 'e2e:user', ...args], { cwd: API_DIR, encoding: 'utf8' }).trim()
}

export function createUsers() {
  mkdirSync(AUTH_DIR, { recursive: true })
  const users: Users = {
    user: JSON.parse(artisan('create', USER_EMAIL, '--name=E2E Web')),
    friend: JSON.parse(artisan('create', FRIEND_EMAIL, '--name=E2E Friend')),
    admin: JSON.parse(artisan('create', ADMIN_EMAIL, '--name=E2E Admin', '--admin')),
    reset: JSON.parse(artisan('create', uniqueEmail('reset'), '--name=E2E Reset')),
    mail: JSON.parse(artisan('create', uniqueEmail('mail'), '--name=E2E Mail')),
  }
  // Git-ignored; the passwords never leave this machine
  writeFileSync(USERS_FILE, JSON.stringify(users), { mode: 0o600 })
}

// Also removes the accounts the register test made
export function deleteUsers() {
  artisan('delete', `${PREFIX}*@e2e.test`)
}

export function testUser(which: keyof Users = 'user'): TestUser {
  if (!existsSync(USERS_FILE)) throw new Error('No e2e users; global setup did not run')
  return (JSON.parse(readFileSync(USERS_FILE, 'utf8')) as Users)[which]
}

// A fresh address per run: the API rate-limits register and password-reset requests per address
export function uniqueEmail(name: string) {
  return `${PREFIX}-${name}-${Date.now()}@e2e.test`
}

/** Removes the lists and cards of the user and the friend, so every test starts from empty pages */
export function resetLists() {
  artisan('reset', USER_EMAIL)
  artisan('reset', FRIEND_EMAIL)
}
