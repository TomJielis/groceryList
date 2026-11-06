<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import type { MenuItem } from 'primevue/menuitem'
import { useI18nStore } from '~/stores/i18n'
import { useAuthStore } from '~/stores/auth'
import type { TCookbook } from '~/types/TCookbook'

// Which cookbook the overview shows (null: all recipes), with what can be done with that cookbook in a menu. Only its
// creator renames, shares and deletes it; someone it was shared with can leave it. The page does the work.
const props = defineProps<{
  cookbooks: TCookbook[]
  modelValue: number | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', id: number | null): void
  (e: 'new'): void
  (e: 'edit', cookbook: TCookbook): void
  (e: 'share', cookbook: TCookbook): void
  (e: 'favorite', cookbook: TCookbook): void
  (e: 'delete', cookbook: TCookbook): void
}>()

const i18n = useI18nStore()
const auth = useAuthStore()
const menu = ref<any>(null)

const selected = computed(() => props.cookbooks.find(cookbook => cookbook.id === props.modelValue) ?? null)

const menuItems = computed<MenuItem[]>(() => {
  const cookbook = selected.value
  if (!cookbook) return []
  const isCreator = cookbook.created_by?.id === auth.user?.id

  const items: MenuItem[] = [{
    label: cookbook.favorite ? i18n.t('cookbooks.unfavorite') : i18n.t('cookbooks.favorite'),
    icon: cookbook.favorite ? 'pi pi-star-fill' : 'pi pi-star',
    command: () => emit('favorite', cookbook),
  }]
  if (isCreator) {
    items.push(
      { label: i18n.t('cookbooks.edit'), icon: 'pi pi-pencil', command: () => emit('edit', cookbook) },
      { label: i18n.t('cookbooks.share'), icon: 'pi pi-share-alt', command: () => emit('share', cookbook) },
    )
  }
  items.push({ separator: true }, {
    label: isCreator ? i18n.t('cookbooks.delete') : i18n.t('cookbooks.leave'),
    icon: 'pi pi-trash',
    class: 'menu-item-danger',
    command: () => emit('delete', cookbook),
  })
  return items
})

function select(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  emit('update:modelValue', value === '' ? null : Number(value))
}

// "Samen koken ★ · gedeeld"
function optionLabel(cookbook: TCookbook) {
  const shared = cookbook.members.length > 1 ? ` · ${i18n.t('cookbooks.shared')}` : ''
  return `${cookbook.name}${cookbook.favorite ? ' ★' : ''}${shared} (${cookbook.recipes_count})`
}
</script>

<template>
  <div class="flex items-end gap-2">
    <div class="flex-1 min-w-0">
      <label class="form-label" for="cookbook-select">{{ i18n.t('cookbooks.choose') }}</label>
      <select
        id="cookbook-select"
        class="form-field cursor-pointer"
        data-testid="cookbook-select"
        :value="modelValue ?? ''"
        @change="select"
      >
        <option value="">{{ i18n.t('cookbooks.all') }}</option>
        <option v-for="cookbook in cookbooks" :key="cookbook.id" :value="cookbook.id">{{ optionLabel(cookbook) }}</option>
      </select>
    </div>
    <Button
      v-if="selected"
      icon="pi pi-ellipsis-v"
      text
      rounded
      severity="secondary"
      :aria-label="selected.name"
      data-testid="cookbook-menu"
      @click="menu?.toggle($event)"
    />
    <Button
      icon="pi pi-plus"
      :label="i18n.t('cookbooks.new')"
      severity="secondary"
      outlined
      data-testid="cookbook-new"
      @click="emit('new')"
    />
  </div>

  <Menu ref="menu" popup :model="menuItems" class="min-w-[14rem]" />
</template>

<style scoped>
:deep(.menu-item-danger) {
  color: var(--app-error) !important;
}
</style>
