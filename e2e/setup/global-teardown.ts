import { deleteTestMails } from '../support/mailhog'
import { deleteUsers } from '../support/users'

// Removes everything the tests made: the @e2e.test users (with their lists, cards and invites) and their mails
export default async function globalTeardown() {
  deleteUsers()
  await deleteTestMails()
}
