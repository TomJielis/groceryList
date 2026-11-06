<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import { useI18nStore } from '~/stores/i18n'
import { useNotification } from '~/composables/useNotification'
import { imageToDataUrl } from '~/utils/imageToDataUrl'

// The recipe's photo in the form. The change is only saved with the recipe: v-model is undefined (unchanged), a data
// URL (a new photo) or null (removed).
const props = defineProps<{ currentUrl: string | null }>()
const change = defineModel<string | null | undefined>()

const i18n = useI18nStore()
const { showNotification } = useNotification()
const fileInput = ref<HTMLInputElement | null>(null)

const shown = computed(() => (change.value === undefined ? props.currentUrl : change.value))

async function picked(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  try {
    change.value = await imageToDataUrl(file)
  } catch {
    showNotification(i18n.t('recipes.form.photoInvalid'))
  }
}
</script>

<template>
  <div>
    <p class="form-label">{{ i18n.t('recipes.form.photo') }}</p>
    <div class="flex flex-col sm:flex-row sm:items-end gap-3">
      <div class="recipe-photo-preview w-full sm:w-64 flex items-center justify-center overflow-hidden">
        <img v-if="shown" :src="shown" alt="" class="w-full h-full object-cover" />
        <span v-else class="text-4xl">🍽️</span>
      </div>
      <div class="flex gap-2">
        <Button
          icon="pi pi-image"
          severity="secondary"
          outlined
          :label="shown ? i18n.t('recipes.form.changePhoto') : i18n.t('recipes.form.addPhoto')"
          @click="fileInput?.click()"
        />
        <Button
          v-if="shown"
          icon="pi pi-trash"
          severity="secondary"
          text
          :label="i18n.t('recipes.form.removePhoto')"
          @click="change = null"
        />
      </div>
    </div>
    <input ref="fileInput" type="file" accept="image/*" class="hidden" data-testid="recipe-photo-input" @change="picked" />
  </div>
</template>

<style scoped>
.recipe-photo-preview {
  aspect-ratio: 4 / 3;
  border-radius: 4px;
  background: var(--p-surface-100);
}
</style>
