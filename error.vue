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
  <div class="h-[90vh] bg-gradient-to-br from-sky-50 via-blue-100 to-indigo-200 dark:from-slate-800 dark:via-slate-900 dark:to-indigo-950 text-slate-900 dark:text-slate-100 font-inter flex flex-col relative transition-colors items-center justify-center px-4 text-center">
    <div class="max-w-md w-full bg-white shadow-xl rounded-xl p-8">
      <div class="flex flex-col items-center space-y-4">
        <img
            src="/icons/groceryCart.png"
            alt="Boodschappenlijst Logo"
            class="w-14 h-14"
        />
        <h1 class="text-2xl font-bold text-gray-600 ">Er is iets misgegaan</h1>
        <p class="text-gray-600">
          Oeps! Het lijkt erop dat er iets misging bij het laden van de pagina.
        </p>
        <p class="text-gray-600">
          {{props.error.statusMessage}}
        </p>
        <p class="text-gray-500 text-sm">
          Probeer het later opnieuw of ga terug naar je dashboard.
        </p>

        <NuxtLink
            to="/"
        >
          <button class="mt-4 bg-gray-200 font-semibold px-6 py-2 rounded-lg shadow transition">
            Terug naar Dashboard
          </button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>