import { test, expect } from '../support/test'
import { createList, shareLink } from '../support/helpers'

test('sharing a list gives an invite link (copied to the clipboard without a share sheet)', async ({ page }) => {
  const name = await createList(page, 'share')
  const first = await shareLink(page, name)

  // Sharing again soon gives the same link, so earlier shared ones keep working
  expect(await shareLink(page, name)).toBe(first)

  // No email sharing any more: no dialog asking for an address
  await expect(page.getByRole('dialog')).toHaveCount(0)
})
