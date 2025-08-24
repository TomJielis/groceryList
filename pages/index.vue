<script setup lang="ts">
import TopItems from "~/components/dashboard/topItems.vue";
import DashboardBlock from "~/components/dashboard/dashboardBlock.vue";
import {useGroceryList} from "~/composables/useGroceryList";
import { useAuthStore} from "~/stores/auth";
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
definePageMeta({
  middleware: 'auth',
});

const router = useRouter();

const { lists, fetchLists } = useGroceryList();
await fetchLists();

let totalUncheckedItems = ref(
    lists.value.reduce(
        (total, list) =>
            total + (list.grocery_list_items_count - list.grocery_list_items_checked_count),
        0
    )
);
let countLists = ref(lists.value.length ?? 0)
</script>

<template>
  <div class="h-[90vh] bg-gray-50 p-8 overflow-auto">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-green-700 mb-6 text-center">
        Grocery Shopping List Dashboard
      </h1>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <dashboardBlock :title="'Items to buy'" :count="totalUncheckedItems" @click="$router.push('/list/lists')" class="cursor-pointer"/>
        <dashboardBlock :title="'Lists'" @click="$router.push('/list/lists')" :count="parseInt(countLists)" class="cursor-pointer" />
      </div>
      <topItems />
    </div>
  </div>
</template>