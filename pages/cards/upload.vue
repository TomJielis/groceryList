<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CardUploadPanel from '~/components/cards/CardUploadPanel.vue'

definePageMeta({
  middleware: ['auth', 'terms'],
})

const router = useRouter()
const visible = ref(true)

function closePanel() {
  visible.value = false
  router.push('/cards')
}
</script>

<template>
  <CardUploadPanel :visible="visible" @close="closePanel" @uploaded="closePanel" />
</template>
