# PageHeader Component Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a reusable `PageHeader` component that standardizes the back-button + page-title layout across four pages, with the title inline to the right of the button.

**Architecture:** A single Vue 3 component (`components/PageHeader.vue`) accepts `backTo`, `title`, and optional `subtitle` props plus an optional `#actions` slot. On mobile the actions render below the title row; on desktop they align to the right. Each of the four target pages has its existing custom header markup replaced with the new component.

**Tech Stack:** Nuxt 4, Vue 3 (Composition API with `<script setup>`), Tailwind CSS, PrimeVue 4, `useI18nStore` for translations.

**Note:** This project has no test framework configured. TDD steps are omitted; verification is done via `nuxt dev` visual inspection.

---

## Chunk 1: Create PageHeader component

### Task 1: Create `components/PageHeader.vue`

**Files:**
- Create: `components/PageHeader.vue`

- [ ] **Step 1: Create the component file**

```vue
<script setup lang="ts">
import { useSlots } from 'vue'
import { useI18nStore } from '~/stores/i18n'

defineProps<{
  backTo: string
  title: string
  subtitle?: string
}>()

const i18n = useI18nStore()
const slots = useSlots()
</script>

<template>
  <div class="w-full py-4 border-b border-surface-200">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div class="flex items-center gap-3 min-w-0">
        <NuxtLink
          :to="backTo"
          :aria-label="i18n.t('common.back')"
          class="w-9 h-9 flex items-center justify-center border border-surface-200 rounded text-color-secondary hover:border-surface-400 hover:text-color transition flex-shrink-0"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </NuxtLink>
        <div class="min-w-0">
          <h1 class="page-heading truncate">{{ title }}</h1>
          <p v-if="subtitle" class="text-sm text-color-secondary">{{ subtitle }}</p>
        </div>
      </div>
      <div v-if="slots.actions" class="flex-shrink-0">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Verify `common.back` i18n key exists in both locale files**

Check `data/i18n/en.json` and `data/i18n/nl.json` — both should have `"back"` under the `"common"` key. No changes needed if present.

- [ ] **Step 3: Commit**

```bash
git add components/PageHeader.vue
git commit -m "feat: add PageHeader component with back button and title"
```

---

## Chunk 2: Update pages

### Task 2: Update `pages/profile/stats.vue`

**Files:**
- Modify: `pages/profile/stats.vue`

The current header is:
```html
<div class="py-4 flex items-center gap-3">
  <NuxtLink
    to="/profile"
    class="w-8 h-8 flex items-center justify-center transition-colors"
  >
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
    </svg>
  </NuxtLink>
  <div>
    <h1 class="page-heading">
      {{ i18n.t('profile.myStatsDescription') }}
    </h1>
  </div>
</div>
```

- [ ] **Step 1: Replace the header block**

Replace the entire `<div class="py-4 flex items-center gap-3">` block (the `<!-- Header -->` comment and its div) with:

```html
<!-- Header -->
<PageHeader
  back-to="/profile"
  :title="i18n.t('profile.myStatsDescription')"
/>
```

- [ ] **Step 2: Verify in browser**

Run `npm run dev`. Open `/profile/stats`. Confirm:
- Back button is `w-9 h-9` with border
- Title is inline to the right
- `border-b` separator is visible below the header

- [ ] **Step 3: Commit**

```bash
git add pages/profile/stats.vue
git commit -m "refactor: use PageHeader in profile/stats"
```

---

### Task 3: Update `pages/admin/index.vue`

**Files:**
- Modify: `pages/admin/index.vue`

The current header section (lines ~162–222) is a single `<div class="border-b border-surface-200 pb-6">` that contains two parts:
1. The title + MonthSelector flex row
2. A quick stats grid (`<div class="grid grid-cols-2 md:grid-cols-4 border-t border-surface-200 mt-6">`)

Only the title + MonthSelector flex row is replaced. The quick stats grid stays in place.

- [ ] **Step 1: Replace only the inner title+MonthSelector flex row**

Inside the outer `<div class="border-b border-surface-200 pb-6">`, replace the `<div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">` block (containing the NuxtLink back button and MonthSelector) with PageHeader. Remove `border-b` from the outer wrapper since PageHeader now provides it; keep `pb-6`:

```html
<!-- Page header -->
<div class="pb-6">
  <PageHeader
    back-to="/profile"
    :title="i18n.t('admin.title')"
    :subtitle="statsActivity?.current_month?.period"
  >
    <template v-if="availableMonths.length" #actions>
      <div class="w-full md:w-64">
        <MonthSelector
          :selected-month="selectedMonth"
          :available-months="availableMonths"
          @change="onMonthChange"
        />
      </div>
    </template>
  </PageHeader>
  <!-- Quick stats row — copy verbatim from original file (lines ~191–222) -->
  <div class="grid grid-cols-2 md:grid-cols-4 border-t border-surface-200 mt-6">
    <div class="px-0 pr-4 py-3 border-r border-b md:border-b-0 border-surface-200">
      <p class="text-[0.65rem] uppercase tracking-[0.14em] text-color-secondary font-medium">
        {{ i18n.t('admin.totalUsers') }}
      </p>
      <p class="text-xl font-light">{{ statsUsers?.current_month?.value ?? 0 }}</p>
    </div>
    <div class="px-4 py-3 border-b md:border-b-0 md:border-r border-surface-200">
      <p class="text-[0.65rem] uppercase tracking-[0.14em] text-color-secondary font-medium">
        {{ i18n.t('admin.itemsAdded') }}
      </p>
      <p class="text-xl font-light">
        {{ statsItems?.current_month?.breakdown?.added ?? 0 }}
      </p>
    </div>
    <div class="px-0 pr-4 py-3 border-r border-surface-200">
      <p class="text-[0.65rem] uppercase tracking-[0.14em] text-color-secondary font-medium">
        {{ i18n.t('admin.listsCreated') }}
      </p>
      <p class="text-xl font-light">
        {{ statsLists?.current_month?.breakdown?.created ?? 0 }}
      </p>
    </div>
    <div class="px-4 py-3">
      <p class="text-[0.65rem] uppercase tracking-[0.14em] text-color-secondary font-medium">
        {{ i18n.t('admin.activeUsers') }}
      </p>
      <p class="text-xl font-light">
        {{ statsUsers?.current_month?.breakdown?.active ?? 0 }}
      </p>
    </div>
  </div>
</div>
```

**Note:** `@change="onMonthChange"` is the exact event binding in the original file. Do not change it. The `onMonthChange` handler reloads data — replacing it with a simple assignment would break month switching.

- [ ] **Step 2: Verify in browser**

Run `npm run dev`. Open `/admin`. Confirm:
- Back button is consistent with other pages
- Title and subtitle render correctly
- MonthSelector appears below title on mobile, to the right on desktop
- Quick stats grid still visible below the PageHeader
- Single `border-b` below PageHeader (not double)

- [ ] **Step 3: Commit**

```bash
git add pages/admin/index.vue
git commit -m "refactor: use PageHeader in admin/index"
```

---

### Task 4: Update `pages/admin/users/[id].vue`

**Files:**
- Modify: `pages/admin/users/[id].vue`

The current header block is:
```html
<div class="border-b border-surface-200 pb-6">
  <div class="flex items-center gap-4 mb-4">
    <NuxtLink
      to="/admin/users"
      class="w-9 h-9 flex items-center justify-center border border-surface-200 text-color-secondary hover:border-surface-400 hover:text-color transition rounded"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
    </NuxtLink>
    <div>
      <h1 class="page-heading truncate">
        {{ data?.user?.name || '...' }}
      </h1>
      <p class="text-sm text-color-secondary">
        {{ data?.user?.email || '' }}
      </p>
    </div>
  </div>
  <!-- badges/chips row below — keep this -->
  ...
</div>
```

- [ ] **Step 1: Replace only the inner flex row (not the outer border-b div)**

The outer `<div class="border-b border-surface-200 pb-6">` also contains a badges row below the title. Replace only the inner `<div class="flex items-center gap-4 mb-4">` block with the component, and keep the badges row in place. The `PageHeader` component already provides `border-b`, so remove the `border-b` from the outer wrapper div (change it to just `<div class="pb-6">`):

```html
<div class="pb-6">
  <PageHeader
    back-to="/admin/users"
    :title="data?.user?.name || '...'"
    :subtitle="data?.user?.email || undefined"
  />
  <!-- keep existing badges/chips row below exactly as-is -->
</div>
```

- [ ] **Step 2: Verify in browser**

Open `/admin/users/<any-id>`. Confirm:
- Back button consistent style
- User name as title, email as subtitle
- Badges row still visible below the header
- Single border-b line separating header from content

- [ ] **Step 3: Commit**

```bash
git add "pages/admin/users/[id].vue"
git commit -m "refactor: use PageHeader in admin/users/[id]"
```

---

### Task 5: Update `pages/list/[id].vue`

**Files:**
- Modify: `pages/list/[id].vue`

The current header contains a stacked layout (back button above title) plus an actions area, and further below: a stats row and a `ProgressBar`. Only the top portion is replaced.

Current structure (simplified):
```html
<div class="py-4 border-b border-surface-200">
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div class="flex flex-col gap-4">               <!-- button ABOVE title — stacked -->
        <NuxtLink to="/" class="inline-flex w-10 h-10 ...">...</NuxtLink>
        <div>
          <h1 class="page-heading">{{ list?.name }}</h1>
          <p class="text-sm ...">{{ uncheckedItems.length }} remaining · ...</p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row gap-3">   <!-- action buttons -->
        <Button v-if="showAddItem" ... />
        <Button v-else ... />
      </div>
    </div>
    <!-- stats row and ProgressBar — KEEP AS-IS below -->
  </div>
</div>
```

- [ ] **Step 1: Replace the outer wrapper and inner title+actions row**

The outer `<div class="py-4 border-b border-surface-200">` wraps everything including the stats row and ProgressBar. Since `PageHeader` already renders `py-4 border-b border-surface-200`, keeping these classes on the outer wrapper would produce double padding and double border. Instead:

- Change the outer `<div class="py-4 border-b border-surface-200">` to just `<div>` (strip all classes — PageHeader provides `py-4 border-b border-surface-200`)
- Inside the still-present `<div class="flex flex-col gap-6">`, replace the `<div class="flex flex-col gap-4 md:flex-row ...">` block (the one containing the NuxtLink + title + action buttons) with `<PageHeader ...>`
- Everything else inside `<div class="flex flex-col gap-6">` (stats grid, ProgressBar) stays untouched

The resulting structure looks like this:

```html
<div>
  <div class="flex flex-col gap-6">
    <PageHeader
      back-to="/"
      :title="list?.name || ''"
      :subtitle="`${uncheckedItems.length} ${i18n.t('list.remaining')} · ${checkedItems.length} ${i18n.t('list.done')}`"
    >
      <template #actions>
        <div class="flex flex-col sm:flex-row gap-3">
          <Button
            v-if="showAddItem"
            :label="i18n.t('common.cancel')"
            severity="secondary"
            @click="showAddItem = false"
          />
          <Button
            v-else
            icon="pi pi-plus"
            :label="i18n.t('items.addNew')"
            severity="primary"
            @click="showAddItem = true"
          />
        </div>
      </template>
    </PageHeader>

    <!-- Stats row and ProgressBar — keep exactly as-is from original file -->
  </div>
</div>
```

- [ ] **Step 2: Verify in browser**

Open a grocery list. Confirm:
- Back button is inline with the list name (no longer stacked above)
- Subtitle shows remaining/done counts
- Add/Cancel button appears below on mobile, to the right on desktop
- Stats row and progress bar still visible below the header

- [ ] **Step 3: Commit**

```bash
git add "pages/list/[id].vue"
git commit -m "refactor: use PageHeader in list/[id]"
```

---

## Chunk 3: Cleanup

### Task 6: Add `.superpowers/` to `.gitignore` and final check

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Confirm `.superpowers/` is in `.gitignore`**

Check `.gitignore` — the line `.superpowers/` should already be present (added during planning). If not, add it.

- [ ] **Step 2: Visual check across all four pages**

Open each page in the browser and confirm consistent appearance:
- `/profile/stats` — back button with border, title inline
- `/admin` — back button, title, subtitle (if data loaded), MonthSelector
- `/admin/users/<id>` — back button, user name, email subtitle, badges below
- `/list/<id>` — back button, list name inline, add/cancel button

- [ ] **Step 3: Final commit**

```bash
git add .gitignore
git commit -m "chore: add .superpowers to .gitignore"
```
