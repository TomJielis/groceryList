<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n';
import AdminStatsCard from "~/components/admin/AdminStatsCard.vue";
import Card from 'primevue/card';

interface Props {
  items: {
    current_month: { added: number; checked: number; period: string }
    previous_month: { added: number; checked: number; period: string }
  }
  invalid_login_attempts?: {
    current_month: number
    previous_month: number
  }
}

const props = defineProps<Props>();

const i18n = useI18nStore();
</script>

<template>
  <Card>
    <template #content>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AdminStatsCard
          :title="i18n.t('profile.itemsAddedMonth')"
          :value="items?.current_month?.added ?? 0"
          :previous-value="items?.previous_month?.added ?? 0"
          :showPercentage="true"
        />
        <AdminStatsCard
          :title="i18n.t('profile.itemsCheckedMonth')"
          :value="items?.current_month?.checked ?? 0"
          :previous-value="items?.previous_month?.checked ?? 0"
          :showPercentage="true"
        />
        <AdminStatsCard
          :title="i18n.t('profile.invalidLoginAttempts')"
          :value="props?.invalid_login_attempts?.current_month ?? 0"
          :previous-value="props?.invalid_login_attempts?.previous_month ?? 0"
          :showPercentage="true"
        />
        <div class="border rounded p-4">
          <p class="text-[0.65rem] uppercase tracking-[0.14em] font-medium mb-1">
            {{ i18n.t('profile.previousMonth') }} ({{ items?.previous_month?.period }})
          </p>
          <p class="text-base">
            {{ items?.previous_month?.added ?? 0 }} {{ i18n.t('profile.added') }},
            {{ items?.previous_month?.checked ?? 0 }} {{ i18n.t('profile.checked') }}
          </p>
        </div>
      </div>
    </template>
  </Card>
</template>
