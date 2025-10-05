<script setup lang="ts">
import {ref, watch} from 'vue';
import {useI18nStore} from '~/stores/i18n';

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

const localItem = ref({...props.item});

watch(() => props.item, (newVal) => {
  localItem.value = {...newVal};
});
const units = ['g', 'kg', 'L', 'ml'];
</script>
<template>
  <div class="bg-white rounded-xl shadow-sm p-3 transition relative overflow-hidden">
    <div v-if="isEditing" class="flex flex-col space-y-3">
      <input
          v-model="localItem.name"
          type="text"
          placeholder="Naam"
          class="border rounded px-2 py-1 w-full"
      />

      <div class="grid grid-cols-2 gap-1">
        <div class="flex flex-col space-y-1">
          <label class="text-sm text-gray-600">{{ i18n.t('grocery.quantity') }}</label>
          <input
              v-model.number="localItem.quantity"
              type="number"
              min="0"
              step="1"
              :placeholder="i18n.t('grocery.quantity_placeholder')"
              class="border rounded px-2 py-1 text-right"
          />
        </div>

        <div class="flex flex-col space-y-1">
          <label class="text-sm text-gray-600">{{ i18n.t('grocery.price') }}</label>
          <input
              v-model.number="localItem.unit_price"
              type="number"
              step="0.01"
              :placeholder="i18n.t('grocery.price_placeholder')"
              class="border rounded px-2 py-1 text-right"
          />
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-2 pt-1">
        <template v-for="unit in units" :key="unit">
          <button
              class="px-3 py-1 text-sm border rounded-full"
              :class="{
              'bg-blue-500 text-white': localItem.unit === unit,
              'bg-gray-100 text-gray-700 hover:bg-gray-200': localItem.unit !== unit
            }"
              @click="localItem.unit = localItem.unit === unit ? null : unit"
          >
            {{ unit }}
          </button>
        </template>
      </div>
      <button
          @click="emit('save', localItem)"
          class="self-end bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 mt-2"
      >
        {{ i18n.t('common.save') }}
      </button>
    </div>
    <div v-else class="flex items-center justify-between">
      <input
          type="checkbox"
          class="h-6 w-6 text-green-600 rounded flex-shrink-0 mr-2"
          :checked="item.checked"
          @click.stop
          @change="emit('check', { ...item, checked: $event.target.checked })"
      />
      <div
          class="flex flex-1 items-center justify-between cursor-pointer"
          @click="emit('edit', item.id)"
      >
        <span
            class="text-base font-medium break-words whitespace-normal"
            :class="{ 'line-through text-gray-500': item.checked }"
        >
          {{ item.name }}
        </span>
        <div class="flex items-center space-x-2 ml-4">
          <span class="text-sm font-semibold">
            {{ item.quantity || 1 }}<span v-if="item.unit"> {{ item.unit }}</span>
          </span>
          <span class="text-sm text-gray-500">
            × €{{ item.unit_price?.toFixed(2) || '0.00' }}
          </span>
          <span class="text-sm font-bold text-black ml-2">
            = €{{ ((item.unit_price || 0) * (item.quantity || 1)).toFixed(2) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
