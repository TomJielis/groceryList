<script setup lang="ts">
import {ref} from "vue";
import { useCards } from "~/composables/useCards";
import {useRouter} from "vue-router";
import { useI18nStore } from '~/stores/i18n';
import {useNotification} from "~/composables/useNotification";
import formInput from "~/components/form/formInput.vue"
import backButton from "~/components/form/backButton.vue"

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
  <div class="max-w-2xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6 text-center">🃏 {{ i18n.t('cards.upload') }}</h1>

    <div class="rounded-xl shadow-sm p-4">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <formInput
              v-model="formData.title"
              :label="i18n.t('cards.title')"
              :placeholder="i18n.t('cards.title')"
          />
        </div>
        <div>
          <label  class="block text-sm font-medium text-slate-700 dark:text-slate-100 mb-1">{{ i18n.t('cards.attachment') }}</label>
          <input
              @change="handleFileChange"
              type="file"
              id="attachment"
              required
              class="w-full mb-3 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2  border-border-light dark:border-border-dark focus:ring-blue-400 focus:border-blue-400 text-base placeholder-slate-400 dark:placeholder-slate-500 bg-white/80 dark:bg-slate-900/80"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 py-3 rounded-xl hover:bg-blue-600 active:scale-95 transition transform focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 font-semibold"
        >
          📤 {{ i18n.t('cards.upload') }}
        </button>
      </form>
    </div>

    <backButton
        :label="i18n.t('common.back')"
        @click="router.push('/cards/')"
        @close="router.push('/cards/')"
    />
  </div>
</template>