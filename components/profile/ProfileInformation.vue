<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18nStore } from '~/stores/i18n';

const props = defineProps<{
  user: {
    name: string;
    email: string;
  } | null;
}>();

const emit = defineEmits<{
  (e: 'update', userData: { name: string; email: string }): void;
}>();

const i18n = useI18nStore();
const isEditing = ref(false);
const userData = ref({
  name: props.user?.name || '',
  email: props.user?.email || '',
});

watch(() => props.user, (newUser) => {
  if (newUser) {
    userData.value = {
      name: newUser.name,
      email: newUser.email,
    };
  }
}, { deep: true });

function toggleEdit() {
  if (isEditing.value) {
    userData.value = {
      name: props.user?.name || '',
      email: props.user?.email || '',
    };
  }
  isEditing.value = !isEditing.value;
}

function handleSubmit() {
  emit('update', userData.value);
  isEditing.value = false;
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold">{{ i18n.t('profile.information') }}</h2>
      <button
        @click="toggleEdit"
        class="text-blue-500 hover:text-blue-700"
      >
        {{ isEditing ? i18n.t('common.cancel') : i18n.t('profile.edit') }}
      </button>
    </div>

    <div v-if="!isEditing" class="space-y-3">
      <div>
        <label class="block text-sm font-medium text-gray-700">{{ i18n.t('auth.name') }}</label>
        <p class="text-gray-900">{{ user?.name }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">{{ i18n.t('auth.email') }}</label>
        <p class="text-gray-900">{{ user?.email }}</p>
      </div>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">{{ i18n.t('auth.name') }}</label>
        <input
          id="name"
          v-model="userData.name"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          required
        />
      </div>
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">{{ i18n.t('auth.email') }}</label>
        <input
          id="email"
          v-model="userData.email"
          type="email"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          required
        />
      </div>
      <button
        type="submit"
        class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
      >
        {{ i18n.t('profile.saveChanges') }}
      </button>
    </form>
  </div>
</template>
