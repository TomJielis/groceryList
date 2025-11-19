<template>
  <div class="max-w-2xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6 text-primary-dark dark:text-accent-light text-center">📄 Kassabon uploaden</h1>

    <div class="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-5 border border-border-light dark:border-border-dark">
      <p class="mb-6 text-slate-600 dark:text-slate-400">
        Upload hier een foto van je kassabon. De prijzen van je producten worden dan automatisch bijgewerkt.
      </p>

      <form @submit.prevent="handleUpload" class="space-y-4">
        <div>
          <input
              type="file"
              accept="image/*"
              @change="onFileChange"
              class="block w-full text-slate-700 dark:text-slate-300 border border-accent/30 dark:border-accent/40 rounded-xl p-3 bg-white dark:bg-slate-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent/20 file:text-accent hover:file:bg-accent/30 transition"
          />
        </div>

        <button
            type="submit"
            :disabled="!selectedFile || loading"
            class="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl active:shadow-md"
        >
          {{ loading ? 'Uploaden...' : 'Upload kassabon' }}
        </button>
      </form>

      <div v-if="error" class="mt-4 p-4 bg-error/10 border border-error/30 rounded-xl text-error font-semibold">
        {{ error }}
      </div>
      <div v-if="success" class="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-600 dark:text-green-400 font-semibold">
        ✓ Kassabon succesvol geüpload!
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {useReceiptUpload} from '~/composables/useReceiptUpload';

const selectedFile = ref<File | null>(null)
const loading = ref(false)
const error = ref('')
const success = ref(false)

const {uploadReceipt} = useReceiptUpload();

function onFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length > 0) {
    selectedFile.value = files[0]
    error.value = ''
    success.value = false
  }
}

async function handleUpload() {
  if (!selectedFile.value) return
  loading.value = true
  error.value = ''
  success.value = false
  try {
    await uploadReceipt(selectedFile.value)
    success.value = true
    selectedFile.value = null
  } catch (e: any) {
    error.value = e.message || 'Er is iets misgegaan bij het uploaden. Probeer het opnieuw.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
</style>
