<script setup lang="ts">
import Button from 'primevue/button'
import { useI18nStore } from '~/stores/i18n'

// The steps in the form, numbered. Empty steps are left out when saving.
const steps = defineModel<string[]>({ required: true })
const i18n = useI18nStore()

function add() {
  steps.value = [...steps.value, '']
}

function remove(index: number) {
  steps.value = steps.value.filter((_, i) => i !== index)
}

function update(index: number, value: string) {
  steps.value = steps.value.map((step, i) => (i === index ? value : step))
}
</script>

<template>
  <div>
    <p class="form-label">{{ i18n.t('recipes.form.steps') }}</p>
    <div class="flex flex-col gap-3">
      <div v-for="(step, index) in steps" :key="index" class="flex items-start gap-3" data-testid="step-row">
        <span class="w-6 pt-2 text-sm font-semibold text-surface-400 flex-shrink-0">{{ index + 1 }}.</span>
        <textarea
          :value="step"
          rows="2"
          maxlength="5000"
          class="form-field flex-1 resize-y"
          :placeholder="i18n.t('recipes.form.step')"
          :aria-label="`${i18n.t('recipes.form.step')} ${index + 1}`"
          @input="update(index, ($event.target as HTMLTextAreaElement).value)"
        ></textarea>
        <Button icon="pi pi-times" severity="secondary" text :aria-label="i18n.t('recipes.form.remove')" @click="remove(index)" />
      </div>
    </div>
    <Button
      class="mt-3"
      icon="pi pi-plus"
      severity="secondary"
      text
      :label="i18n.t('recipes.form.addStep')"
      @click="add"
    />
  </div>
</template>
