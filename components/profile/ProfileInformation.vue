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
  <div>
    <!-- Edit Mode -->
    <form v-if="isEditing" @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Name Input -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          {{ i18n.t('profile.form.name') || 'Naam' }}
        </label>
        <input
          v-model="userData.name"
          type="text"
          :placeholder="i18n.t('profile.name') || 'Je naam'"
          required
          class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base font-medium placeholder:text-slate-400"
        />
      </div>

      <!-- Email Input (Disabled) -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          {{ i18n.t('profile.form.email') || 'Email' }}
        </label>
        <input
          v-model="userData.email"
          type="email"
          :placeholder="i18n.t('profile.email') || 'je@email.nl'"
          disabled
          class="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-base font-medium text-slate-500 dark:text-slate-400 cursor-not-allowed"
        />
        <p class="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          <span>{{ i18n.t('profile.emailLocked') || 'Email kan niet worden gewijzigd' }}</span>
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 pt-2">
        <button
          type="button"
          @click="toggleEdit"
          class="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-colors active:scale-95"
        >
          {{ i18n.t('common.cancel') }}
        </button>
        <button
          type="submit"
          class="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all active:scale-95"
        >
          {{ i18n.t('profile.saveChanges') }}
        </button>
      </div>
    </form>

    <!-- Display Mode -->
    <div v-else class="space-y-4">
      <!-- Name Display -->
      <div class="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">{{ i18n.t('auth.name') || 'Naam' }}</p>
            <p class="text-base font-bold text-slate-900 dark:text-white truncate">{{ userData.name }}</p>
          </div>
        </div>
      </div>

      <!-- Email Display -->
      <div class="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">{{ i18n.t('auth.email') || 'Email' }}</p>
            <p class="text-base font-bold text-slate-900 dark:text-white truncate">{{ userData.email }}</p>
          </div>
        </div>
      </div>

      <!-- Edit Button -->
      <button
        @click="toggleEdit"
        class="w-full py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-colors active:scale-95 flex items-center justify-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
        </svg>
        <span>{{ i18n.t('profile.edit') || 'Bewerken' }}</span>
      </button>
    </div>
  </div>
</template>
