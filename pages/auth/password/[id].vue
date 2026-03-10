<script setup lang="ts">
import {ref} from "vue";
import { useAuth} from "~/composables/useAuth";
import { useRoute } from 'vue-router';
import {useNotification} from "~/composables/useNotification";
import { useI18nStore } from '~/stores/i18n';

import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

const i18n = useI18nStore();
const {showNotification} = useNotification();
const route = useRoute();
const passwordUpdated = ref(false);

const { setNewPassword } = useAuth();
const userData = ref({
  email: '',
  password: '',
  repeatPassword: '',
  token: route.params.id as string
});

function triggerNewPassword()
{
  setNewPassword(userData.value)
      .then(() => {
        passwordUpdated.value = true;
      })
      .catch(() => {
        showNotification(i18n.t('errors.unexpectedError'));
      });
}
</script>

<template>
  <div class="auth-shell px-4 py-6 flex items-start justify-center">
    <div class="auth-grid w-full max-w-5xl mx-auto grid gap-6 items-center">
      <Card class="auth-card border border-white/10 shadow-2xl">
        <template #content>
          <div class="text-center text-white space-y-2 mb-6">
            <div class="text-4xl">🔐</div>
            <h2 class="text-2xl font-semibold">
              {{ i18n.t('auth.newPasswordTitle') }}
            </h2>
            <p class="text-sm text-slate-300">
              {{ i18n.t('auth.newPasswordSubtitle') }}
            </p>
          </div>

          <div v-if="!passwordUpdated">
            <form @submit.prevent="triggerNewPassword" class="space-y-4">
              <input type="hidden" v-model="userData.token" />

              <div>
                <label class="block mb-2 text-sm text-slate-200">
                  {{ i18n.t('auth.email') }}
                </label>
                <InputText
                  v-model="userData.email"
                  type="email"
                  :placeholder="i18n.t('auth.emailPlaceholder')"
                  class="w-full auth-input"
                />
              </div>

              <div>
                <label class="block mb-2 text-sm text-slate-200">
                  {{ i18n.t('auth.newPassword') }}
                </label>
                <Password
                  v-model="userData.password"
                  :placeholder="i18n.t('auth.passwordPlaceholder')"
                  toggleMask
                  :feedback="false"
                  inputClass="w-full"
                  class="w-full auth-input"
                />
              </div>

              <div>
                <label class="block mb-2 text-sm text-slate-200">
                  {{ i18n.t('auth.repeatPassword') }}
                </label>
                <Password
                  v-model="userData.repeatPassword"
                  :placeholder="i18n.t('auth.repeatPasswordPlaceholder')"
                  toggleMask
                  :feedback="false"
                  inputClass="w-full"
                  class="w-full auth-input"
                />
              </div>

              <Button
                type="submit"
                icon="pi pi-check"
                :label="i18n.t('auth.resetPasswordBtn')"
                class="w-full auth-btn"
              />
            </form>
          </div>

          <div v-else class="text-center py-6 text-white">
            <div class="text-4xl mb-4">
              ✅
            </div>
            <h3 class="text-xl font-semibold mb-2">
              {{ i18n.t('auth.passwordUpdatedTitle') }}
            </h3>
            <p class="text-sm text-slate-200 mb-8">
              {{ i18n.t('auth.passwordUpdatedBody') }}
            </p>
            <div class="pt-4 border-t border-white/10">
              <NuxtLink to="/auth/login">
                <Button
                  severity="secondary"
                  outlined
                  class="auth-btn alt"
                  :label="i18n.t('auth.goToLogin')"
                />
              </NuxtLink>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.auth-shell {
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  background: transparent;
}

:deep(.auth-card .p-card-body) {
  background: rgba(15, 23, 42, 0.85);
  border-radius: 1.75rem;
  padding: 2rem;
  color: #f8fafc;
}

:deep(.auth-card .p-card-content) {
  padding: 0;
}

:deep(.auth-input.p-inputtext),
:deep(.auth-input .p-password-input) {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #f8fafc;
  border-radius: 1rem;
  padding: 0.85rem 1rem;
}

:deep(.auth-input.p-inputtext::placeholder),
:deep(.auth-input .p-password-input::placeholder) {
  color: #cbd5f5;
}

.auth-btn :deep(.p-button) {
  border-radius: 999px;
  background: linear-gradient(90deg, #fbbf24, #f97316);
  color: #0f172a;
  border: none;
  font-weight: 600;
  width: 100%;
}

.auth-btn.alt :deep(.p-button) {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #f8fafc;
}
</style>
