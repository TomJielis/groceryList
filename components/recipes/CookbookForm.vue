<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Button from 'primevue/button'
import deleteModal from '~/components/deleteModal.vue'
import { useCookbooks } from '~/composables/useCookbooks'
import { useNotification } from '~/composables/useNotification'
import { useI18nStore } from '~/stores/i18n'
import { useAuthStore } from '~/stores/auth'
import type { TCookbook, TCookbookMember } from '~/types/TCookbook'

// Making a cookbook, or (its creator) renaming one and removing people from it, like ListForm does for lists
const props = defineProps<{ cookbookId?: number }>()
const emit = defineEmits<{
  (e: 'saved', cookbook: TCookbook): void
  (e: 'close'): void
}>()

const { cookbooks, createCookbook, renameCookbook, removeMember } = useCookbooks()
const { showNotification, showSuccess } = useNotification()
const i18n = useI18nStore()
const auth = useAuthStore()

const cookbook = computed(() => cookbooks.value.find(c => c.id === props.cookbookId) ?? null)
const name = ref('')
const saving = ref(false)

watch(() => props.cookbookId, () => {
  name.value = cookbook.value?.name ?? ''
}, { immediate: true })

async function save() {
  const trimmed = name.value.trim()
  if (!trimmed || saving.value) return
  saving.value = true
  try {
    if (props.cookbookId) {
      await renameCookbook(props.cookbookId, trimmed)
      showSuccess(i18n.t('cookbooks.updated'))
      emit('saved', cookbook.value!)
    } else {
      const created = await createCookbook(trimmed)
      showSuccess(i18n.t('cookbooks.created'))
      emit('saved', created)
    }
  } catch (error: any) {
    showNotification(error?.data?.message || i18n.t('cookbooks.failed'))
  } finally {
    saving.value = false
  }
}

// Removing someone asks first
const memberToRemove = ref<TCookbookMember | null>(null)

async function confirmRemove() {
  if (!props.cookbookId || !memberToRemove.value) return
  try {
    await removeMember(props.cookbookId, memberToRemove.value.id)
    showSuccess(i18n.t('cookbooks.memberRemoved'))
  } catch (error: any) {
    showNotification(error?.data?.message || i18n.t('cookbooks.failed'))
  } finally {
    memberToRemove.value = null
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <h2 class="page-heading">{{ cookbookId ? i18n.t('cookbooks.edit') : i18n.t('cookbooks.new') }}</h2>

    <div>
      <label class="form-label" for="cookbook-name">{{ i18n.t('cookbooks.nameLabel') }}</label>
      <input
        id="cookbook-name"
        v-model="name"
        type="text"
        maxlength="100"
        class="form-field font-medium"
        :placeholder="i18n.t('cookbooks.namePlaceholder')"
        @keyup.enter="save"
      />
    </div>

    <!-- Who has access: the creator first, then who joined -->
    <div v-if="cookbook">
      <p class="form-label mb-3">{{ i18n.t('cookbooks.members') }} ({{ cookbook.members.length }})</p>
      <div
        v-for="member in cookbook.members"
        :key="member.id"
        class="flex items-center justify-between py-3 border-t border-surface-200"
      >
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white flex-shrink-0" style="background: var(--p-primary-color)">
            {{ member.name.charAt(0).toUpperCase() }}
          </div>
          <p class="text-sm font-medium">
            {{ member.name }}
            <span v-if="member.id === auth.user?.id" class="text-surface-500 font-normal">({{ i18n.t('cookbooks.you') }})</span>
            <span v-else-if="member.id === cookbook.created_by?.id" class="text-surface-500 font-normal">({{ i18n.t('cookbooks.creator') }})</span>
          </p>
        </div>
        <Button
          v-if="member.id !== cookbook.created_by?.id"
          icon="pi pi-trash"
          severity="secondary"
          text
          :aria-label="i18n.t('cookbooks.removeMemberTitle')"
          @click="memberToRemove = member"
        />
      </div>
      <div class="border-t border-surface-200"></div>
      <p class="text-xs text-surface-500 mt-3">{{ i18n.t('cookbooks.shareHint') }}</p>
    </div>

    <div class="flex gap-2 pt-2">
      <Button severity="secondary" outlined class="flex-1" :label="i18n.t('common.cancel')" @click="emit('close')" />
      <Button
        severity="primary"
        class="flex-1"
        :label="cookbookId ? i18n.t('cookbooks.save') : i18n.t('cookbooks.create')"
        :disabled="!name.trim()"
        :loading="saving"
        @click="save"
      />
    </div>
  </div>

  <deleteModal
    :is-visible="memberToRemove !== null"
    :title="i18n.t('cookbooks.removeMemberTitle')"
    :content="i18n.t('cookbooks.removeMemberBody')"
    :item-name="memberToRemove?.name || ''"
    :delete-button-text="i18n.t('common.delete')"
    :with-validation="false"
    @close="memberToRemove = null"
    @confirm="confirmRemove"
  />
</template>
