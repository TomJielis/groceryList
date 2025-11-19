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

    <!-- Display uploaded products -->
    <div v-if="uploadedProducts && uploadedProducts.length > 0" class="mt-6 bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-5 border border-border-light dark:border-border-dark">
      <h2 class="text-xl font-bold mb-4 text-primary-dark dark:text-accent-light">
        📦 Gevonden producten ({{ uploadedProducts.length }})
      </h2>

      <ul class="space-y-3">
        <li
            v-for="(product, index) in uploadedProducts"
            :key="index"
            class="bg-accent/5 dark:bg-accent/10 rounded-xl p-4 border border-accent/20"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h3 class="font-semibold text-slate-800 dark:text-slate-200">{{ product.name }}</h3>
              <div class="mt-2 text-sm text-slate-600 dark:text-slate-400">
                <span class="inline-block mr-4">📊 Aantal: <strong>{{ product.quantity }}</strong></span>
                <span class="inline-block mr-4">💰 Prijs per stuk: <strong>€{{ product.unit_price.toFixed(2) }}</strong></span>
              </div>
            </div>
            <div class="ml-4 text-right">
              <div class="text-lg font-bold text-accent">€{{ product.total_price.toFixed(2) }}</div>
            </div>
          </div>
        </li>
      </ul>

      <div v-if="totalPrice > 0" class="mt-6 pt-4 border-t border-accent/20">
        <div class="flex justify-between items-center">
          <span class="text-lg font-bold text-slate-800 dark:text-slate-200">Totaal:</span>
          <span class="text-2xl font-bold text-accent">€{{ totalPrice.toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <!-- Display updated items summary -->
    <div v-if="updatedItems && updatedItems.length > 0" class="mt-6 bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-5 border border-border-light dark:border-border-dark">
      <h2 class="text-xl font-bold mb-4 text-primary-dark dark:text-accent-light">
        ✏️ Wijzigingen ({{ updatedItems.length }})
      </h2>

      <ul class="space-y-3">
        <li
            v-for="(item, index) in updatedItems"
            :key="index"
            class="rounded-xl p-4 border"
            :class="item.action === 'create'
              ? 'bg-green-500/5 dark:bg-green-500/10 border-green-500/30'
              : 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/30'"
        >
          <div class="flex items-start">
            <span class="text-2xl mr-3">{{ item.action === 'create' ? '➕' : '🔄' }}</span>
            <div class="flex-1">
              <h3 class="font-semibold text-slate-800 dark:text-slate-200">{{ item.name }}</h3>
              <div v-if="item.action === 'create'" class="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Nieuw product toegevoegd: €{{ item.unit_price.toFixed(2) }} × {{ item.quantity }}
              </div>
              <div v-else class="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Prijs bijgewerkt: <span class="line-through">€{{ item.old_price.toFixed(2) }}</span> → <strong class="text-blue-600 dark:text-blue-400">€{{ item.new_price.toFixed(2) }}</strong>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue'
import {useReceiptUpload} from '~/composables/useReceiptUpload';

const selectedFile = ref<File | null>(null)
const loading = ref(false)
const error = ref('')
const success = ref(false)
const uploadedProducts = ref<any[]>([])
const updatedItems = ref<any[]>([])

const {uploadReceipt} = useReceiptUpload();

const totalPrice = computed(() => {
  return uploadedProducts.value.reduce((sum, product) => sum + product.total_price, 0)
})

function onFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length > 0) {
    selectedFile.value = files[0]
    error.value = ''
    success.value = false
    uploadedProducts.value = []
    updatedItems.value = []
  }
}

async function handleUpload() {
  if (!selectedFile.value) return
  loading.value = true
  error.value = ''
  success.value = false
  uploadedProducts.value = []
  updatedItems.value = []

  try {
    const response = await uploadReceipt(selectedFile.value)
    success.value = true

    // Store the products and updated items from the response
    if (response.products) {
      uploadedProducts.value = response.products
    }
    if (response.updated_items) {
      updatedItems.value = response.updated_items
    }

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
