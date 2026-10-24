import { createUsers } from '../support/users'

export default async function globalSetup() {
  createUsers()
}
