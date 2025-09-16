<script setup lang="ts">
import { ref, watch } from 'vue';

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

const localItem = ref({ ...props.item });

watch(() => props.item, (newVal) => {
  localItem.value = { ...newVal };
});
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm p-3 transition relative overflow-hidden">
    <!-- Edit modus -->
    <div v-if="isEditing" class="flex flex-col space-y-2">
      <input
          v-model="localItem.name"
          type="text"
          class="border rounded px-2 py-1 w-full"
      />
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <button
              class="w-8 h-8 bg-gray-200 rounded-full font-bold hover:bg-gray-300"
              @click="localItem.quantity = Math.max((localItem.quantity || 1) - 1, 1)"
          >−</button>
          <span class="text-sm font-semibold">{{ localItem.quantity || 1 }}</span>
          <button
              class="w-8 h-8 bg-gray-200 rounded-full font-bold hover:bg-gray-300"
              @click="localItem.quantity = (localItem.quantity || 1) + 1"
          >+</button>
        </div>
        <input
            v-model.number="localItem.unit_price"
            type="number"
            step="0.01"
            placeholder="€ prijs"
            class="border rounded px-2 py-1 w-24 text-right"
        />
      </div>
      <button
          @click="emit('save', localItem)"
          class="self-end bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
      >
        Klaar
      </button>
    </div>

    <!-- Weergavemodus -->
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
          <span class="text-sm font-semibold">{{ item.quantity || 1 }}</span>
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
