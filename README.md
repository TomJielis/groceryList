# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## End-to-end tests

Playwright clicks through the website against the local API, one file per feature:

| Folder | What |
| --- | --- |
| `e2e/auth` | login (an empty one is refused), language switch, logout, register validation, register + activate through the mail, forgot password, reset through the mail link, invalid reset link |
| `e2e/lists` | create, rename, favorite, delete; products: add, + / −, check / uncheck, edit name / quantity / price (total), remove; sharing: invite, accept, decline, leave, remove a member, register from the invite mail, both users see each other's products |
| `e2e/cards` | create (with a photo), view, delete |
| `e2e/pages` | profile |
| `e2e/admin` | access, dashboard, users, user details, block / unblock, top items, sent mails |

Needs the API (`php artisan serve --port=8000` in `groceryListApi`), MailHog on `localhost:8025` and the dev server (`npm run dev`). Then:

```bash
npm run test:e2e        # all tests
npx playwright test lists/share-accept   # one file
npm run test:e2e:ui     # Playwright's UI, to watch or debug
```

The tests make their own throwaway `@e2e.test` users through `php artisan e2e:user` (local/testing only) and remove them, everything they made, and their mails afterwards. Passwords, sessions, screenshots and the HTML report go to the git-ignored `node_modules/.cache/e2e` (outside the folders Vite watches; writing there would reload the page under test). `npx playwright show-report node_modules/.cache/e2e/report` opens the report.

`e2e` in `~/.zshrc` runs these and the app's Maestro flows in one go.
