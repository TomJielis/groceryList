<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18nStore } from '~/stores/i18n';
import { useGroceryList } from '~/composables/useGroceryList';

const props = defineProps<{
  item: any,
  isEditing: boolean,
}>();

const emit = defineEmits<{
  (e: 'update:item', item: any): void;
  (e: 'edit', id: number): void;
  (e: 'check', item: any): void;
  (e: 'save', item: any): void;
  (e: 'delete', item: any): void;
}>();

const i18n = useI18nStore();
const { decreaseItems, fetchItems } = useGroceryList();
await fetchItems();
const localItem = ref({ ...props.item });

watch(() => props.item, (newVal) => {
  localItem.value = { ...newVal };
});

const handleUnitPriceInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value.replace(',', '.');
  const num = parseFloat(val);
  localItem.value.unit_price = isNaN(num) ? undefined : num;
};

const handleSave = () => {
  // If quantity is 0, delete the item instead of saving
  if (localItem.value.quantity < 1) {
    decreaseItems(localItem.value);
  }
    emit('save', localItem.value);

};
</script>

<template>
  <!-- Edit Mode -->
  <div v-if="isEditing" class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border-2 border-blue-500 dark:border-blue-400 animate-in">
    <div class="space-y-4">
      <!-- Product Name -->
      <div>
        <label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Product</label>
        <input
          v-model="localItem.name"
          type="text"
          class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base font-medium"
          placeholder="Product naam"
        />
      </div>

      <!-- Quantity and Price Row -->
      <div class="grid grid-cols-2 gap-3">
        <!-- Quantity -->
        <div>
          <label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Aantal</label>
          <div class="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 rounded-lg p-1">
            <button
              @click="localItem.quantity = Math.max((localItem.quantity || 1) - 1, 0)"
              class="w-9 h-9 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-bold text-slate-700 dark:text-slate-200 shadow-sm active:scale-95 transition-all"
            >−</button>
            <span class="flex-1 text-center text-lg font-bold text-slate-900 dark:text-white">{{ localItem.quantity || 0 }}</span>
            <button
              @click="localItem.quantity = (localItem.quantity || 0) + 1"
              class="w-9 h-9 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-bold text-slate-700 dark:text-slate-200 shadow-sm active:scale-95 transition-all"
            >+</button>
          </div>
        </div>

        <!-- Price -->
        <div>
          <label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Prijs per stuk</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">€</span>
            <input
              v-model.number="localItem.unit_price"
              @input="handleUnitPriceInput"
              type="text"
              class="w-full pl-8 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base font-medium"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <!-- Total Price Preview -->
      <div v-if="localItem.unit_price && localItem.quantity" class="flex items-center justify-between px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <span class="text-sm font-medium text-green-700 dark:text-green-300">Totaal</span>
        <span class="text-lg font-bold text-green-700 dark:text-green-300">
          €{{ ((localItem.unit_price || 0) * (localItem.quantity || 1)).toFixed(2) }}
        </span>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2 pt-2">
        <button
          @click="emit('edit', 0)"
          class="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-lg transition active:scale-95"
        >
          Annuleren
        </button>
        <button
          @click="handleSave"
          class="flex-1 px-4 py-2.5 font-semibold rounded-lg transition active:scale-95"
          :class="localItem.quantity === 0
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'"
        >
          {{ localItem.quantity === 0 ? i18n.t('common.delete') : i18n.t('common.save') }}
        </button>
      </div>
    </div>
  </div>

  <!-- Display Mode -->
  <div v-else class="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md p-4 border border-slate-200 dark:border-slate-700 transition-all duration-200 group"
    :class="{ 'opacity-60': item.checked }"
  >
    <div class="flex items-center gap-3">
      <!-- Checkbox -->
      <div class="flex-shrink-0">
        <label class="relative flex items-center justify-center w-6 h-6 cursor-pointer">
          <input
            type="checkbox"
            :checked="item.checked"
            @click.stop
            @change="(e) => { const target = e.target as HTMLInputElement | null; if (target) emit('check', { ...item, checked: target.checked }); }"
            class="peer sr-only"
          />
          <div class="w-6 h-6 border-2 rounded-lg transition-all duration-200 peer-checked:bg-green-500 peer-checked:border-green-500 border-slate-300 dark:border-slate-600 flex items-center justify-center">
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
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>
                </svg>
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

      <!-- Edit Indicator -->
      <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: slide-in 0.2s ease-out;
}
</style>
