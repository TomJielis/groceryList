# Color Retheme + Eyebrow Cleanup Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the navy/orange color scheme with dark forest + sage green, and remove all `page-eyebrow` elements sitewide.

**Architecture:** Two independent changes — (1) swap color tokens in 3 theme files, (2) strip eyebrow elements from 16 Vue files. No logic changes, no new files.

**Tech Stack:** Vue 3, Nuxt 3, PrimeVue (Aura preset), Tailwind CSS

**Spec:** `docs/superpowers/specs/2026-03-12-color-retheme-eyebrow-cleanup-design.md`

---

## Chunk 1: Color Retheme

### Task 1: Update PrimeVue theme preset

**Files:**
- Modify: `assets/theme/business.ts`

> **Note — plan is authoritative over spec for color values:** The spec's primary scale was flagged as internally inconsistent during spec review (a mix of two sources). The plan corrects it with a consistent light-to-dark gradient. Similarly, the spec's highlight `color`/`focusColor` values (`#276749`/`#1e5239`) contain minor transcription errors; the correct values used here are `#276946`/`#1e5237` (derived from the scale). Use the values in this plan, not the spec, for all color hex codes.

The primary scale replaces orange (`#f97316`) with a consistent sage green scale. The semantic color tokens and component overrides that reference navy/orange also update.

- [ ] **Step 1: Replace the primary color scale**

In `assets/theme/business.ts`, replace the `primary` scale block (lines 6–18) with:

```ts
primary: {
  50:  '#f0faf5',
  100: '#d9f2e5',
  200: '#b3e5cc',
  300: '#7dcfaa',
  400: '#5ebd8a',
  500: '#44a872',
  600: '#33895a',
  700: '#276946',
  800: '#1e5237',
  900: '#173d2a',
  950: '#0c2419',
},
```

- [ ] **Step 2: Update semantic primary color tokens**

Replace the `primary` block inside `colorScheme.light` (the one with `color`, `contrastColor`, etc.):

```ts
primary: {
  color:         '#5ebd8a',
  contrastColor: '#ffffff',
  hoverColor:    '#4aad78',
  activeColor:   '#3a9a66',
},
```

- [ ] **Step 3: Update highlight tokens**

Replace the `highlight` block inside `colorScheme.light`:

```ts
highlight: {
  background:      '#e8f5ee',
  focusBackground: '#d1edd9',
  color:           '#276946',
  focusColor:      '#1e5237',
},
```

- [ ] **Step 4: Update checkbox colors**

Replace the `checkbox` component block:

```ts
checkbox: {
  root: {
    borderColor:            '{surface.300}',
    checkedBackground:      '#1c2b2b',
    checkedBorderColor:     '#1c2b2b',
    checkedHoverBackground: '#152121',
    borderRadius:           '3px',
  },
  icon: {
    checkedColor: '#ffffff',
  },
},
```

- [ ] **Step 5: Update input focus border colors and focus ring shadow**

In `inputtext.root`, change `focusBorderColor: '#1e3a5f'` → `'#1c2b2b'`
In `select.root`, change `focusBorderColor: '#1e3a5f'` → `'#1c2b2b'`

In `formField.focusRing`, change the `shadow` value from `'0 0 0 3px rgba(30,58,95,0.12)'` → `'0 0 0 3px rgba(28,43,43,0.12)'`
(`rgba(30,58,95,0.12)` is the old navy `#1e3a5f` in RGB; `rgba(28,43,43,0.12)` is the new forest `#1c2b2b`)

- [ ] **Step 6: Verify no old navy/orange values remain**

```bash
grep -n "f97316\|ea580c\|c2410c\|9a3412\|7c2d12\|431407\|1e3a5f\|16304f\|30,58,95" assets/theme/business.ts
```

Expected: no output (zero matches)


- [ ] **Step 7: Commit**

```bash
git add assets/theme/business.ts
git commit -m "feat: replace orange primary with sage green in PrimeVue theme"
```

---

### Task 2: Update CSS variables

**Files:**
- Modify: `assets/css/app-theme.css`
- Modify: `assets/css/main.css`

- [ ] **Step 1: Update app-theme.css variables**

In `assets/css/app-theme.css`, replace the `:root` block (lines 7–16):

```css
:root {
  --app-bg:        #f4f6f3;
  --app-bg-auth:   #edf0ec;
  --app-navy:      #1c2b2b;
  --app-navy-dark: #152121;
  --app-success:   #10b981;
  --app-error:     #ef4444;
  --app-warning:   #f59e0b;
  --app-info:      #3b82f6;
}
```

- [ ] **Step 2: Update main.css body background**

In `assets/css/main.css`, change:
```css
background: #f3f4f6;
```
to:
```css
background: #f4f6f3;
```

- [ ] **Step 3: Verify old navy/bg values are gone**

```bash
grep -n "1e3a5f\|16304f\|f0f4f8\|e8ecf2\|f3f4f6" assets/css/app-theme.css assets/css/main.css
```

Expected: no output

- [ ] **Step 4: Commit**

```bash
git add assets/css/app-theme.css assets/css/main.css
git commit -m "feat: update CSS variables to dark forest + sage palette"
```

---

## Chunk 2: Eyebrow Removal

> **Note:** Most eyebrows contain just `grocery list` or a brand label. A handful contain translated section labels (`lists.sharedWith`, `lists.pendingInvites`, `profile.myStats`, etc.) or dynamic content (the list name in `AddItemListForm.vue`). Remove them all — they use the same visual pattern and the decision is to let headings carry the hierarchy.

### Task 3: Remove eyebrows from pages/information.vue and pages/index.vue

**Files:**
- Modify: `pages/information.vue`
- Modify: `pages/index.vue`

- [ ] **Step 1: Remove all 6 eyebrows from information.vue**

Delete every line matching `<p class="page-eyebrow">grocery list</p>` in `pages/information.vue`.
There are 6 occurrences at lines 48, 55, 77, 95, 113, 128.

- [ ] **Step 2: Remove eyebrow from index.vue**

In `pages/index.vue`, delete the line:
```html
<p class="page-eyebrow mb-1">grocery list</p>
```
(line 300)

- [ ] **Step 3: Verify**

```bash
grep -n "page-eyebrow" pages/information.vue pages/index.vue
```

Expected: no output

- [ ] **Step 4: Commit**

```bash
git add pages/information.vue pages/index.vue
git commit -m "chore: remove page-eyebrow elements from information and index pages"
```

---

### Task 4: Remove eyebrows from remaining pages

**Files:**
- Modify: `pages/cards/index.vue`
- Modify: `pages/terms/index.vue`
- Modify: `pages/terms/approve.vue`
- Modify: `pages/profile/index.vue`
- Modify: `pages/profile/stats.vue`
- Modify: `pages/list/[id].vue`
- Modify: `pages/admin/index.vue`
- Modify: `pages/admin/top-items.vue`
- Modify: `pages/admin/users/index.vue`
- Modify: `pages/admin/users/[id].vue`

- [ ] **Step 1: Remove eyebrow from pages/cards/index.vue**

Delete the line at line 30:
```html
<p class="page-eyebrow">grocery list</p>
```

- [ ] **Step 2: Remove eyebrow from pages/terms/index.vue**

Delete the line at line 58:
```html
<p class="page-eyebrow mb-1">Grocery List</p>
```

- [ ] **Step 3: Remove eyebrow from pages/terms/approve.vue**

Delete the line at line 50:
```html
<p class="page-eyebrow mb-1">Grocery List</p>
```

- [ ] **Step 4: Remove 4 eyebrows from pages/profile/index.vue**

Delete all 4 occurrences of `<p class="page-eyebrow">grocery list</p>` at lines 96, 105, 163, 170.

- [ ] **Step 5: Remove 3 eyebrows from pages/profile/stats.vue**

Delete the 3 multi-line eyebrow elements (lines 85–87, 132–134, 143–145):
```html
<p class="page-eyebrow">
  {{ i18n.t('profile.myStats') }}
</p>
```
```html
<p class="page-eyebrow mb-1">
  {{ i18n.t('profile.itemsActivity') }}
</p>
```
```html
<p class="page-eyebrow mb-1">
  {{ i18n.t('profile.topItems') }}
</p>
```

- [ ] **Step 6: Remove eyebrow from pages/list/[id].vue**

Delete the lines at line 151:
```html
<p class="page-eyebrow mb-1">grocery list</p>
```

- [ ] **Step 7: Remove eyebrow from pages/admin/index.vue**

Delete the line at line 174:
```html
<p class="page-eyebrow">{{ i18n.t('admin.dashboard') }}</p>
```

- [ ] **Step 8: Remove eyebrow from pages/admin/top-items.vue**

Delete the line at line 81:
```html
<p class="page-eyebrow">{{ i18n.t('admin.analytics') }}</p>
```

- [ ] **Step 9: Remove eyebrow from pages/admin/users/index.vue**

Delete the line at line 73:
```html
<p class="page-eyebrow">{{ i18n.t('admin.overview') }}</p>
```

- [ ] **Step 10: Remove eyebrow from pages/admin/users/[id].vue**

Delete the line at line 127:
```html
<p class="page-eyebrow">{{ i18n.t('admin.userDetail') }}</p>
```

- [ ] **Step 11: Verify pages clean**

```bash
grep -rn "page-eyebrow" pages/
```

Expected: no output

- [ ] **Step 12: Commit**

```bash
git add pages/cards/index.vue pages/terms/index.vue pages/terms/approve.vue pages/profile/index.vue pages/profile/stats.vue "pages/list/[id].vue" pages/admin/index.vue pages/admin/top-items.vue pages/admin/users/index.vue "pages/admin/users/[id].vue"
git commit -m "chore: remove page-eyebrow elements from remaining pages"
```

---

### Task 5: Remove eyebrows from components

**Files:**
- Modify: `components/list/AddItemListForm.vue`
- Modify: `components/list/SharedUsersList.vue`
- Modify: `components/list/ListForm.vue`
- Modify: `components/list/PendingGroceryList.vue`

- [ ] **Step 1: Remove multi-line eyebrow from AddItemListForm.vue**

Delete the 3-line block at lines 153–155:
```html
<p class="page-eyebrow mb-0.5">
  {{ listStore.lists.find((list: any) => list.id == listId)?.name }}
</p>
```

- [ ] **Step 2: Remove multi-line eyebrow from SharedUsersList.vue**

Delete the 3-line block at lines 27–29:
```html
<p class="page-eyebrow">
  {{ i18n.t('lists.sharedWith') }}
</p>
```

- [ ] **Step 3: Remove eyebrow from ListForm.vue**

Delete the line at line 119:
```html
<p class="page-eyebrow mb-1">grocery list</p>
```

- [ ] **Step 4: Remove multi-line eyebrow from PendingGroceryList.vue**

Delete the 3-line block at lines 53–55:
```html
<p class="page-eyebrow">
  {{ i18n.t('lists.pendingInvites') }}
</p>
```

- [ ] **Step 5: Verify all components clean**

```bash
grep -rn "page-eyebrow" components/
```

Expected: no output

- [ ] **Step 6: Final sitewide verification**

```bash
grep -rn "page-eyebrow" pages/ components/
```

Expected: no output

- [ ] **Step 7: Commit**

```bash
git add components/list/AddItemListForm.vue components/list/SharedUsersList.vue components/list/ListForm.vue components/list/PendingGroceryList.vue
git commit -m "chore: remove page-eyebrow elements from list components"
```

---

## Done

Both changes are complete. Start the dev server to do a visual check:

```bash
pnpm dev
```

Spot-check these pages to confirm colors and no eyebrows:
- `/` — lists page (navbar color, progress bars, buttons)
- `/information` — most eyebrows were here (6 removed)
- `/profile` — 4 eyebrows removed
- Auth pages — navbar + form inputs
