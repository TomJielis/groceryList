<script setup lang="ts">
import {ref} from "vue";
import { useCards } from "~/composables/useCards";
import {useRouter} from "vue-router";
import { useI18nStore } from '~/stores/i18n';
import {useNotification} from "~/composables/useNotification";

definePageMeta({
  middleware: 'auth',
});
const {showNotification} = useNotification();
const i18n = useI18nStore();

const formData = ref({
  title: "",
  attachment: null as File | null,
});

const { storeCard , getCards} = useCards();
const router = useRouter();

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    formData.value.attachment = target.files[0];
  }
}

function handleSubmit() {
  if (!formData.value.attachment) return;

  const reader = new FileReader();
  reader.onload = async () => {
    const base64 = reader.result as string;

    storeCard({
      title: formData.value.title,
      attachment: base64,
    }).then(() => {
      formData.value = {
        title: "",
        attachment: null,
      };

      getCards();
      router.push('/cards/');
    }).catch(() => {
      showNotification(i18n.t('errors.cardStoreFailed'));
    });


  };
  reader.readAsDataURL(formData.value.attachment);
}
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center w-full max-w-full px-1 sm:px-4">
    <h1 class="text-2xl font-bold mb-6 text-primary-dark dark:text-accent-light">🎫 {{ i18n.t('cards.upload') }}</h1>
    <form @submit.prevent="handleSubmit" class="w-full max-w-xl bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-5 flex flex-col border border-border-light dark:border-border-dark">
      <div class="space-y-4">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">{{ i18n.t('cards.title') }}</label>
          <input
              v-model="formData.title"
              type="text"
              id="title"
              required
              class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base"
          />
        </div>
        <div>
          <label for="attachment" class="block text-sm font-medium text-gray-700 mb-1">{{ i18n.t('cards.attachment') }}</label>
          <input
              @change="handleFileChange"
              type="file"
              id="attachment"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 active:scale-95 transition transform focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 font-semibold"
        >
          📤 {{ i18n.t('cards.upload') }}
        </button>
      </div>
    </form>
  </div>
</template>