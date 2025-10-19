<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
    <h1 class="text-2xl font-bold mb-4">Kassabon uploaden</h1>
    <p class="mb-4 text-gray-700">
      Upload hier een foto van je kassabon. De prijzen van je producten worden dan automatisch bijgewerkt.
    </p>
    <form @submit.prevent="handleUpload">
      <input
        type="file"
        accept="image/*"
        @change="onFileChange"
        class="mb-4 block w-full text-gray-700 border border-gray-300 rounded p-2"
      />
      <button
        type="submit"
        :disabled="!selectedFile || loading"
        class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {{ loading ? 'Uploaden...' : 'Upload kassabon' }}
      </button>
    </form>
    <div v-if="error" class="mt-4 text-red-600">{{ error }}</div>
    <div v-if="success" class="mt-4 text-green-600">Kassabon succesvol geüpload!</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useReceiptUpload } from '~/composables/useReceiptUpload';

const selectedFile = ref<File | null>(null)
const loading = ref(false)
const error = ref('')
const success = ref(false)

const { uploadReceipt } = useReceiptUpload();

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
