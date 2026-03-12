<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18nStore } from '~/stores/i18n';
import { useGroceryList } from '~/composables/useGroceryList';

const props = defineProps<{
  item: any,
  isEditing: boolean,
  tableMode?: boolean,
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
  <div v-if="isEditing" class="list-item-row rounded p-4 animate-in">
    <div class="space-y-4">
      <!-- Product Name -->
      <div>
        <label class="block text-[0.65rem] font-medium uppercase tracking-[0.14em] mb-1.5 text-surface-400">Product</label>
        <input
          v-model="localItem.name"
          type="text"
          class="w-full px-0 py-2 bg-transparent border-b border-surface-200 focus:border-surface-400 outline-none transition text-base font-medium placeholder:text-surface-300"
          placeholder="Product naam"
        />
      </div>

      <!-- Quantity and Price Row -->
      <div class="grid grid-cols-2 gap-3">
        <!-- Quantity -->
        <div>
          <label class="block text-[0.65rem] font-medium uppercase tracking-[0.14em] mb-1.5 text-surface-400">Aantal</label>
          <div class="flex items-center gap-2 border-b border-surface-200 pb-1">
            <button
              @click="localItem.quantity = Math.max((localItem.quantity || 1) - 1, 0)"
              class="w-7 h-7 rounded font-medium active:scale-95 transition-all text-sm"
            >−</button>
            <span class="flex-1 text-center text-base font-medium">{{ localItem.quantity || 0 }}</span>
            <button
              @click="localItem.quantity = (localItem.quantity || 0) + 1"
              class="w-7 h-7 rounded font-medium active:scale-95 transition-all text-sm"
            >+</button>
          </div>
        </div>

        <!-- Price -->
        <div>
          <label class="block text-[0.65rem] font-medium uppercase tracking-[0.14em] mb-1.5 text-surface-400">Prijs per stuk</label>
          <div class="relative border-b border-surface-200 focus-within:border-surface-400 transition">
            <span class="absolute left-0 top-1/2 -translate-y-1/2 text-sm text-surface-400">€</span>
            <input
              v-model.number="localItem.unit_price"
              @input="handleUnitPriceInput"
              type="text"
              class="w-full pl-5 pr-0 py-2 bg-transparent outline-none transition text-base font-medium placeholder:text-surface-300"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <!-- Total Price Preview -->
      <div v-if="localItem.unit_price && localItem.quantity" class="flex items-center justify-between px-3 py-2 rounded">
        <span class="text-sm font-medium text-surface-500">Totaal</span>
        <span class="text-base font-medium">
          €{{ ((localItem.unit_price || 0) * (localItem.quantity || 1)).toFixed(2) }}
        </span>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2 pt-2">
        <button
          @click="emit('edit', 0)"
          class="flex-1 px-4 py-2.5 border border-surface-200 hover:border-surface-400 font-medium rounded transition active:scale-95 text-sm"
        >
          Annuleren
        </button>
        <button
          @click="handleSave"
          class="flex-1 px-4 py-2.5 font-medium rounded transition active:scale-95 text-sm"
          :class="localItem.quantity === 0
            ? 'bg-red-100 border border-red-300 text-red-600 hover:bg-red-200'
            : 'bg-primary text-white hover:bg-primary-emphasis'"
        >
          {{ localItem.quantity === 0 ? i18n.t('common.delete') : i18n.t('common.save') }}
        </button>
      </div>
    </div>
  </div>

  <!-- Display Mode - Table Row -->
  <div v-else-if="tableMode"
    class="list-item-row grid grid-cols-12 gap-4 px-6 py-3 items-center cursor-pointer mb-1"
    :class="{ 'opacity-40': item.checked }"
    @click="emit('edit', item.id)"
  >
    <!-- Checkbox + Name -->
    <div class="col-span-5 flex items-center gap-3 min-w-0">
      <label class="relative flex items-center justify-center w-5 h-5 cursor-pointer flex-shrink-0" @click.stop>
        <input
          type="checkbox"
          :checked="item.checked"
          @change="(e) => { const target = e.target as HTMLInputElement | null; if (target) emit('check', { ...item, checked: target.checked }); }"
          class="peer sr-only"
        />
        <div class="w-5 h-5 border-2 rounded transition-all duration-200 peer-checked:bg-primary peer-checked:border-primary border-surface-300 flex items-center justify-center">
          <svg v-if="item.checked" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
      </label>
      <span
        class="font-medium truncate"
        :class="item.checked ? 'line-through text-surface-400' : ''"
      >
        {{ item.name }}
      </span>
    </div>

    <!-- Quantity -->
    <div class="col-span-2 text-center">
      <span class="inline-flex items-center justify-center px-2 py-0.5 rounded text-sm font-medium">
        {{ item.quantity || 1 }}x
      </span>
    </div>

    <!-- Unit Price -->
    <div class="col-span-2 text-center text-sm text-surface-500">
      €{{ item.unit_price?.toFixed(2) || '0.00' }}
    </div>

    <!-- Total -->
    <div class="col-span-2 text-center">
      <span class="font-medium">
        €{{ ((item.unit_price || 0) * (item.quantity || 1)).toFixed(2) }}
      </span>
    </div>

    <!-- Action -->
    <div class="col-span-1 flex justify-end">
      <svg class="w-4 h-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    </div>
  </div>

  <!-- Display Mode - Mobile Row -->
  <div v-else
    class="list-item-row border-b border-surface-100 py-4 cursor-pointer mb-1"
    :class="{ 'opacity-50': item.checked }"
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
          <div class="w-6 h-6 border-2 rounded transition-all duration-200 peer-checked:bg-primary peer-checked:border-primary border-surface-300 flex items-center justify-center">
            <svg v-if="item.checked" class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              class="text-base font-medium transition-colors break-words"
              :class="item.checked ? 'line-through text-surface-400' : ''"
            >
              {{ item.name }}
            </h3>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-sm text-surface-500">
                {{ item.quantity || 1 }}x
              </span>
              <span>·</span>
              <span class="text-sm text-surface-500">
                €{{ item.unit_price?.toFixed(2) || '0.00' }}
              </span>
            </div>
          </div>

          <!-- Right: Total Price -->
          <div class="flex-shrink-0 text-right">
            <div class="text-base font-medium">
              €{{ ((item.unit_price || 0) * (item.quantity || 1)).toFixed(2) }}
            </div>
            <div class="text-xs text-surface-400 mt-0.5">
              {{ i18n.t('items.total') }}
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Indicator -->
      <div class="flex-shrink-0">
        <svg class="w-4 h-4 text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    transform: translateY(-8px);
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
