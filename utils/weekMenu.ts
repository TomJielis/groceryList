// The week menu's calendar and putting a week on a list (pages/recipes/week-menu.vue). The same rules as the app's
// utils/week-menu.ts, so both put the same on a list.
import type { TWeekMenuEntry } from '~/types/TWeekMenu'

// Units you buy per piece or package: the amounts become the number on the list (2 blik = 2x). Anything else (g, ml,
// el, teentjes...) is bought as one package. The same list as the app's utils/recipes.ts.
const COUNTED_UNITS = [
    '', 'stuk', 'stuks', 'blik', 'blikje', 'blikjes', 'pot', 'potje', 'potjes', 'zak', 'zakje', 'zakjes', 'bosje', 'bosjes',
    'krop', 'bol', 'bollen', 'fles', 'flessen', 'pak', 'pakken', 'piece', 'pieces', 'can', 'cans', 'tin', 'tins', 'jar',
    'jars', 'bag', 'bags', 'bunch', 'bunches', 'head', 'bottle', 'bottles', 'pack', 'packs',
]

// The most of one product the week can put on a list (the API's WeekPlannerController::MAX_QUANTITY)
export const MAX_LIST_QUANTITY = 99

/** A day as the API knows it: YYYY-MM-DD in the browser's own time (not UTC, or late evening would be the next day) */
export function toDateKey(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${date.getFullYear()}-${month}-${day}`
}

export function fromDateKey(key: string): Date {
    const [year = 1970, month = 1, day = 1] = key.split('-').map(Number)
    return new Date(year, month - 1, day)
}

// Through the calendar, not milliseconds: a day with a clock change is still one day
export function addDays(date: Date, days: number): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

/** The Monday of the week a day is in (weeks run Monday to Sunday) */
export function mondayOf(date: Date): Date {
    return addDays(date, -((date.getDay() + 6) % 7))
}

export function weekDays(monday: Date): Date[] {
    return Array.from({ length: 7 }, (_, index) => addDays(monday, index))
}

const MONTHS: Record<'nl' | 'en', string[]> = {
    nl: ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
}
const DAYS: Record<'nl' | 'en', string[]> = {
    nl: ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'],
    en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
}

const lang = (locale: string): 'nl' | 'en' => (locale === 'nl' ? 'nl' : 'en')

/** "16 – 22 nov", or across months "29 dec – 4 jan" */
export function weekLabel(monday: Date, locale: string): string {
    const sunday = addDays(monday, 6)
    const months = MONTHS[lang(locale)]
    const start = monday.getMonth() === sunday.getMonth() ? `${monday.getDate()}` : `${monday.getDate()} ${months[monday.getMonth()]}`
    return `${start} – ${sunday.getDate()} ${months[sunday.getMonth()]}`
}

/** "ma 17 nov" */
export function dayLabel(date: Date, locale: string): string {
    return `${DAYS[lang(locale)][(date.getDay() + 6) % 7]} ${date.getDate()} ${MONTHS[lang(locale)][date.getMonth()]}`
}

export type TWeekListRow = { name: string; quantity: number; selected: boolean; recipes: string[] }

/**
 * All ingredients of the planned dishes as one shopping list: the same ingredient (ignoring capitals and spaces) of
 * several dishes becomes one row. Pieces and packages are added up, scaled to each dish's servings and rounded up;
 * anything weighed or measured is one package. "To taste" everywhere starts unticked.
 */
export function combineWeekIngredients(entries: TWeekMenuEntry[]): TWeekListRow[] {
    const rows = new Map<string, TWeekListRow & { counted: number; anyAmount: boolean }>()
    for (const entry of entries) {
        const factor = entry.servings / Math.max(1, entry.recipe.servings)
        for (const ingredient of entry.recipe.ingredients) {
            const key = ingredient.name.trim().toLowerCase()
            if (!key) continue
            const row = rows.get(key) ?? { name: ingredient.name.trim(), quantity: 1, selected: false, recipes: [], counted: 0, anyAmount: false }
            if (ingredient.amount !== null) {
                row.anyAmount = true
                if (COUNTED_UNITS.includes((ingredient.unit ?? '').trim().toLowerCase())) row.counted += ingredient.amount * factor
            }
            if (!row.recipes.includes(entry.recipe.title)) row.recipes.push(entry.recipe.title)
            rows.set(key, row)
        }
    }
    return [...rows.values()].map(({ counted, anyAmount, ...row }) => ({
        ...row,
        quantity: Math.min(MAX_LIST_QUANTITY, Math.max(1, Math.ceil(counted - 0.001))),
        selected: anyAmount,
    }))
}

/**
 * The days to offer when putting dishes on a list: the days with those dishes, in order. Chosen at first: today and
 * later (shopping on Tuesday, Monday's dinner is past); when every day is past, all of them. Like the app.
 */
export function listDays(entries: TWeekMenuEntry[], today: string): { days: string[]; chosen: string[] } {
    const days = [...new Set(entries.map(entry => entry.date))].sort()
    const upcoming = days.filter(day => day >= today)
    return { days, chosen: upcoming.length > 0 ? upcoming : days }
}

/**
 * The recipes planned most recently (the latest day first), each once: the picker offers them first, as most families
 * eat a few dishes over and over. The same as the app's recentRecipeIds.
 */
export function recentRecipeIds(entries: Pick<TWeekMenuEntry, 'date' | 'recipe'>[], max: number): number[] {
    const ids: number[] = []
    for (const entry of [...entries].sort((a, b) => b.date.localeCompare(a.date))) {
        if (!ids.includes(entry.recipe.id)) ids.push(entry.recipe.id)
        if (ids.length === max) break
    }
    return ids
}

// Per recipe the days it's planned on (YYYY-MM-DD, in order): the picker says "already on Thu 19 Nov"
export function plannedDays(entries: Pick<TWeekMenuEntry, 'date' | 'recipe'>[]): Map<number, string[]> {
    const days = new Map<number, string[]>()
    for (const entry of entries) {
        const known = days.get(entry.recipe.id) ?? []
        if (!known.includes(entry.date)) days.set(entry.recipe.id, [...known, entry.date].sort())
    }
    return days
}
