<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18nStore } from '~/stores/i18n';
import { useAuthStore } from '~/stores/auth';
import { useListStore } from '~/stores/lists';
import { useNotification } from '~/composables/useNotification';
import { rememberInvite, forgetInvite } from '~/utils/pendingInvite';
import Button from 'primevue/button'
import Card from 'primevue/card'
import ProgressSpinner from 'primevue/progressspinner'

// Where an invite link (https://<site>/auth/invite/<code>) lands when the app isn't installed: with the app, iOS opens
// the link in the app instead (apple-app-site-association claims /auth/*). Logged in, opening a list's link asks once
// ("Meedoen") and opens the list (already in it: just opens it). Logged out, it says what it invites to and how to
// join; after logging in (or registering and verifying first) you come back here and are asked. Or it says the link
// expired.
type Preview =
  | { status: 'valid'; type: 'list' | 'cookbook'; id: number; name: string; invited_by: string | null; already_member?: boolean | null }
  | { status: 'expired' | 'not_found' | 'error' }

const config = useRuntimeConfig().public
const i18n = useI18nStore();
const auth = useAuthStore();
const listStore = useListStore();
const { showSuccess } = useNotification();
const route = useRoute();
const router = useRouter();
const token = route.params.token as string;

const { data, pending } = await useFetch<{ data: Preview }>(`/api/inviteLink/${encodeURIComponent(token)}`);
const preview = ref<Preview | null>(data.value?.data ?? null);

// Logged in (the login cookie, known while rendering on the server too): a list's link shows "adding you" from the
// start instead of the logged-out explanation
const loggedInHint = useState(`invite-logged-in-${token}`, () => import.meta.server ? Boolean(useCookie('token').value) : false);
const joining = ref(loggedInHint.value && preview.value?.status === 'valid' && preview.value.type === 'list');
const joinFailed = ref(false);
// Logged in and not in it yet: "Meedoen" or "Nee, bedankt"
const asking = ref(false);

function needsTerms(user: any): boolean {
  if (!user) return false;
  return !user.accepted_terms || (user.accepted_terms_version || '1.0') !== config.termsVersion;
}

// Asked again here, with the login: says whether you're already in it (then it just opens), and whether it still works
async function check() {
  joining.value = true;
  joinFailed.value = false;
  try {
    const fresh = (await $fetch<{ data: Preview }>(`/api/inviteLink/${encodeURIComponent(token)}`)).data;
    preview.value = fresh;
    if (fresh.status !== 'valid' || fresh.type !== 'list') {
      forgetInvite();
      joining.value = false;
      return;
    }
    if (fresh.already_member) {
      await openList(fresh.id);
      return;
    }
    asking.value = true;
    joining.value = false;
  } catch {
    joinFailed.value = true;
    joining.value = false;
  }
}

async function openList(id: number) {
  forgetInvite();
  await listStore.fetchLists();
  await router.replace(`/list/${id}`);
}

// "Meedoen"
async function join() {
  joining.value = true;
  joinFailed.value = false;
  try {
    const joined = (await $fetch<{ data: { id: number; name: string; already_member: boolean } }>(
      `/api/inviteLink/${encodeURIComponent(token)}/accept`, { method: 'POST' })).data;
    if (!joined.already_member) showSuccess(i18n.t('inviteLink.joinedName').replace('{name}', joined.name), 3000);
    asking.value = false;
    await openList(joined.id);
  } catch (error: any) {
    // Expired or withdrawn in the meantime (410), or gone (404): the page says so
    asking.value = false;
    if (error?.statusCode === 410 || error?.status === 410) {
      forgetInvite();
      preview.value = { status: 'expired' };
    } else if (error?.statusCode === 404 || error?.status === 404) {
      forgetInvite();
      preview.value = { status: 'not_found' };
    } else {
      joinFailed.value = true;
    }
    joining.value = false;
  }
}

// "Nee, bedankt"
function decline() {
  forgetInvite();
  router.replace('/');
}

onMounted(() => {
  const p = preview.value;
  if (!p || p.status !== 'valid' || p.type !== 'list') {
    joining.value = false;
    if (p && (p.status === 'expired' || p.status === 'not_found')) forgetInvite();
    return;
  }
  // Remembered so that logging in, registering or approving the terms first comes back here
  rememberInvite(token);
  if (!auth.token) {
    joining.value = false;
    return;
  }
  if (needsTerms(auth.user)) {
    router.replace('/terms/approve');
    return;
  }
  check();
});

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

// The preview block WhatsApp, iMessage and the like show for the link: who invites you to what, with the app icon
if (preview.value?.status === 'valid') {
  useSeoMeta({
    title: preview.value.name,
    ogTitle: preview.value.name,
    ogDescription: `${invitation.value} · ${config.appName}`,
    ogImage: 'https://tomjielis.com/icons/app-icon-3.png',
    ogUrl: useRequestURL().href,
    twitterCard: 'summary',
    twitterTitle: preview.value.name,
    twitterDescription: `${invitation.value} · ${config.appName}`,
    twitterImage: 'https://tomjielis.com/icons/app-icon-3.png',
  });
}

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

          <template v-else-if="joining">
            <ProgressSpinner style="width:28px;height:28px" strokeWidth="3" />
            <p class="text-sm leading-relaxed">{{ i18n.t('inviteLink.joining') }}</p>
          </template>

          <template v-else-if="joinFailed">
            <p class="text-sm leading-relaxed">{{ i18n.t('inviteLink.joinFailed') }}</p>
            <Button :label="i18n.t('inviteLink.retry')" class="w-full" @click="asking ? join() : check()" />
          </template>

          <template v-else-if="asking">
            <Button :label="i18n.t('inviteLink.accept')" class="w-full" data-testid="invite-join" @click="join" />
            <Button :label="i18n.t('inviteLink.decline')" severity="secondary" outlined class="w-full"
              data-testid="invite-decline" @click="decline" />
          </template>

          <template v-else-if="preview?.status === 'valid' && preview.type === 'list'">
            <p class="text-sm leading-relaxed">{{ i18n.t('inviteLink.logInFirst') }}</p>
            <NuxtLink to="/auth/login" class="block">
              <Button :label="i18n.t('inviteLink.logIn')" class="w-full" />
            </NuxtLink>
            <NuxtLink to="/auth/register" class="block text-center text-sm underline">
              {{ i18n.t('inviteLink.createAccount') }}
            </NuxtLink>
            <a v-if="config.appStoreUrl" :href="config.appStoreUrl" class="block">
              <Button :label="i18n.t('inviteLink.download')" icon="pi pi-apple" severity="secondary" outlined class="w-full" />
            </a>
          </template>

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
