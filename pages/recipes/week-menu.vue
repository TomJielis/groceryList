<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import deleteModal from '~/components/deleteModal.vue'
import Loader from '~/components/Loader.vue'
import { useGroceryList } from '~/composables/useGroceryList'
import { ACTION_DURATION_MS, useNotification } from '~/composables/useNotification'
import { useRecipes } from '~/composables/useRecipes'
import { useShareLink } from '~/composables/useShareLink'
import { useWeekMenu } from '~/composables/useWeekMenu'
import { useSocket } from '~/composables/useSocket'
import { useAuthStore } from '~/stores/auth'
import { useI18nStore } from '~/stores/i18n'
import { RECIPE_CATEGORIES } from '~/types/TRecipe'
import type { TRecipeCategory, TRecipeSummary } from '~/types/TRecipe'
import type { TWeekMenu, TWeekMenuEntry } from '~/types/TWeekMenu'
import {
  MAX_LIST_QUANTITY, addDays, combineWeekIngredients, dayLabel, fromDateKey, listDays, mondayOf, plannedDays, recentRecipeIds, toDateKey,
  weekDays, weekLabel,
} from '~/utils/weekMenu'

definePageMeta({
  middleware: ['auth', 'terms'],
})

// The most servings a dish can be planned for (the API's WeekMenuController::MAX_SERVINGS)
const MAX_SERVINGS = 99

const i18n = useI18nStore()
const auth = useAuthStore()
const router = useRouter()
const { showNotification, showSuccess } = useNotification()
const { shareLink } = useShareLink()
const { recipes, fetchRecipes } = useRecipes()
const { lists, fetchLists } = useGroceryList()
const weekMenu = useWeekMenu()
const { menus, loaded } = weekMenu

const userId = computed(() => Number(auth.user?.id))
// The menu last looked at, opened again next time (not always the own one first)
const SELECTED_KEY = 'weekMenuSelected'
const selectedId = ref<number | null>(import.meta.client ? Number(localStorage.getItem(SELECTED_KEY)) || null : null)
watch(selectedId, (id) => {
  if (id !== null) localStorage.setItem(SELECTED_KEY, String(id))
})
const menu = computed<TWeekMenu | null>(() => menus.value.find(m => m.id === selectedId.value) ?? menus.value[0] ?? null)
const loadFailed = ref(false)
const busy = ref(false)

const monday = ref(mondayOf(new Date()))
const days = computed(() => weekDays(monday.value))
// Today, moving on when the tab stays open past midnight (checked every minute and when the tab is shown again)
const todayKey = ref(toDateKey(new Date()))
const isThisWeek = computed(() => toDateKey(monday.value) === toDateKey(mondayOf(fromDateKey(todayKey.value))))
function checkToday() {
  const now = toDateKey(new Date())
  if (now === todayKey.value) return
  // The week shown was the current one: on to the new current week
  if (isThisWeek.value) monday.value = mondayOf(new Date())
  todayKey.value = now
}
let todayTimer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  todayTimer = setInterval(checkToday, 60_000)
  document.addEventListener('visibilitychange', checkToday)
})
onBeforeUnmount(() => {
  clearInterval(todayTimer)
  document.removeEventListener('visibilitychange', checkToday)
})

const entries = ref<TWeekMenuEntry[]>([])
const weekState = ref<'loading' | 'loaded' | 'failed'>('loading')
// Answers of an older week (switched meanwhile) are dropped
let weekRequest = 0
// The user's own changes on their way: a fetch that started before one may miss it, so it's done again afterwards
let pendingChanges = 0
let changeVersion = 0
let reloadAfterChanges = false
async function whileChanging<T>(change: () => Promise<T>): Promise<T> {
  changeVersion += 1
  pendingChanges += 1
  try {
    return await change()
  } finally {
    pendingChanges -= 1
    changeVersion += 1
    if (pendingChanges === 0 && reloadAfterChanges) {
      reloadAfterChanges = false
      void loadWeek()
    }
  }
}

// The week shown. The spinner and "could not be loaded" only while the week isn't shown yet: a refresh in the
// background keeps the week on screen (also when that refresh fails)
async function loadWeek() {
  if (!menu.value) return
  if (pendingChanges > 0) {
    reloadAfterChanges = true
    return
  }
  const request = ++weekRequest
  const startedVersion = changeVersion
  if (weekState.value !== 'loaded') weekState.value = 'loading'
  try {
    const fetched = await weekMenu.fetchEntries(menu.value.id, toDateKey(monday.value), toDateKey(addDays(monday.value, 6)))
    if (request !== weekRequest) return
    if (pendingChanges > 0) {
      reloadAfterChanges = true
      return
    }
    if (changeVersion !== startedVersion) return void loadWeek()
    // A dish just taken out (its "Undo" still offered) stays out
    entries.value = fetched.filter(entry => !removals.has(entry.id))
    weekState.value = 'loaded'
  } catch {
    if (request === weekRequest && weekState.value !== 'loaded') weekState.value = 'failed'
  }
}

onMounted(async () => {
  try {
    await weekMenu.fetchMenus()
  } catch {
    loadFailed.value = true
  }
})

// ----- Live: someone else in the menu planned or changed something -----
const live = useSocket()
// Tells the others in the menu to fetch it again (after the API took the change)
const tellOthers = (menuId: number) => live.notifyWeekMenuUpdate(menuId)
// A burst of changes by someone else (+ + +) is fetched once
let refreshTimer: ReturnType<typeof setTimeout> | undefined
function onRefresh(data: { menuId: number }) {
  if (data?.menuId !== menu.value?.id) return
  clearTimeout(refreshTimer)
  refreshTimer = setTimeout(() => {
    void loadWeek()
    // The people in it, or its name, may have changed too (or the menu is gone)
    void weekMenu.fetchMenus().catch(() => undefined)
  }, 300)
}
watch(() => menu.value?.id, (id, previous) => {
  if (previous) live.leaveWeekMenu(previous)
  if (id) live.joinWeekMenu(id)
}, { immediate: true })
onMounted(() => live.onWeekMenuRefresh(onRefresh))
onBeforeUnmount(() => {
  clearTimeout(refreshTimer)
  live.offWeekMenuRefresh(onRefresh)
  if (menu.value) live.leaveWeekMenu(menu.value.id)
})

watch([() => menu.value?.id, monday], () => {
  entries.value = []
  weekState.value = 'loading'
  void loadWeek()
}, { immediate: true })

// Per dish, its requests one after the other, and only the latest answer shown (a quick + + − arrives in order)
const queues = new Map<number, Promise<unknown>>()
const latest = new Map<number, number>()
function inOrder<T>(entryId: number, call: () => Promise<T>): Promise<T> {
  const next = (queues.get(entryId) ?? Promise.resolve()).catch(() => undefined).then(call)
  queues.set(entryId, next)
  next.catch(() => undefined).finally(() => { if (queues.get(entryId) === next) queues.delete(entryId) })
  return next
}

const sortByDay = (list: TWeekMenuEntry[]) =>
  [...list].sort((a, b) => a.date.localeCompare(b.date) || a.position - b.position || a.id - b.id)
const entriesOn = (key: string) => entries.value.filter(entry => entry.date === key)

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)
const membersLine = computed(() => {
  if (!menu.value) return ''
  const people = [menu.value.created_by, ...menu.value.members].filter(p => p && p.id !== userId.value) as { name: string }[]
  return people.length ? i18n.t('weekMenu.members').split('{names}').join(people.map(p => p.name).join(', ')) : ''
})
// "3 of 7 days planned · 1 on your list"
const summary = computed(() => {
  const planned = new Set(entries.value.map(entry => entry.date)).size
  const onList = entries.value.filter(entry => entry.added_to_list_at).length
  const parts = [i18n.t('weekMenu.daysPlanned').split('{count}').join(String(planned))]
  if (onList) parts.push(i18n.t('weekMenu.dishesOnList').split('{count}').join(String(onList)))
  return parts.join(' · ')
})

// Who planned it, in a shared menu: "by Sam", or "by you" for the user's own (in a menu only they are in it says nothing)
function entryMeta(entry: TWeekMenuEntry) {
  if (!menu.value?.members.length || !entry.added_by) return ''
  return entry.added_by.id === userId.value ? i18n.t('weekMenu.addedByYou') : i18n.t('weekMenu.addedBy').split('{name}').join(entry.added_by.name)
}
// "On 'Boodschappen'" once its ingredients went on a list; with more or fewer servings since, that's said too
function listStatus(entry: TWeekMenuEntry) {
  if (!entry.added_to_list_at) return ''
  const on = entry.added_to_list ? i18n.t('weekMenu.onList').split('{list}').join(entry.added_to_list.name) : i18n.t('weekMenu.onListShort')
  // Who put it there, like the app: "On 'Boodschappen' by Sam" (by you for the user's own)
  const by = entry.added_to_list_by
    ? ` ${entry.added_to_list_by.id === userId.value ? i18n.t('weekMenu.addedByYou') : i18n.t('weekMenu.addedBy').split('{name}').join(entry.added_to_list_by.name)}`
    : ''
  const changed = entry.added_to_list_servings != null && entry.added_to_list_servings !== entry.servings
  return `${on}${by}${changed ? ` · ${i18n.t('weekMenu.servingsChanged')}` : ''}`
}

// New dishes get the number of servings last used in this menu (cooking for two: every dish starts at 2)
const servingsKey = (menuId: number) => `weekMenuServings:${menuId}`
function rememberServings(servings: number) {
  if (menu.value) localStorage.setItem(servingsKey(menu.value.id), String(servings))
}
function lastServings(): number | undefined {
  const value = menu.value ? Number(localStorage.getItem(servingsKey(menu.value.id))) : 0
  return value > 0 && value <= MAX_SERVINGS ? value : undefined
}

// Runs one action at a time: a second click while saving does nothing
async function once(action: () => Promise<void>) {
  if (busy.value) return
  busy.value = true
  try {
    await action()
  } finally {
    busy.value = false
  }
}

function create() {
  return once(async () => {
    try {
      const created = await weekMenu.createMenu()
      selectedId.value = created.id
    } catch {
      showNotification(i18n.t('weekMenu.createFailed'))
    }
  })
}

// ----- Planning a dish -----
// How many recently planned recipes the picker offers first, from the four weeks before the one shown
const RECENT_COUNT = 5
const RECENT_DAYS = 28
type PickFilter = 'all' | 'favorites' | TRecipeCategory
const pickDate = ref<string | null>(null)
const pickSearch = ref('')
const pickFilter = ref<PickFilter>('all')
const recentIds = ref<number[]>([])
// Only the filters that have recipes
const pickFilters = computed<{ value: PickFilter; label: string }[]>(() => [
  { value: 'all', label: i18n.t('recipes.allCategories') },
  ...(recipes.value.some(recipe => recipe.favorite) ? [{ value: 'favorites' as const, label: i18n.t('recipes.favorites') }] : []),
  ...RECIPE_CATEGORIES.filter(category => recipes.value.some(recipe => recipe.categories.includes(category)))
    .map(value => ({ value, label: i18n.t(`recipes.category.${value}`) })),
])
// Without a search or filter: what was planned recently first (most families eat a few dishes over and over)
const pickRecent = computed(() => (pickSearch.value.trim() || pickFilter.value !== 'all'
  ? []
  : recentIds.value.map(id => recipes.value.find(recipe => recipe.id === id)).filter((recipe): recipe is TRecipeSummary => Boolean(recipe))))
// Then everything else, favorites first and A to Z
const pickRecipes = computed(() => {
  const query = pickSearch.value.trim().toLowerCase()
  const filter = pickFilter.value
  return recipes.value
    .filter(recipe => !pickRecent.value.includes(recipe))
    .filter(recipe => !query || recipe.title.toLowerCase().includes(query)
      || (recipe.ingredient_names ?? []).some(name => name.toLowerCase().includes(query)))
    .filter(recipe => filter === 'all' || (filter === 'favorites' ? recipe.favorite : recipe.categories.includes(filter)))
    .sort((a, b) => Number(b.favorite) - Number(a.favorite) || a.title.localeCompare(b.title))
})
// A recipe planned this week already says on which day, so the same dish isn't planned twice by accident
const plannedThisWeek = computed(() => plannedDays(entries.value))
function plannedOn(recipe: TRecipeSummary) {
  const on = plannedThisWeek.value.get(recipe.id)
  return on ? i18n.t('weekMenu.pickPlannedOn').split('{days}').join(on.map(day => dayLabel(fromDateKey(day), i18n.locale)).join(', ')) : ''
}
async function openPicker(date: string) {
  pickSearch.value = ''
  pickFilter.value = 'all'
  pickDate.value = date
  // Only a suggestion: without it the picker works just the same
  if (menu.value) {
    const menuId = menu.value.id
    weekMenu.fetchEntries(menuId, toDateKey(addDays(monday.value, -RECENT_DAYS)), toDateKey(addDays(monday.value, -1)))
      .then((earlier) => { if (menu.value?.id === menuId) recentIds.value = recentRecipeIds(earlier, RECENT_COUNT) })
      .catch(() => undefined)
  }
  if (recipes.value.length === 0) await fetchRecipes().catch(() => undefined)
}
function pickRecipe(recipe: TRecipeSummary) {
  return once(async () => {
    if (!menu.value || !pickDate.value) return
    const date = pickDate.value
    try {
      const menuId = menu.value.id
      const entry = await whileChanging(() => weekMenu.plan(menuId, date, recipe.id, lastServings()))
      if (menu.value?.id === menuId) entries.value = sortByDay([...entries.value.filter(e => e.id !== entry.id), entry])
      tellOthers(menuId)
      pickDate.value = null
      showSuccess(i18n.t('weekMenu.planned').split('{title}').join(recipe.title).split('{day}').join(dayLabel(fromDateKey(date), i18n.locale)))
    } catch {
      showNotification(i18n.t('weekMenu.planFailed'))
    }
  })
}

// ----- A planned dish: servings, another day, out of the menu -----
const entryId = ref<number | null>(null)
const openEntry = computed(() => entries.value.find(entry => entry.id === entryId.value) ?? null)

async function changeEntry(entry: TWeekMenuEntry, change: { date?: string; servings?: number; reset_added?: boolean }) {
  if (!menu.value) return
  if (change.servings) rememberServings(change.servings)
  const menuId = menu.value.id
  const mine = (latest.get(entry.id) ?? 0) + 1
  latest.set(entry.id, mine)
  const shown = change.reset_added
    ? { added_to_list_at: null, added_to_list_by: null, added_to_list: null, added_to_list_servings: null }
    : change
  entries.value = sortByDay(entries.value.map(e => (e.id === entry.id ? { ...e, ...shown } : e)))
  try {
    const updated = await whileChanging(() => inOrder(entry.id, () => weekMenu.updateEntry(menuId, entry.id, change)))
    tellOthers(menuId)
    if (latest.get(entry.id) !== mine || !entries.value.some(e => e.id === entry.id)) return
    entries.value = sortByDay(entries.value.map(e => (e.id === entry.id ? updated : e)))
  } catch {
    // Only when nothing newer happened to it: the week again from the server (not a number that was never saved)
    if (latest.get(entry.id) === mine && entries.value.some(e => e.id === entry.id)) void loadWeek()
    showNotification(i18n.t('weekMenu.updateFailed'))
  }
}
// Taken out at once, removed for real only when "Undo" wasn't clicked in time: undone, the dish is back as it was (its
// check, its place on the day), instead of planned again
const removals = new Map<number, { timer: ReturnType<typeof setTimeout>; commit: () => Promise<void> }>()
function removeEntry(entry: TWeekMenuEntry) {
  if (!menu.value || removals.has(entry.id)) return
  const menuId = menu.value.id
  const week = toDateKey(monday.value)
  // Back only into the week it was taken from (another week or menu shown by now: that one isn't touched)
  const putBack = () => {
    if (menu.value?.id === menuId && toDateKey(monday.value) === week) entries.value = sortByDay([...entries.value.filter(e => e.id !== entry.id), entry])
  }
  entryId.value = null
  latest.set(entry.id, (latest.get(entry.id) ?? 0) + 1)
  entries.value = entries.value.filter(e => e.id !== entry.id)
  const commit = async () => {
    removals.delete(entry.id)
    try {
      await whileChanging(() => inOrder(entry.id, () => weekMenu.removeEntry(menuId, entry.id)))
      tellOthers(menuId)
    } catch {
      putBack()
      showNotification(i18n.t('weekMenu.removeFailed'))
    }
  }
  removals.set(entry.id, { timer: setTimeout(commit, ACTION_DURATION_MS), commit })
  showSuccess(i18n.t('weekMenu.removed').split('{title}').join(entry.recipe.title), ACTION_DURATION_MS, {
    label: i18n.t('weekMenu.undo'),
    onClick: () => {
      const removal = removals.get(entry.id)
      if (!removal) return
      clearTimeout(removal.timer)
      removals.delete(entry.id)
      putBack()
    },
  })
}
// Leaving the page: what's still waiting is removed now
onBeforeUnmount(() => {
  removals.forEach((removal) => {
    clearTimeout(removal.timer)
    void removal.commit()
  })
})
function openRecipe(entry: TWeekMenuEntry) {
  // from: back on the recipe goes here again, not to the recipes overview
  router.push({ path: `/recipes/${entry.recipe.id}`, query: { servings: String(entry.servings), from: 'week-menu' } })
}

// ----- The week on a list: the dishes that aren't on one yet -----
type ListRow = { name: string; detail: string; quantity: number; selected: boolean }
const listOpen = ref(false)
const rows = ref<ListRow[]>([])
const chosenListId = ref<number | null>(null)
const newEntries = computed(() => entries.value.filter(entry => !entry.added_to_list_at))
// The new dishes from today on: the button counts those (a past day's dish usually isn't shopped for anymore)
const upcomingNew = computed(() => newEntries.value.filter(entry => entry.date >= todayKey.value))
// The dishes the open dialog is about (not the ones planned while it's open), and the days chosen of them
const sheetEntries = ref<TWeekMenuEntry[]>([])
const sheetDays = ref<string[]>([])
const chosenDays = ref<string[]>([])
const listEntries = computed(() => sheetEntries.value.filter(entry => chosenDays.value.includes(entry.date)))
const chosenRows = computed(() => rows.value.filter(row => row.selected))

// The rows for the chosen days (worked out again when the days change)
function buildRows() {
  rows.value = combineWeekIngredients(listEntries.value).map(row => ({
    name: row.name,
    detail: `${i18n.t('weekMenu.forDishes')}: ${row.recipes.join(', ')}`,
    quantity: row.quantity,
    selected: row.selected,
  }))
}
function toggleDay(day: string) {
  chosenDays.value = chosenDays.value.includes(day) ? chosenDays.value.filter(d => d !== day) : [...chosenDays.value, day].sort()
  buildRows()
}

async function openListDialog() {
  const { days: offered, chosen } = listDays(newEntries.value, todayKey.value)
  sheetEntries.value = newEntries.value
  sheetDays.value = offered
  chosenDays.value = chosen
  buildRows()
  listOpen.value = true
  if (lists.value.length === 0) await fetchLists().catch(() => undefined)
  // The list chosen last time, while the user is still on it; else the first
  const kept = lists.value.some(l => l.id === chosenListId.value)
  chosenListId.value = kept ? chosenListId.value : lists.value[0]?.id ?? null
}
function addWeek() {
  return once(async () => {
    if (!menu.value || chosenListId.value === null || chosenRows.value.length === 0) return
    const menuId = menu.value.id
    const listId = chosenListId.value
    const list = lists.value.find(l => l.id === listId)
    const changedMeanwhile = () => {
      listOpen.value = false
      showNotification(i18n.t('weekMenu.changedMeanwhile'))
      void loadWeek()
    }
    // The dishes of the dialog that are still new now (someone else may have put some on a list while it was open)
    const ids = listEntries.value.map(entry => entry.id)
    if (!ids.every(id => entries.value.some(entry => entry.id === id && !entry.added_to_list_at))) return changedMeanwhile()
    await whileChanging(async () => {
      // First claimed (for everyone in the menu), so two people at once don't both put them on a list
      let claimed: number[]
      try {
        claimed = await weekMenu.claim(menuId, ids, listId)
      } catch {
        showNotification(i18n.t('weekMenu.addFailed'))
        return
      }
      if (claimed.length !== ids.length) {
        await weekMenu.unclaim(menuId, claimed).catch(() => undefined)
        return changedMeanwhile()
      }
      try {
        await weekMenu.addToList(listId, chosenRows.value.map(row => ({ name: row.name, quantity: row.quantity })))
      } catch {
        // Not on the list after all: the dishes are new again, so the next try takes them along
        await weekMenu.unclaim(menuId, claimed).catch(() => undefined)
        showNotification(i18n.t('weekMenu.addFailed'))
        return
      }
      tellOthers(menuId)
      listOpen.value = false
      showSuccess(i18n.t('weekMenu.addedToList').split('{name}').join(list?.name ?? ''))
    })
    void loadWeek()
  })
}

// ----- Two or more menus (an own one and a shared one): the name on top chooses which -----
const switchOpen = ref(false)
function membersOf(option: TWeekMenu) {
  const people = [option.created_by, ...option.members].filter(p => p && p.id !== userId.value) as { name: string }[]
  return people.length ? i18n.t('weekMenu.members').split('{names}').join(people.map(p => p.name).join(', ')) : ''
}
function chooseMenu(id: number) {
  switchOpen.value = false
  selectedId.value = id
}

// ----- The menu itself -----
const optionsOpen = ref(false)
const newName = ref('')
const confirmOpen = ref(false)
const newMenuOpen = ref(false)
function openOptions() {
  newName.value = menu.value?.name ?? ''
  optionsOpen.value = true
}
const sharing = ref(false)
async function share() {
  // A double click makes one link (and doesn't run into the API's limit)
  if (!menu.value || sharing.value) return
  sharing.value = true
  try {
    const link = await weekMenu.createInviteLink(menu.value.id)
    await shareLink(link.url, menu.value.name, i18n.t('weekMenu.title'))
  } catch {
    showNotification(i18n.t('weekMenu.shareFailed'))
  } finally {
    sharing.value = false
  }
}
function rename() {
  return once(async () => {
    if (!menu.value || !newName.value.trim()) return
    try {
      await weekMenu.renameMenu(menu.value.id, newName.value.trim())
      tellOthers(menu.value.id)
      optionsOpen.value = false
    } catch {
      showNotification(i18n.t('weekMenu.renameFailed'))
    }
  })
}
function removePerson(memberId: number) {
  return once(async () => {
    if (!menu.value) return
    try {
      await weekMenu.removeMember(menu.value.id, memberId)
      tellOthers(menu.value.id)
    } catch {
      showNotification(i18n.t('weekMenu.removePersonFailed'))
    }
  })
}
function confirmDelete() {
  return once(async () => {
    if (!menu.value) return
    const owner = menu.value.is_owner
    try {
      const menuId = menu.value.id
      await weekMenu.deleteMenu(menuId)
      // The others in it see it's gone (or that someone left)
      tellOthers(menuId)
      confirmOpen.value = false
      optionsOpen.value = false
      selectedId.value = null
    } catch {
      showNotification(i18n.t(owner ? 'weekMenu.deleteFailed' : 'weekMenu.leaveFailed'))
    }
  })
}
</script>

<template>
  <div class="week-shell px-4 py-6">
    <div class="w-full max-w-6xl mx-auto flex flex-col gap-5">
      <PageHeader back-to="/recipes" :title="menu?.name ?? i18n.t('weekMenu.title')" :subtitle="membersLine">
        <template v-if="menu && menus.length > 1" #title>
          <button type="button" class="week-switch" :aria-label="`${menu.name}: ${i18n.t('weekMenu.switchHint')}`" aria-haspopup="dialog"
            data-testid="week-menu-switch" @click="switchOpen = true">
            <h1 class="page-heading truncate">{{ menu.name }}</h1>
            <i class="pi pi-chevron-down" aria-hidden="true" />
          </button>
        </template>
        <template v-if="menu" #actions>
          <div class="flex gap-2">
            <Button
              v-if="menu.is_owner"
              icon="pi pi-user-plus"
              :label="i18n.t('weekMenu.share')"
              severity="secondary"
              outlined
              data-testid="week-menu-share"
              @click="share"
            />
            <Button
              icon="pi pi-ellipsis-h"
              :aria-label="i18n.t('weekMenu.options')"
              severity="secondary"
              text
              data-testid="week-menu-options"
              @click="openOptions"
            />
          </div>
        </template>
      </PageHeader>

      <Loader v-if="!loaded && !loadFailed" />
      <p v-else-if="loadFailed" class="py-12 text-center text-sm text-surface-500">{{ i18n.t('weekMenu.loadFailed') }}</p>

      <!-- Nobody has one until they make one, or join one through an invite link -->
      <div v-else-if="!menu" class="flex flex-col items-center text-center gap-4 py-12" data-testid="week-menu-empty">
        <i class="pi pi-calendar text-4xl text-primary-500" />
        <h2 class="text-xl font-semibold">{{ i18n.t('weekMenu.emptyTitle') }}</h2>
        <p class="text-sm text-surface-600 max-w-md">{{ i18n.t('weekMenu.emptyBody') }}</p>
        <Button :label="i18n.t('weekMenu.create')" :loading="busy" data-testid="week-menu-create" @click="create" />
        <p class="text-xs text-surface-500">{{ i18n.t('weekMenu.joinHint') }}</p>
      </div>

      <template v-else>
        <!-- The week: big, with what's planned and what's on the list, and the button that puts the rest on one -->
        <div class="week-hero rounded-2xl px-5 py-5 md:px-7 flex flex-col md:flex-row md:items-center gap-4">
          <div class="flex items-center gap-3 flex-1">
            <button class="week-nav" :aria-label="i18n.t('weekMenu.previousWeek')" data-testid="week-menu-previous"
              @click="monday = addDays(monday, -7)"><i class="pi pi-chevron-left" /></button>
            <div class="flex flex-col">
              <span class="week-kicker">{{ isThisWeek ? i18n.t('weekMenu.thisWeek') : '' }}
                <button v-if="!isThisWeek" class="underline" @click="monday = mondayOf(new Date())"><span aria-hidden="true">↺</span> {{ i18n.t('weekMenu.thisWeek') }}</button>
              </span>
              <span class="week-title" data-testid="week-menu-week">{{ weekLabel(monday, i18n.locale) }}</span>
              <span class="week-summary">{{ summary }}</span>
            </div>
            <button class="week-nav" :aria-label="i18n.t('weekMenu.nextWeek')" data-testid="week-menu-next"
              @click="monday = addDays(monday, 7)"><i class="pi pi-chevron-right" /></button>
          </div>
          <Button
            class="week-add md:w-auto w-full"
            icon="pi pi-shopping-cart"
            :label="entries.length && !newEntries.length
              ? i18n.t('weekMenu.allAdded')
              : i18n.t('weekMenu.addNew').split('{count}').join(String(upcomingNew.length || newEntries.length))"
            :disabled="newEntries.length === 0"
            data-testid="week-menu-add-week"
            @click="openListDialog"
          />
        </div>

        <div v-if="weekState === 'failed'" class="flex flex-col items-center gap-2 py-8 text-sm text-surface-500">
          {{ i18n.t('weekMenu.loadFailed') }}
          <Button :label="i18n.t('weekMenu.retry')" text @click="loadWeek" />
        </div>
        <Loader v-else-if="weekState === 'loading' && entries.length === 0" />

        <!-- Phone: the days under each other, an empty day a single line. Wide screen: 7 columns, like a calendar -->
        <div v-else class="week-grid">
          <section
            v-for="day in days"
            :key="toDateKey(day)"
            class="week-day"
            :class="{ 'is-today': toDateKey(day) === todayKey, 'is-past': toDateKey(day) < todayKey, 'is-empty': !entriesOn(toDateKey(day)).length }"
            :aria-current="toDateKey(day) === todayKey ? 'date' : undefined"
            :data-testid="`week-menu-day-${toDateKey(day)}`"
          >
            <header class="week-day-head">
              <span class="week-day-name">{{ capitalize(dayLabel(day, i18n.locale).split(' ')[0] ?? '') }}</span>
              <span class="week-day-date">{{ day.getDate() }}</span>
              <span v-if="toDateKey(day) === todayKey" class="week-today">{{ i18n.t('weekMenu.today') }}</span>
              <button class="week-day-add" :aria-label="`${i18n.t('weekMenu.addDish')}: ${dayLabel(day, i18n.locale)}`" :data-testid="`week-menu-add-${toDateKey(day)}`"
                @click="openPicker(toDateKey(day))"><i class="pi pi-plus" /></button>
            </header>

            <article v-for="entry in entriesOn(toDateKey(day))" :key="entry.id" class="week-dish">
              <button class="week-dish-open" :data-testid="`week-menu-entry-${entry.id}`" @click="openRecipe(entry)">
                <span class="week-dish-photo">
                  <img v-if="entry.recipe.thumb_url" :src="entry.recipe.thumb_url" alt="" loading="lazy" />
                  <span v-else aria-hidden="true">🍽️</span>
                  <span v-if="entry.added_to_list_at" class="week-dish-check" :title="listStatus(entry)"><i class="pi pi-check" /></span>
                </span>
                <span class="week-dish-text">
                  <span class="week-dish-title">{{ entry.recipe.title }}</span>
                  <span v-if="entryMeta(entry)" class="week-dish-meta">{{ entryMeta(entry) }}</span>
                  <span v-if="listStatus(entry)" class="week-dish-list" :data-testid="`week-menu-on-list-${entry.id}`">{{ listStatus(entry) }}</span>
                </span>
              </button>
              <div class="week-dish-actions">
                <!-- For how many, right here -->
                <div class="week-stepper">
                  <button :disabled="entry.servings <= 1" :aria-label="i18n.t('weekMenu.fewerServings').split('{title}').join(entry.recipe.title)"
                    :data-testid="`week-menu-servings-less-${entry.id}`" @click="changeEntry(entry, { servings: entry.servings - 1 })">−</button>
                  <span aria-live="polite" :data-testid="`week-menu-servings-${entry.id}`">{{ i18n.t('weekMenu.servings').split('{count}').join(String(entry.servings)) }}</span>
                  <button :disabled="entry.servings >= MAX_SERVINGS" :aria-label="i18n.t('weekMenu.moreServings').split('{title}').join(entry.recipe.title)"
                    :data-testid="`week-menu-servings-more-${entry.id}`" @click="changeEntry(entry, { servings: entry.servings + 1 })">+</button>
                </div>
                <button class="week-more" :aria-label="i18n.t('weekMenu.dishOptions').split('{title}').join(entry.recipe.title)" :data-testid="`week-menu-entry-more-${entry.id}`"
                  @click="entryId = entry.id"><i class="pi pi-ellipsis-h" /></button>
              </div>
            </article>

            <button v-if="!entriesOn(toDateKey(day)).length" class="week-day-empty" @click="openPicker(toDateKey(day))">
              <i class="pi pi-plus" /> {{ i18n.t('weekMenu.addDish') }}
            </button>
          </section>
        </div>
      </template>
    </div>
  </div>

  <!-- Choosing a dish for a day, from the user's own recipe book -->
  <Dialog :visible="pickDate !== null" modal :header="pickDate ? i18n.t('weekMenu.pickTitle').split('{day}').join(dayLabel(fromDateKey(pickDate), i18n.locale)) : ''"
    :style="{ width: '28rem', maxWidth: '90vw' }" @update:visible="value => { if (!value) pickDate = null }">
    <InputText v-model="pickSearch" :placeholder="i18n.t('weekMenu.pickSearch')" :aria-label="i18n.t('weekMenu.pickSearch')" class="w-full mb-3" data-testid="week-menu-pick-search" />
    <div v-if="pickFilters.length > 1" class="flex flex-wrap gap-2 mb-3">
      <Button v-for="option in pickFilters" :key="option.value" :label="option.label" size="small" rounded
        :icon="option.value === 'favorites' ? 'pi pi-star-fill' : undefined"
        :severity="pickFilter === option.value ? undefined : 'secondary'" :outlined="pickFilter !== option.value"
        :aria-pressed="pickFilter === option.value" :data-testid="`week-menu-pick-filter-${option.value}`"
        @click="pickFilter = option.value" />
    </div>
    <div class="max-h-96 overflow-y-auto flex flex-col">
      <p v-if="recipes.length === 0" class="py-6 text-center text-sm text-surface-500">{{ i18n.t('weekMenu.pickEmpty') }}</p>
      <p v-else-if="pickRecent.length === 0 && pickRecipes.length === 0" class="py-6 text-center text-sm text-surface-500">{{ i18n.t('weekMenu.pickNoMatch') }}</p>
      <template v-for="(group, groupIndex) in [pickRecent, pickRecipes]" :key="groupIndex">
        <p v-if="pickRecent.length && group.length" class="mt-2 mb-1 text-xs font-semibold text-surface-500">
          {{ groupIndex === 0 ? i18n.t('weekMenu.pickRecent') : i18n.t('weekMenu.pickAll') }}
        </p>
        <button
          v-for="recipe in group"
          :key="recipe.id"
          class="flex items-center gap-3 py-2 text-left hover:bg-surface-50 rounded"
          :disabled="busy"
          :data-testid="`week-menu-pick-${recipe.id}`"
          @click="pickRecipe(recipe)"
        >
          <img v-if="recipe.thumb_url" :src="recipe.thumb_url" alt="" class="w-10 h-10 rounded-lg object-cover" />
          <span v-else class="w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center"><i class="pi pi-image text-surface-300" /></span>
          <span class="flex-1 flex flex-col">
            <span class="text-sm">{{ recipe.title }}</span>
            <span v-if="plannedOn(recipe)" class="text-xs text-amber-700" :data-testid="`week-menu-pick-planned-${recipe.id}`">{{ plannedOn(recipe) }}</span>
          </span>
          <i v-if="recipe.favorite" class="pi pi-star-fill text-yellow-500 text-xs" />
        </button>
      </template>
    </div>
  </Dialog>

  <!-- Choosing between the user's week menus: the one shown has a check -->
  <Dialog v-model:visible="switchOpen" modal :header="i18n.t('weekMenu.switchTitle')" :style="{ width: '24rem', maxWidth: '90vw' }">
    <div class="flex flex-col">
      <button
        v-for="option in menus"
        :key="option.id"
        type="button"
        class="flex items-center gap-3 py-3 px-2 text-left rounded hover:bg-surface-50"
        :aria-pressed="option.id === menu?.id"
        :data-testid="`week-menu-choose-${option.id}`"
        @click="chooseMenu(option.id)"
      >
        <i class="pi pi-calendar text-surface-500" aria-hidden="true" />
        <span class="flex-1 flex flex-col min-w-0">
          <span class="text-sm truncate" :class="{ 'font-semibold': option.id === menu?.id }">{{ option.name }}</span>
          <span v-if="membersOf(option)" class="text-xs text-surface-500 truncate">{{ membersOf(option) }}</span>
        </span>
        <i v-if="option.id === menu?.id" class="pi pi-check text-primary-600" aria-hidden="true" />
      </button>
    </div>
  </Dialog>

  <!-- A planned dish -->
  <Dialog :visible="openEntry !== null" modal :header="openEntry?.recipe.title ?? ''" :style="{ width: '26rem', maxWidth: '90vw' }"
    @update:visible="value => { if (!value) entryId = null }">
    <template v-if="openEntry">
      <p class="mb-2 text-xs font-semibold text-surface-500">{{ i18n.t('weekMenu.moveTo') }}</p>
      <div class="flex flex-wrap gap-2">
        <Button
          v-for="day in days"
          :key="toDateKey(day)"
          :label="dayLabel(day, i18n.locale)"
          size="small"
          rounded
          :severity="toDateKey(day) === openEntry.date ? undefined : 'secondary'"
          :outlined="toDateKey(day) !== openEntry.date"
          :aria-pressed="toDateKey(day) === openEntry.date"
          :data-testid="`week-menu-move-${toDateKey(day)}`"
          @click="toDateKey(day) !== openEntry.date && changeEntry(openEntry, { date: toDateKey(day) })"
        />
      </div>
      <div class="mt-5 flex flex-col items-start gap-1">
        <Button :label="i18n.t('weekMenu.openRecipe')" icon="pi pi-book" text @click="openRecipe(openEntry)" />
        <Button v-if="openEntry.added_to_list_at" :label="i18n.t('weekMenu.addAgain')" icon="pi pi-replay" text
          data-testid="week-menu-add-again" @click="changeEntry(openEntry, { reset_added: true }); entryId = null" />
        <Button :label="i18n.t('weekMenu.remove')" icon="pi pi-trash" text severity="danger" data-testid="week-menu-remove"
          @click="removeEntry(openEntry)" />
      </div>
    </template>
  </Dialog>

  <!-- All ingredients of the week on a list -->
  <Dialog v-model:visible="listOpen" modal :header="i18n.t('weekMenu.sheetTitle')" :style="{ width: '32rem', maxWidth: '90vw' }">
    <p class="text-sm text-surface-500 mb-2">{{ i18n.t('weekMenu.sheetSubtitle') }}</p>
    <!-- Shopping on Tuesday: Monday's dish is past, so it starts unchosen -->
    <template v-if="sheetDays.length > 1">
      <p class="mb-2 text-xs font-semibold text-surface-500">{{ i18n.t('weekMenu.whichDays') }}</p>
      <div class="flex flex-wrap gap-2 mb-3">
        <Button v-for="day in sheetDays" :key="day" :label="dayLabel(fromDateKey(day), i18n.locale)" size="small" rounded
          :severity="chosenDays.includes(day) ? undefined : 'secondary'" :outlined="!chosenDays.includes(day)"
          :aria-pressed="chosenDays.includes(day)" :data-testid="`week-menu-list-day-${day}`" @click="toggleDay(day)" />
      </div>
    </template>
    <div class="max-h-80 overflow-y-auto divide-y divide-surface-100">
      <div v-for="(row, index) in rows" :key="`${row.name}-${index}`" class="flex items-center gap-3 py-2">
        <label class="flex flex-1 items-center gap-3 cursor-pointer">
          <input v-model="row.selected" type="checkbox" class="w-4 h-4" />
          <span class="flex flex-col">
            <span class="text-sm font-medium" :class="{ 'text-surface-400': !row.selected }">{{ row.name }}</span>
            <span class="text-xs text-surface-500">{{ row.detail }}</span>
          </span>
        </label>
        <div v-if="row.selected" class="flex items-center gap-1">
          <Button icon="pi pi-minus" text rounded size="small" severity="secondary" :aria-label="`− ${row.name}`"
            @click="row.quantity = Math.max(1, row.quantity - 1)" />
          <span class="w-8 text-center text-sm">{{ row.quantity }}x</span>
          <Button icon="pi pi-plus" text rounded size="small" severity="secondary" :aria-label="`+ ${row.name}`"
            @click="row.quantity = Math.min(MAX_LIST_QUANTITY, row.quantity + 1)" />
        </div>
      </div>
    </div>
    <p class="mt-4 mb-2 text-xs font-semibold text-surface-500">{{ i18n.t('weekMenu.list') }}</p>
    <p v-if="lists.length === 0" class="text-sm text-surface-500">{{ i18n.t('weekMenu.noLists') }}</p>
    <div v-else class="flex flex-wrap gap-2">
      <Button v-for="list in lists" :key="list.id" :label="list.name" size="small" rounded
        :severity="list.id === chosenListId ? undefined : 'secondary'" :outlined="list.id !== chosenListId"
        :aria-pressed="list.id === chosenListId" @click="chosenListId = list.id" />
    </div>
    <Button
      class="w-full mt-5"
      icon="pi pi-shopping-cart"
      :label="i18n.t('weekMenu.add').split('{count}').join(String(chosenRows.length))"
      :disabled="chosenRows.length === 0 || chosenListId === null"
      :loading="busy"
      data-testid="week-menu-list-add"
      @click="addWeek"
    />
  </Dialog>

  <!-- The menu's own options -->
  <Dialog v-model:visible="optionsOpen" modal :header="menu?.name ?? ''" :style="{ width: '26rem', maxWidth: '90vw' }">
    <template v-if="menu">
      <template v-if="menu.is_owner">
        <p class="mb-2 text-xs font-semibold text-surface-500">{{ i18n.t('weekMenu.renameTitle') }}</p>
        <div class="flex gap-2">
          <InputText v-model="newName" class="flex-1" maxlength="60" :aria-label="i18n.t('weekMenu.renameTitle')" data-testid="week-menu-name" />
          <Button icon="pi pi-check" :aria-label="i18n.t('weekMenu.rename')" :disabled="!newName.trim() || newName.trim() === menu.name"
            @click="rename" />
        </div>
        <template v-if="menu.members.length">
          <p class="mt-4 mb-2 text-xs font-semibold text-surface-500">{{ i18n.t('weekMenu.people') }}</p>
          <div v-for="member in menu.members" :key="member.id" class="flex items-center justify-between py-1.5 text-sm">
            {{ member.name }}
            <Button :label="i18n.t('weekMenu.removePerson')" text severity="danger" size="small" @click="removePerson(member.id)" />
          </div>
        </template>
      </template>
      <div class="mt-4 flex flex-col items-start gap-1">
        <!-- Already in a menu: asked first, a second one is rarely meant (and gives two weeks side by side) -->
        <Button :label="i18n.t('weekMenu.newMenu')" icon="pi pi-plus-circle" text data-testid="week-menu-new"
          @click="optionsOpen = false; newMenuOpen = true" />
        <Button :label="menu.is_owner ? i18n.t('weekMenu.delete') : i18n.t('weekMenu.leave')"
          :icon="menu.is_owner ? 'pi pi-trash' : 'pi pi-sign-out'" text severity="danger" data-testid="week-menu-leave-or-delete"
          @click="confirmOpen = true" />
      </div>
    </template>
  </Dialog>

  <Dialog v-model:visible="newMenuOpen" modal :header="i18n.t('weekMenu.newMenuTitle')" :style="{ width: '26rem', maxWidth: '90vw' }"
    data-testid="week-menu-new-warning">
    <p class="text-sm text-surface-600 leading-relaxed">{{ i18n.t('weekMenu.newMenuBody').split('{name}').join(menu?.name ?? '') }}</p>
    <div class="flex justify-end gap-2 mt-5">
      <Button :label="i18n.t('common.cancel')" severity="secondary" outlined @click="newMenuOpen = false" />
      <Button :label="i18n.t('weekMenu.newMenuConfirm')" data-testid="week-menu-new-confirm" @click="newMenuOpen = false; create()" />
    </div>
  </Dialog>

  <deleteModal
    :is-visible="confirmOpen"
    :title="menu?.is_owner ? i18n.t('weekMenu.deleteTitle') : i18n.t('weekMenu.leaveTitle')"
    :content="menu?.is_owner ? i18n.t('weekMenu.deleteBody') : i18n.t('weekMenu.leaveBody')"
    :item-name="menu?.name || ''"
    :delete-button-text="menu?.is_owner ? i18n.t('weekMenu.delete') : i18n.t('weekMenu.leave')"
    :with-validation="false"
    @close="confirmOpen = false"
    @confirm="confirmDelete"
  />
</template>

<style scoped>
.week-shell {
  font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
  background: transparent;
}

/* The week's heading: navy like the app's header, with the week big */
.week-hero {
  background: linear-gradient(135deg, #1c2b2b 0%, #2b4441 100%);
  color: #fff;
  box-shadow: 0 6px 24px rgba(28, 43, 43, 0.18);
}
.week-kicker { font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #9fd9b8; min-height: 16px; }
.week-title { font-size: 28px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.15; }
.week-summary { font-size: 13px; color: #c6cccc; margin-top: 2px; }
.week-nav {
  width: 40px; height: 40px; border-radius: 999px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255, 255, 255, 0.1); color: #fff; transition: background 0.15s;
}
.week-nav:hover { background: rgba(255, 255, 255, 0.2); }
:deep(.week-add.p-button) { background: #5ebd8a; border-color: #5ebd8a; font-weight: 600; }
:deep(.week-add.p-button:disabled) { background: rgba(255, 255, 255, 0.15); border-color: transparent; color: #c6cccc; opacity: 1; }

.week-grid { display: flex; flex-direction: column; gap: 10px; }
@media (min-width: 1024px) {
  .week-grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 12px; align-items: start; }
}

.week-day {
  background: var(--p-surface-0);
  border-radius: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
  padding: 12px;
  display: flex; flex-direction: column; gap: 10px;
  border: 1px solid transparent;
}
.week-day.is-today { border-color: #5ebd8a; box-shadow: 0 2px 10px rgba(94, 189, 138, 0.2); }
.week-day.is-empty { padding: 8px 12px; }
/* Gone by: dimmed, so the eye goes to today and what's coming (still there to look back at or change) */
.week-day.is-past { opacity: 0.55; }
.week-day.is-past:hover, .week-day.is-past:focus-within { opacity: 1; }
.week-switch { display: flex; align-items: center; gap: 8px; min-width: 0; text-align: left; border-radius: 6px; }
.week-switch:hover { color: #3f9a6b; }
.week-switch i { font-size: 14px; color: var(--p-surface-500); }
@media (min-width: 1024px) { .week-day, .week-day.is-empty { min-height: 220px; padding: 12px; } }

.week-day-head { display: flex; align-items: baseline; gap: 6px; }
.week-day-name { font-size: 13px; font-weight: 600; color: var(--p-surface-500); }
.week-day-date { font-size: 20px; font-weight: 700; color: var(--p-surface-900); }
.is-today .week-day-name, .is-today .week-day-date { color: #3f9a6b; }
.week-today { font-size: 11px; font-weight: 600; color: #fff; background: #5ebd8a; padding: 1px 6px; border-radius: 6px; align-self: center; }
/* In a narrow column the green border and date say it's today */
@media (min-width: 1024px) { .week-today { display: none; } }
.week-day-add {
  margin-left: auto; width: 28px; height: 28px; border-radius: 999px; align-self: center;
  display: flex; align-items: center; justify-content: center; font-size: 12px;
  color: #3f9a6b; background: rgba(94, 189, 138, 0.12); transition: background 0.15s;
}
.week-day-add:hover { background: rgba(94, 189, 138, 0.25); }
.week-day-empty { display: none; }
@media (min-width: 1024px) {
  .week-day-empty {
    display: flex; flex: 1; align-items: center; justify-content: center; gap: 6px; min-height: 140px;
    border: 1.5px dashed var(--p-surface-200); border-radius: 10px; font-size: 13px; color: var(--p-surface-400);
    transition: border-color 0.15s, color 0.15s;
  }
  .week-day-empty:hover { border-color: #5ebd8a; color: #3f9a6b; }
}

/* A dish: a row on a phone, a photo card in a column */
.week-dish { display: flex; align-items: center; gap: 8px; position: relative; }
@media (min-width: 1024px) { .week-dish { flex-direction: column; align-items: stretch; gap: 6px; } }
.week-dish-open { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; text-align: left; }
@media (min-width: 1024px) { .week-dish-open { flex-direction: column; align-items: stretch; gap: 6px; } }
.week-dish-photo {
  position: relative; flex-shrink: 0; width: 52px; height: 52px; border-radius: 10px; overflow: hidden;
  background: var(--p-surface-100); display: flex; align-items: center; justify-content: center; font-size: 20px;
}
.week-dish-photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
@media (min-width: 1024px) { .week-dish-photo { width: 100%; height: auto; aspect-ratio: 4 / 3; font-size: 28px; } }
.week-dish-check {
  position: absolute; right: 4px; bottom: 4px; width: 20px; height: 20px; border-radius: 999px;
  display: flex; align-items: center; justify-content: center; font-size: 10px; color: #fff; background: #5ebd8a;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
.week-dish-text { display: flex; flex-direction: column; min-width: 0; }
.week-dish-title { font-size: 14px; font-weight: 600; color: var(--p-surface-900); line-height: 1.25; }
.week-dish-meta { font-size: 12px; color: var(--p-surface-500); }
.week-dish-list { font-size: 12px; color: #3f9a6b; }
.week-dish-actions { display: flex; align-items: center; gap: 4px; }
@media (min-width: 1024px) {
  .week-dish-actions { display: block; }
  /* The stepper as wide as the column; the menu button on the photo */
  .week-stepper { justify-content: space-between; }
  .week-more { position: absolute; top: 6px; right: 6px; background: rgba(255, 255, 255, 0.92); color: var(--p-surface-600); box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15); }
  .week-more:hover { background: #fff; }
}
.week-stepper {
  display: flex; align-items: center; border-radius: 999px; background: var(--p-surface-100);
  font-size: 12px; font-weight: 600; color: var(--p-surface-700);
}
.week-stepper span { min-width: 52px; text-align: center; }
.week-stepper button { width: 26px; height: 26px; border-radius: 999px; font-size: 15px; line-height: 1; }
.week-stepper button:hover:not(:disabled) { background: var(--p-surface-200); }
.week-stepper button:disabled { opacity: 0.35; }
.week-more { width: 28px; height: 28px; border-radius: 999px; color: var(--p-surface-400); }
.week-more:hover { background: var(--p-surface-100); }
</style>
