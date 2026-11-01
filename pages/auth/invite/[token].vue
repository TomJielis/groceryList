<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useI18nStore } from '~/stores/i18n';
import Button from 'primevue/button'
import Card from 'primevue/card'
import ProgressSpinner from 'primevue/progressspinner'

// Where an invite link (https://<site>/auth/invite/<code>) lands when the app isn't installed: with the app, iOS opens
// the link in the app instead (apple-app-site-association claims /auth/*). Says what it invites to and how to join,
// or that the link expired.
type Preview =
  | { status: 'valid'; type: 'list' | 'cookbook'; name: string; invited_by: string | null }
  | { status: 'expired' | 'not_found' | 'error' }

const config = useRuntimeConfig().public
const i18n = useI18nStore();
const route = useRoute();
const token = route.params.token as string;

const { data, pending } = await useFetch<{ data: Preview }>(`/api/inviteLink/${encodeURIComponent(token)}`);
const preview = computed<Preview | null>(() => data.value?.data ?? null);

const title = computed(() => {
  if (!preview.value) return i18n.t('inviteLink.title');
  if (preview.value.status === 'valid') return preview.value.name;
  if (preview.value.status === 'expired') return i18n.t('inviteLink.expiredTitle');
  if (preview.value.status === 'not_found') return i18n.t('inviteLink.notFoundTitle');
  return i18n.t('inviteLink.title');
});

const invitation = computed(() => {
  const p = preview.value;
  if (!p || p.status !== 'valid') return '';
  return `${p.invited_by ?? '?'} ${i18n.t('inviteLink.invitesYou')} ${i18n.t(p.type === 'list' ? 'inviteLink.aList' : 'inviteLink.aCookbook')}`;
});

// Safari's Smart App Banner: "Open" (on this invite) when the app is installed, "View" (App Store) when it isn't;
// only Safari knows which, a page can't. Needs the App Store link (NUXT_PUBLIC_APP_STORE_URL, with the app's id).
const appStoreId = /id(\d+)/.exec(config.appStoreUrl || '')?.[1] ?? null;
const pageUrl = useRequestURL().href;
if (appStoreId) {
  useHead({ meta: [{ name: 'apple-itunes-app', content: `app-id=${appStoreId}, app-argument=${pageUrl}` }] });
}
</script>

<template>
  <div class="auth-page min-h-full flex items-center justify-center py-16 px-6">

    <Card class="w-full max-w-xs overflow-hidden shadow-lg" :pt="{ body: { class: 'p-0' }, content: { class: 'p-0' } }">
      <template #header>
        <div class="auth-card-header">
          <div class="flex items-center gap-2 mb-4">
            <span class="auth-logo-dot"></span>
            <span class="auth-brand">{{ config.appName }}</span>
          </div>
          <div class="auth-title">{{ title }}</div>
          <div v-if="invitation" class="auth-subtitle">{{ invitation }}</div>
        </div>
      </template>
      <template #content>
        <div class="p-8 flex flex-col gap-5">

          <div v-if="pending">
            <ProgressSpinner style="width:28px;height:28px" strokeWidth="3" />
          </div>

          <template v-else-if="preview?.status === 'valid'">
            <p class="text-sm leading-relaxed">{{ i18n.t('inviteLink.howToJoin') }}</p>
            <a v-if="config.appStoreUrl" :href="config.appStoreUrl" class="block">
              <Button :label="i18n.t('inviteLink.download')" icon="pi pi-apple" class="w-full" />
            </a>
            <NuxtLink to="/auth/register" class="block text-center text-sm underline">
              {{ i18n.t('inviteLink.createAccount') }}
            </NuxtLink>
          </template>

          <template v-else>
            <p class="text-sm leading-relaxed">
              {{ preview?.status === 'expired' ? i18n.t('inviteLink.expiredBody')
                : preview?.status === 'not_found' ? i18n.t('inviteLink.notFoundBody')
                : i18n.t('inviteLink.loadFailed') }}
            </p>
            <NuxtLink to="/" class="block">
              <Button :label="i18n.t('inviteLink.toSite')" class="w-full" />
            </NuxtLink>
          </template>

        </div>
      </template>
    </Card>

  </div>
</template>
