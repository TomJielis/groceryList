# Swipe Actions List Items Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add swipe gestures to grocery list items for quick check/edit actions with larger touch targets.

**Architecture:** Wrap display mode in swipeable container using CSS transforms and touch events. Track swipe offset in reactive state, trigger actions at threshold. Desktop fallback with hover-revealed buttons.

**Tech Stack:** Vue 3 Composition API, CSS transforms, native touch events

---

## Task 1: Add Touch Event State and Handlers

**Files:**
- Modify: `components/list/groceryListItem.vue:1-42`

**Step 1: Add swipe state refs**

Add after line 22 (`const localItem = ref...`):

```typescript
// Swipe state
const swipeOffset = ref(0);
const isSwiping = ref(false);
const startX = ref(0);
const SWIPE_THRESHOLD = 80;
```

**Step 2: Add touch event handlers**

Add after the swipe state refs:

```typescript
const onTouchStart = (e: TouchEvent) => {
  if (props.isEditing) return;
  startX.value = e.touches[0].clientX;
  isSwiping.value = true;
};

const onTouchMove = (e: TouchEvent) => {
  if (!isSwiping.value || props.isEditing) return;
  const currentX = e.touches[0].clientX;
  const diff = currentX - startX.value;
  // Limit swipe range
  swipeOffset.value = Math.max(-120, Math.min(120, diff));
};

const onTouchEnd = () => {
  if (!isSwiping.value || props.isEditing) return;

  if (swipeOffset.value < -SWIPE_THRESHOLD) {
    // Swipe left: toggle check
    emit('check', { ...props.item, checked: !props.item.checked });
  } else if (swipeOffset.value > SWIPE_THRESHOLD) {
    // Swipe right: open edit
    emit('edit', props.item.id);
  }

  // Reset
  swipeOffset.value = 0;
  isSwiping.value = false;
};
```

**Step 3: Verify file saves correctly**

Run: `cat components/list/groceryListItem.vue | head -50`

**Step 4: Commit**

```bash
git add components/list/groceryListItem.vue
git commit -m "feat(list-item): add touch event handlers for swipe"
```

---

## Task 2: Add Swipeable Container Wrapper

**Files:**
- Modify: `components/list/groceryListItem.vue:122-194`

**Step 1: Wrap display mode in swipeable container**

Replace the entire Display Mode section (lines 122-194) with:

```vue
  <!-- Display Mode -->
  <div v-else class="relative overflow-hidden rounded-xl">
    <!-- Swipe Reveal Background -->
    <div class="absolute inset-0 flex">
      <!-- Left side: Edit (revealed when swiping right) -->
      <div class="flex-1 bg-blue-500 flex items-center justify-start pl-4">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
        </svg>
      </div>
      <!-- Right side: Check (revealed when swiping left) -->
      <div class="flex-1 flex items-center justify-end pr-4"
        :class="item.checked ? 'bg-amber-500' : 'bg-green-500'">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
    </div>

    <!-- Swipeable Card -->
    <div
      class="relative bg-white dark:bg-slate-800 shadow-sm hover:shadow-md p-4 border border-slate-200 dark:border-slate-700 transition-shadow duration-200 group touch-pan-y"
      :class="{ 'opacity-60': item.checked }"
      :style="{ transform: `translateX(${swipeOffset}px)`, transition: isSwiping ? 'none' : 'transform 0.2s ease-out' }"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <div class="flex items-center gap-3">
        <!-- Checkbox with larger tap area -->
        <div class="flex-shrink-0">
          <label class="relative flex items-center justify-center w-12 h-12 -m-3 cursor-pointer">
            <input
              type="checkbox"
              :checked="item.checked"
              @click.stop
              @change="(e) => { const target = e.target as HTMLInputElement | null; if (target) emit('check', { ...item, checked: target.checked }); }"
              class="peer sr-only"
            />
            <div class="w-7 h-7 border-2 rounded-lg transition-all duration-200 peer-checked:bg-green-500 peer-checked:border-green-500 border-slate-300 dark:border-slate-600 flex items-center justify-center">
              <svg v-if="item.checked" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
          </label>
        </div>

        <!-- Content -->
        <div
          class="flex-1 min-w-0 cursor-pointer select-none"
          @click="emit('edit', item.id)"
        >
          <div class="flex items-start justify-between gap-3">
            <!-- Left: Name and Quantity -->
            <div class="flex-1 min-w-0">
              <h3
                class="text-base font-semibold transition-colors"
                :class="item.checked
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-900 dark:text-white'"
              >
                {{ item.name }}
              </h3>
              <div class="flex items-center gap-2 mt-1">
                <span class="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                  {{ item.quantity || 1 }}x
                </span>
                <span class="text-slate-400">•</span>
                <span class="text-sm text-slate-600 dark:text-slate-400">
                  €{{ item.unit_price?.toFixed(2) || '0.00' }}
                </span>
              </div>
            </div>

            <!-- Right: Total Price -->
            <div class="flex-shrink-0 text-right">
              <div class="text-lg font-bold text-slate-900 dark:text-white">
                €{{ ((item.unit_price || 0) * (item.quantity || 1)).toFixed(2) }}
              </div>
              <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {{ i18n.t('items.total') || 'totaal' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop: Hover Action Buttons -->
        <div class="flex-shrink-0 hidden md:flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            @click.stop="emit('check', { ...item, checked: !item.checked })"
            class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            :class="item.checked
              ? 'bg-amber-100 hover:bg-amber-200 text-amber-600'
              : 'bg-green-100 hover:bg-green-200 text-green-600'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </button>
          <button
            @click.stop="emit('edit', item.id)"
            class="w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
```

**Step 2: Test in browser**

Run: `npm run dev`
- Open list page on mobile or use Chrome DevTools touch simulation
- Verify swipe left shows green checkmark background
- Verify swipe right shows blue edit background
- Verify actions trigger at threshold

**Step 3: Commit**

```bash
git add components/list/groceryListItem.vue
git commit -m "feat(list-item): add swipeable container with reveal backgrounds"
```

---

## Task 3: Add Visual Feedback During Swipe

**Files:**
- Modify: `components/list/groceryListItem.vue`

**Step 1: Add computed property for swipe visual state**

Add after touch handlers in script:

```typescript
const swipeDirection = computed(() => {
  if (swipeOffset.value < -20) return 'left';
  if (swipeOffset.value > 20) return 'right';
  return 'none';
});

const isAtThreshold = computed(() => Math.abs(swipeOffset.value) >= SWIPE_THRESHOLD);
```

**Step 2: Add import for computed**

Change line 2 from:
```typescript
import { ref, watch } from 'vue';
```
to:
```typescript
import { ref, watch, computed } from 'vue';
```

**Step 3: Update reveal backgrounds to show threshold feedback**

Find the swipe reveal background divs and update the right side check reveal:

```vue
      <!-- Right side: Check (revealed when swiping left) -->
      <div class="flex-1 flex items-center justify-end pr-4 transition-colors"
        :class="[
          item.checked ? 'bg-amber-500' : 'bg-green-500',
          isAtThreshold && swipeDirection === 'left' ? 'brightness-110' : ''
        ]">
        <svg class="w-6 h-6 text-white transition-transform"
          :class="{ 'scale-125': isAtThreshold && swipeDirection === 'left' }"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
```

And the left side edit reveal:

```vue
      <!-- Left side: Edit (revealed when swiping right) -->
      <div class="flex-1 bg-blue-500 flex items-center justify-start pl-4 transition-colors"
        :class="{ 'brightness-110': isAtThreshold && swipeDirection === 'right' }">
        <svg class="w-6 h-6 text-white transition-transform"
          :class="{ 'scale-125': isAtThreshold && swipeDirection === 'right' }"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
        </svg>
      </div>
```

**Step 4: Test visual feedback**

- Swipe slowly and verify icon scales up at threshold
- Verify brightness increases when threshold reached

**Step 5: Commit**

```bash
git add components/list/groceryListItem.vue
git commit -m "feat(list-item): add visual feedback at swipe threshold"
```

---

## Task 4: Manual Testing

**Step 1: Test on mobile device or simulator**

Checklist:
- [ ] Swipe left on unchecked item → item gets checked
- [ ] Swipe left on checked item → item gets unchecked
- [ ] Swipe right → edit mode opens
- [ ] Checkbox tap still works
- [ ] Tap on item content still opens edit
- [ ] Desktop hover shows action buttons
- [ ] Desktop click on hover buttons works
- [ ] Existing edit mode still functions correctly

**Step 2: Fix any issues found**

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat(list-item): complete swipe actions implementation"
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Touch event handlers | groceryListItem.vue |
| 2 | Swipeable container wrapper | groceryListItem.vue |
| 3 | Visual threshold feedback | groceryListItem.vue |
| 4 | Manual testing | - |
