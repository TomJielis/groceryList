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
  <div v-if="isEditing" class="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-5 border-2 border-blue-500 dark:border-blue-400 animate-in">
    <div class="space-y-5">
      <!-- Product Name -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          {{ i18n.t('items.productName') || 'Product' }}
        </label>
        <input
          v-model="localItem.name"
          type="text"
          class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base font-medium"
          :placeholder="i18n.t('items.productNamePlaceholder') || 'Product naam'"
        />
      </div>

      <!-- Quantity and Price Row -->
      <div class="grid grid-cols-2 gap-4">
        <!-- Quantity -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            {{ i18n.t('items.quantity') || 'Aantal' }}
          </label>
          <div class="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 rounded-xl p-2">
            <button
              @click="localItem.quantity = Math.max((localItem.quantity || 1) - 1, 0)"
              class="w-10 h-10 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 rounded-lg font-bold text-slate-700 dark:text-slate-200 shadow-sm active:scale-95 transition-all flex items-center justify-center text-xl"
            >−</button>
            <span class="flex-1 text-center text-xl font-bold text-slate-900 dark:text-white">{{ localItem.quantity || 0 }}</span>
            <button
              @click="localItem.quantity = (localItem.quantity || 0) + 1"
              class="w-10 h-10 bg-white dark:bg-slate-800 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 rounded-lg font-bold text-slate-700 dark:text-slate-200 shadow-sm active:scale-95 transition-all flex items-center justify-center text-xl"
            >+</button>
          </div>
        </div>

        <!-- Price -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            {{ i18n.t('items.unitPrice') || 'Prijs per stuk' }}
          </label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">€</span>
            <input
              v-model.number="localItem.unit_price"
              @input="handleUnitPriceInput"
              type="text"
              inputmode="decimal"
              class="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base font-medium"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <!-- Total Price Preview -->
      <div v-if="localItem.unit_price && localItem.quantity" class="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
        <span class="text-sm font-semibold text-green-700 dark:text-green-300">{{ i18n.t('items.total') || 'Totaal' }}</span>
        <span class="text-xl font-bold text-green-700 dark:text-green-300">
          €{{ ((localItem.unit_price || 0) * (localItem.quantity || 1)).toFixed(2) }}
        </span>
      </div>

      <!-- Warning when quantity is 0 -->
      <div v-if="localItem.quantity === 0" class="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
        <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <span class="text-sm font-medium text-red-700 dark:text-red-300">
          {{ i18n.t('items.deleteWarning') || 'Dit item wordt verwijderd' }}
        </span>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 pt-2">
        <button
          @click="emit('edit', 0)"
          class="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition active:scale-95"
        >
          {{ i18n.t('common.cancel') || 'Annuleren' }}
        </button>
        <button
          @click="handleSave"
          class="flex-1 px-4 py-3 font-semibold rounded-xl transition active:scale-95 shadow-lg flex items-center justify-center gap-2"
          :class="localItem.quantity === 0
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'"
        >
          <svg v-if="localItem.quantity === 0" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          {{ localItem.quantity === 0 ? i18n.t('common.delete') || 'Verwijderen' : i18n.t('common.save') || 'Opslaan' }}
        </button>
      </div>
    </div>
  </div>

  <!-- Display Mode -->
  <div v-else class="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700 transition-all duration-200 group cursor-pointer"
    :class="{ 'opacity-60 bg-slate-50 dark:bg-slate-800/50': item.checked }"
    @click="emit('edit', item.id)"
  >
    <div class="flex items-center gap-4 p-4">
      <!-- Checkbox -->
      <div class="flex-shrink-0" @click.stop>
        <label class="relative flex items-center justify-center w-7 h-7 cursor-pointer">
          <input
            type="checkbox"
            :checked="item.checked"
            @change="(e) => { const target = e.target as HTMLInputElement | null; if (target) emit('check', { ...item, checked: target.checked }); }"
            class="peer sr-only"
          />
          <div class="w-7 h-7 border-2 rounded-lg transition-all duration-200 peer-checked:bg-green-500 peer-checked:border-green-500 border-slate-300 dark:border-slate-600 hover:border-green-400 flex items-center justify-center">
            <svg v-if="item.checked" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
        </label>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-3">
          <!-- Left: Name and details -->
          <div class="flex-1 min-w-0">
            <h3
              class="text-base font-semibold transition-colors truncate"
              :class="item.checked
                ? 'line-through text-slate-400 dark:text-slate-500'
                : 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'"
            >
              {{ item.name }}
            </h3>
            <div class="flex items-center gap-3 mt-1 text-sm">
              <!-- Quantity badge -->
              <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-600 dark:text-slate-400">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>
                </svg>
                {{ item.quantity || 1 }}x
              </span>
              <!-- Unit price -->
              <span v-if="item.unit_price" class="text-slate-500 dark:text-slate-400">
                €{{ item.unit_price?.toFixed(2) }} / {{ i18n.t('items.piece') || 'stuk' }}
              </span>
            </div>
          </div>

          <!-- Right: Total Price -->
          <div class="flex-shrink-0 text-right">
            <div
              class="text-lg font-bold"
              :class="item.checked ? 'text-slate-400 dark:text-slate-500' : 'text-green-600 dark:text-green-400'"
            >
              €{{ ((item.unit_price || 0) * (item.quantity || 1)).toFixed(2) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Indicator -->
      <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
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
