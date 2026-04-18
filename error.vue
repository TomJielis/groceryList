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
  <div class="h-[90dvh] bg-[#18181b] flex flex-col items-center justify-center px-4 text-center" style="font-family: 'DM Sans', system-ui, sans-serif">
    <div class="max-w-md w-full bg-[#1e1e21] border border-[#27272a] rounded p-8">
      <div class="flex flex-col items-center space-y-4">
        <img
            src="/icons/groceryCart.png"
            alt="Boodschappenlijst Logo"
            class="w-14 h-14"
        />
        <h1 class="text-2xl font-medium text-[#fafafa]">Er is iets misgegaan</h1>
        <p class="text-[#71717a]">
          Oeps! Het lijkt erop dat er iets misging bij het laden van de pagina.
        </p>
        <p class="text-[#71717a]">
          {{props.error.statusMessage}}
        </p>
        <p class="text-[#52525b] text-sm">
          Probeer het later opnieuw of ga terug naar je dashboard.
        </p>

        <NuxtLink
            to="/"
        >
          <button class="mt-4 bg-[#fafafa] text-[#18181b] hover:bg-[#d4d4d8] font-medium px-6 py-2 rounded transition">
            Terug naar Dashboard
          </button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>