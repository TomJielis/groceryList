<script setup lang="ts">
import { useI18nStore } from '~/stores/i18n'
import AdminStatsCard from '~/components/admin/AdminStatsCard.vue'
import type { TRecipeStats } from '~/types/TRecipe'

// Recipes and cookbooks in numbers: added in the chosen month compared with the one before, and how many in all.
// On "My statistics", and with `admin` on the admin's page about a user (about them, and how many cookbooks too).
defineProps<{
  recipes: TRecipeStats
  admin?: boolean
}>()

const i18n = useI18nStore()
</script>

<template>
  <div class="list-item-row rounded p-5">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-x-6">
      <AdminStatsCard
        :title="i18n.t('profile.recipesAddedMonth')"
        :value="recipes.current_month.added"
        :previous-value="recipes.previous_month.added"
        :show-percentage="true"
      />
      <AdminStatsCard
        :title="i18n.t('profile.cookbooksCreatedMonth')"
        :value="recipes.current_month.cookbooks_created"
        :previous-value="recipes.previous_month.cookbooks_created"
        :show-percentage="true"
      />
      <AdminStatsCard :title="i18n.t('profile.recipesAddedTotal')" :value="recipes.recipes_added" />
      <AdminStatsCard :title="i18n.t(admin ? 'admin.recipesAccess' : 'profile.recipesAccess')" :value="recipes.recipes_access" />
      <template v-if="admin">
        <AdminStatsCard :title="i18n.t('admin.ownedCookbooks')" :value="recipes.cookbooks_owned" />
        <AdminStatsCard :title="i18n.t('admin.sharedCookbooksWithUser')" :value="recipes.cookbooks_shared_with_user" />
      </template>
    </div>
  </div>
</template>
