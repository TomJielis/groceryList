<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18nStore } from '~/stores/i18n';

const props = defineProps<{
  item: any,
  isEditing: boolean,
}>();

const emit = defineEmits<{
  (e: 'update:item', item: any): void;
  (e: 'edit', id: number): void;
  (e: 'check', item: any): void;
  (e: 'save', item: any): void;
}>();

const i18n = useI18nStore();

const localItem = ref({ ...props.item });

watch(() => props.item, (newVal) => {
  localItem.value = { ...newVal };
});
</script>

<template>
  <div class="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-4 md:p-5 border border-border-light dark:border-border-dark transition relative overflow-hidden hover:shadow-2xl hover:border-accent/60">
    <!-- Edit modus -->
    <div v-if="isEditing" class="flex flex-col space-y-3">
      <input
          v-model="localItem.name"
          type="text"
          class="border border-border-light dark:border-border-dark rounded-xl px-3 py-2 w-full bg-white/80 dark:bg-slate-900/80 shadow focus:ring-2 focus:ring-accent focus:border-accent text-base transition-colors placeholder-slate-400 dark:placeholder-slate-500"
      />
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <button
              class="w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-full font-bold hover:bg-accent/20 text-slate-700 dark:text-slate-100 border border-border-light dark:border-border-dark transition flex items-center justify-center text-xl"
              @click="localItem.quantity = Math.max((localItem.quantity || 1) - 1, 1)"
          >−</button>
          <span class="text-base font-semibold">{{ localItem.quantity || 1 }}</span>
          <button
              class="w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-full font-bold hover:bg-accent/20 text-slate-700 dark:text-slate-100 border border-border-light dark:border-border-dark transition flex items-center justify-center text-xl"
              @click="localItem.quantity = (localItem.quantity || 1) + 1"
          >+</button>
        </div>
        <input
            v-model.number="localItem.unit_price"
            type="number"
            step="0.01"
            :placeholder="i18n.t('items.pricePlaceholder')"
            class="border border-border-light dark:border-border-dark rounded-xl px-3 py-2 w-24 text-right bg-white/80 dark:bg-slate-900/80 shadow focus:ring-2 focus:ring-accent focus:border-accent text-base transition-colors placeholder-slate-400 dark:placeholder-slate-500"
        />
      </div>
      <button
          @click="emit('save', localItem)"
          class="self-end bg-accent text-white px-6 py-2 rounded-xl hover:bg-accent-dark shadow-md font-semibold transition border border-accent/80 focus:ring-2 focus:ring-accent"
      >
        {{ i18n.t('common.save') }}
      </button>
    </div>

    <div v-else class="flex items-center justify-between">
      <input
          type="checkbox"
          class="h-6 w-6 text-success rounded border border-border-light dark:border-border-dark focus:ring-2 focus:ring-success/60 transition flex-shrink-0 mr-3"
          :checked="item.checked"
          @click.stop
          @change="emit('check', { ...item, checked: $event.target.checked })"
      />
      <div
          class="flex flex-1 items-center justify-between cursor-pointer"
          @click="emit('edit', item.id)"
      >
        <span
            class="text-base font-medium break-words whitespace-normal transition-colors"
            :class="{ 'line-through text-slate-400 dark:text-slate-500': item.checked, 'text-slate-800 dark:text-slate-100': !item.checked }"
        >
          {{ item.name }}
        </span>
        <div class="flex items-center space-x-3 ml-4">
          <span class="text-base font-semibold text-slate-800 dark:text-slate-100">{{ item.quantity || 1 }}</span>
          <span class="text-sm text-slate-500 dark:text-slate-400">
            × €{{ item.unit_price?.toFixed(2) || '0.00' }}
          </span>
          <span class="text-base font-bold text-accent ml-2">
            = €{{ ((item.unit_price || 0) * (item.quantity || 1)).toFixed(2) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
