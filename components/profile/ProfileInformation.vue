<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18nStore } from '~/stores/i18n';
import Button from 'primevue/button';
import Card from 'primevue/card';

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
    <form v-if="isEditing" @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Name Input -->
      <div>
        <label class="block text-[0.65rem] uppercase tracking-[0.14em] font-medium mb-2">
          {{ i18n.t('profile.form.name') }}
        </label>
        <input
          v-model="userData.name"
          type="text"
          :placeholder="i18n.t('profile.namePlaceholder')"
          required
          class="w-full pb-2 border-b bg-transparent outline-none text-base transition-colors"
        />
      </div>

      <!-- Email Input (Disabled) -->
      <div>
        <label class="block text-[0.65rem] uppercase tracking-[0.14em] font-medium mb-2">
          {{ i18n.t('profile.form.email') }}
        </label>
        <input
          v-model="userData.email"
          type="email"
          :placeholder="i18n.t('profile.emailPlaceholder')"
          disabled
          class="w-full pb-2 border-b bg-transparent outline-none text-base cursor-not-allowed"
        />
        <p class="mt-2 text-xs flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          <span>{{ i18n.t('profile.emailLocked') }}</span>
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 pt-2">
        <Button
          type="button"
          severity="secondary"
          class="flex-1"
          @click="toggleEdit"
          :label="i18n.t('common.cancel')"
        />
        <Button
          type="submit"
          severity="primary"
          class="flex-1"
          :label="i18n.t('profile.saveChanges')"
        />
      </div>
    </form>

    <!-- Display Mode -->
    <Card v-else>
      <template #content>
        <div class="space-y-4">
          <!-- Name Display -->
          <div class="py-3 border-b last:border-0">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[0.65rem] uppercase tracking-[0.14em] font-medium">{{ i18n.t('auth.name') }}</p>
                <p class="text-base font-medium truncate">{{ userData.name }}</p>
              </div>
            </div>
          </div>

          <!-- Email Display -->
          <div class="py-3 border-b last:border-0">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[0.65rem] uppercase tracking-[0.14em] font-medium">{{ i18n.t('auth.email') }}</p>
                <p class="text-base font-medium truncate">{{ userData.email }}</p>
              </div>
            </div>
          </div>

          <!-- Edit Button -->
          <Button
            severity="secondary"
            class="w-full"
            @click="toggleEdit"
          >
            <template #default>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              <span>{{ i18n.t('profile.edit') }}</span>
            </template>
          </Button>
        </div>
      </template>
    </Card>
  </div>
</template>
