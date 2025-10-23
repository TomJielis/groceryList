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
  <div class="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-6 border border-border-light dark:border-border-dark transition flex flex-col gap-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-primary-dark dark:text-accent-light">{{ i18n.t('profile.info') }}</h2>
      <button
        @click="toggleEdit"
        class="px-4 py-2 rounded-xl bg-accent text-white font-semibold shadow hover:bg-accent-dark transition border border-accent/80 focus:ring-2 focus:ring-accent"
      >
        {{ isEditing ? i18n.t('common.cancel') : i18n.t('common.edit') }}
      </button>
    </div>
    <form v-if="isEditing" @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <input
        v-model="userData.name"
        type="text"
        :placeholder="i18n.t('profile.name')"
        class="w-full px-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-white/80 dark:bg-slate-900/80 shadow focus:ring-2 focus:ring-accent focus:border-accent text-base transition-colors placeholder-slate-400 dark:placeholder-slate-500"
      />
      <input
        v-model="userData.email"
        type="email"
        :placeholder="i18n.t('profile.email')"
        class="w-full px-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-white/80 dark:bg-slate-900/80 shadow focus:ring-2 focus:ring-accent focus:border-accent text-base transition-colors placeholder-slate-400 dark:placeholder-slate-500"
      />
      <button
        type="submit"
        class="w-full py-3 rounded-xl bg-accent text-white font-semibold shadow hover:bg-accent-dark transition border border-accent/80 focus:ring-2 focus:ring-accent"
      >
        {{ i18n.t('common.save') }}
      </button>
    </form>
    <div v-else class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <span class="font-semibold text-slate-700 dark:text-slate-100">{{ i18n.t('profile.name') }}:</span>
        <span class="text-slate-600 dark:text-slate-300">{{ userData.name }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="font-semibold text-slate-700 dark:text-slate-100">{{ i18n.t('profile.email') }}:</span>
        <span class="text-slate-600 dark:text-slate-300">{{ userData.email }}</span>
      </div>
    </div>
  </div>
</template>
