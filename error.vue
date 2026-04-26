<script setup>
const props = defineProps({
  error: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <navbar />
  <div
    class="min-h-[90dvh] flex items-center justify-center px-4"
    style="background: var(--app-bg); font-family: 'DM Sans', system-ui, sans-serif"
  >
    <div class="max-w-sm w-full flex flex-col items-center gap-6 text-center">
      <!-- Icon -->
      <div class="w-12 h-12 flex items-center justify-center rounded-full border border-surface-200">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--p-surface-400)">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        </svg>
      </div>

      <!-- Text -->
      <div class="space-y-2">
        <h1 class="page-heading">Er is iets misgegaan</h1>
        <p class="text-sm" style="color: var(--p-surface-500)">
          Oeps! Het lijkt erop dat er iets misging bij het laden van de pagina.
        </p>
        <p v-if="props.error?.statusMessage" class="text-sm" style="color: var(--p-surface-500)">
          {{ props.error.statusMessage }}
        </p>
      </div>

      <!-- Action -->
      <NuxtLink
        to="/"
        class="px-5 py-2 border border-surface-200 text-surface-500 hover:border-surface-400 hover:text-surface-900 text-sm font-medium rounded transition"
      >
        Terug naar dashboard
      </NuxtLink>
    </div>
  </div>
</template>
