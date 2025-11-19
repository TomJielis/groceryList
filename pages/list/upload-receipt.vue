<template>
  <div class="max-w-2xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6 text-primary-dark dark:text-accent-light text-center">📄 Kassabon uploaden</h1>

    <!-- Upload sectie -->
    <div v-if="!showMappingInterface" class="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-5 border border-border-light dark:border-border-dark">
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
      <div v-if="success && !showMappingInterface" class="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-600 dark:text-green-400 font-semibold">
        ✓ Producten succesvol opgeslagen!
      </div>
    </div>

    <!-- Mapping Interface -->
    <div v-if="showMappingInterface" class="space-y-6">
      <!-- Nieuwe producten sectie -->
      <div v-if="newProducts.length > 0" class="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-5 border border-border-light dark:border-border-dark">
        <h2 class="text-xl font-bold mb-4 text-primary-dark dark:text-accent-light">
          ➕ Te mappen producten ({{ newProducts.length }})
        </h2>
        <p class="text-slate-600 dark:text-slate-400 mb-6">
          Deze producten zijn niet automatisch herkend. Koppel ze aan bestaande items of maak nieuwe producten aan.
        </p>

        <div class="space-y-4">
          <div
              v-for="(mapped, index) in newProducts"
              :key="index"
              class="rounded-xl p-4 border"
              :class="mapped.mappedToItemId !== null
                ? 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/30'
                : 'bg-green-500/5 dark:bg-green-500/10 border-green-500/30'"
          >
            <div class="mb-3">
              <div class="flex items-start justify-between gap-2">
                <h3 class="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  {{ mapped.receiptProduct.name }}
                </h3>
                <span
                    v-if="mapped.mappedToItemId !== null"
                    class="text-xs bg-blue-500/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-lg whitespace-nowrap"
                >
                  ✓ Match gevonden
                </span>
              </div>
              <div class="text-sm text-slate-600 dark:text-slate-400">
                Prijs per stuk: <strong>€{{ mapped.unitPrice.toFixed(2) }}</strong>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
                Koppel aan:
              </label>

              <div class="flex gap-2">
                <select
                    v-model="mapped.mappedToItemId"
                    @change="() => {
                      if (mapped.mappedToItemId === null) {
                        mapped.mappedToItemName = mapped.receiptProduct.name;
                      } else {
                        const item = items.find(i => i.id === mapped.mappedToItemId);
                        if (item) {
                          mapped.mappedToItemName = item.name;
                        }
                      }
                    }"
                    class="flex-1 border border-accent/30 dark:border-accent/40 rounded-xl p-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-accent transition"
                >
                  <option :value="null">➕ Nieuw product aanmaken</option>
                  <optgroup label="Bestaande producten">
                    <option
                        v-for="item in items"
                        :key="item.id"
                        :value="item.id"
                    >
                      {{ item.name }}
                    </option>
                  </optgroup>
                </select>
              </div>

              <!-- Als nieuw product, toon naam input -->
              <div v-if="mapped.mappedToItemId === null" class="mt-2">
                <input
                    v-model="mapped.mappedToItemName"
                    type="text"
                    placeholder="Productnaam"
                    class="w-full border border-accent/30 dark:border-accent/40 rounded-xl p-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-accent transition"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bestaande producten met updates sectie -->
      <div v-if="updatedProducts.length > 0" class="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-5 border border-border-light dark:border-border-dark">
        <h2 class="text-xl font-bold mb-4 text-primary-dark dark:text-accent-light">
          🔄 Gevonden producten ({{ updatedProducts.length }})
        </h2>
        <p class="text-slate-600 dark:text-slate-400 mb-6">
          Deze producten zijn al bekend. Je kunt kiezen welke prijzen je wilt bijwerken.
        </p>

        <div class="space-y-4">
          <div
              v-for="(updated, index) in updatedProducts"
              :key="index"
              class="bg-blue-500/5 dark:bg-blue-500/10 rounded-xl p-4 border border-blue-500/30"
          >
            <div class="flex items-start gap-3">
              <input
                  type="checkbox"
                  v-model="updated.shouldUpdate"
                  class="mt-1 w-5 h-5 rounded border-accent/30 text-accent focus:ring-accent"
              />
              <div class="flex-1">
                <h3 class="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  {{ updated.name }}
                </h3>
                <div v-if="updated.action === 'create'" class="text-sm text-slate-600 dark:text-slate-400">
                  Nieuw product gevonden: <strong>€{{ (updated.new_price || updated.unit_price).toFixed(2) }}</strong>
                  <span v-if="updated.quantity"> × {{ updated.quantity }}</span>
                </div>
                <div v-else class="text-sm text-slate-600 dark:text-slate-400">
                  Prijs wijziging:
                  <span class="line-through text-slate-500">€{{ updated.old_price?.toFixed(2) }}</span>
                  →
                  <strong class="text-blue-600 dark:text-blue-400">€{{ (updated.new_price || updated.unit_price).toFixed(2) }}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Acties en overzicht -->
      <div class="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-5 border border-border-light dark:border-border-dark">
        <h3 class="text-lg font-bold mb-3 text-primary-dark dark:text-accent-light">
          📊 Overzicht
        </h3>
        <div class="space-y-2 mb-6">
          <div class="flex justify-between text-sm">
            <span class="text-slate-600 dark:text-slate-400">Te mappen producten:</span>
            <span class="font-semibold text-slate-800 dark:text-slate-200">
              {{ newProducts.length }}
            </span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-600 dark:text-slate-400 pl-4">→ Nieuw aanmaken:</span>
            <span class="font-semibold text-green-600 dark:text-green-400">
              {{ newProducts.filter(m => m.mappedToItemId === null).length }}
            </span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-600 dark:text-slate-400 pl-4">→ Koppelen aan bestaand:</span>
            <span class="font-semibold text-blue-600 dark:text-blue-400">
              {{ newProducts.filter(m => m.mappedToItemId !== null).length }}
            </span>
          </div>
          <div class="flex justify-between text-sm pt-2 border-t border-slate-200 dark:border-slate-700">
            <span class="text-slate-600 dark:text-slate-400">Automatisch herkend:</span>
            <span class="font-semibold text-blue-600 dark:text-blue-400">
              {{ updatedProducts.length }} ({{ updatedProducts.filter(u => u.shouldUpdate).length }} bijwerken)
            </span>
          </div>
        </div>

        <div class="flex gap-3">
          <button
              @click="showMappingInterface = false; newProducts = []; updatedProducts = []"
              class="flex-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold py-3 px-4 rounded-xl transition shadow-lg hover:shadow-xl active:shadow-md"
          >
            Annuleren
          </button>
          <button
              @click="saveMappings"
              :disabled="savingMappings"
              class="flex-1 bg-accent hover:bg-accent/90 text-white font-bold py-3 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl active:shadow-md"
          >
            {{ savingMappings ? 'Opslaan...' : 'Opslaan' }}
          </button>
        </div>

        <div v-if="error" class="mt-4 p-4 bg-error/10 border border-error/30 rounded-xl text-error font-semibold">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {useReceiptUpload} from '~/composables/useReceiptUpload';
import {useGroceryList} from '~/composables/useGroceryList';
import type {TGroceryListItem} from '~/types/TGroceryListItem';

const selectedFile = ref<File | null>(null)
const loading = ref(false)
const error = ref('')
const success = ref(false)
const showMappingInterface = ref(false)
const savingMappings = ref(false)

const {uploadReceipt} = useReceiptUpload();
const {items, fetchItems} = useGroceryList();

// Type voor nieuwe producten (uit products array)
type MappedNewProduct = {
  receiptProduct: any;
  mappedToItemId: number | null; // null = nieuw product aanmaken
  mappedToItemName: string;
  unitPrice: number;
}

// Type voor bestaande producten (uit updated_items array)
type UpdatedProduct = {
  name: string;
  old_price?: number;
  new_price: number;
  unit_price: number;
  quantity?: number;
  action: string;
  shouldUpdate: boolean; // User kan kiezen of ze deze willen updaten
}

const newProducts = ref<MappedNewProduct[]>([])
const updatedProducts = ref<UpdatedProduct[]>([])

// Laad bestaande grocery list items bij opstart
onMounted(async () => {
  await fetchItems(null) // Haal alle items op
})

// Zoek functie voor fuzzy matching
function findBestMatch(receiptProductName: string): TGroceryListItem | null {
  const normalizedName = receiptProductName.toLowerCase().trim()

  // Exacte match
  let match = items.value.find(item =>
    item.name.toLowerCase().trim() === normalizedName
  )
  if (match) return match

  // Gedeeltelijke match (bevat)
  match = items.value.find(item =>
    item.name.toLowerCase().includes(normalizedName) ||
    normalizedName.includes(item.name.toLowerCase())
  )
  if (match) return match

  // Eerste woord match
  const firstWord = normalizedName.split(' ')[0]
  match = items.value.find(item =>
    item.name.toLowerCase().startsWith(firstWord)
  )

  return match || null
}

function onFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length > 0) {
    selectedFile.value = files[0]
    error.value = ''
    success.value = false
    showMappingInterface.value = false
  }
}

async function handleUpload() {
  if (!selectedFile.value) return
  loading.value = true
  error.value = ''
  success.value = false
  showMappingInterface.value = false

  try {
    const response = await uploadReceipt(selectedFile.value)
    success.value = true

    // Verwerk nieuwe producten (new_products array)
    if (response.new_products && response.new_products.length > 0) {
      newProducts.value = response.new_products.map((product: any) => {
        const bestMatch = findBestMatch(product.name)
        return {
          receiptProduct: product,
          mappedToItemId: bestMatch?.id || null,
          mappedToItemName: bestMatch?.name || product.name,
          unitPrice: product.unit_price
        }
      })
    } else {
      newProducts.value = []
    }

    // Verwerk bestaande items met updates (products array)
    if (response.products && response.products.length > 0) {
      updatedProducts.value = response.products.map((item: any) => ({
        ...item,
        shouldUpdate: true // Standaard aan, user kan uitvinken
      }))
    } else {
      updatedProducts.value = []
    }

    // Toon mapping interface als er iets te mappen is
    if (newProducts.value.length > 0 || updatedProducts.value.length > 0) {
      showMappingInterface.value = true
    }

    selectedFile.value = null
  } catch (e: any) {
    error.value = e.message || 'Er is iets misgegaan bij het uploaden. Probeer het opnieuw.'
  } finally {
    loading.value = false
  }
}

async function saveMappings() {
  savingMappings.value = true
  error.value = ''

  try {
    // Nieuwe producten mappings
    const newProductMappings = newProducts.value.map(mp => ({
      receipt_product_name: mp.receiptProduct.name,
      mapped_item_id: mp.mappedToItemId,
      mapped_item_name: mp.mappedToItemName,
      unit_price: mp.unitPrice,
      is_new: mp.mappedToItemId === null
    }))

    // Updates voor bestaande producten (alleen degene die shouldUpdate = true hebben)
    const productUpdates = updatedProducts.value
      .filter(up => up.shouldUpdate)
      .map(up => ({
        name: up.name,
        old_price: up.old_price,
        new_price: up.new_price || up.unit_price,
        action: up.action
      }))

    await $fetch('/api/receipt/map-products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        new_products: newProductMappings,
        updated_products: productUpdates
      })
    })

    // Success! Reset de interface
    showMappingInterface.value = false
    newProducts.value = []
    updatedProducts.value = []
    success.value = true
    error.value = ''

  } catch (e: any) {
    error.value = e.message || 'Er is iets misgegaan bij het opslaan. Probeer het opnieuw.'
  } finally {
    savingMappings.value = false
  }
}
</script>

<style scoped>
</style>
