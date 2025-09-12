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
  <div class="h-[90vh] bg-[#f1fdf3] flex items-center justify-center px-4 text-center">
    <div class="max-w-md w-full bg-white shadow-xl rounded-xl p-8">
      <div class="flex flex-col items-center space-y-4">
        <img
            src="/icons/groceryCart.png"
            alt="Grocery List Logo"
            class="w-14 h-14"
        />
        <h1 class="text-2xl font-bold text-red-600">Something went wrong</h1>
        <p class="text-gray-600">
          Oops! It looks like something went wrong while loading the page.
        </p>
        <p class="text-gray-600">
          {{props.error.statusMessage}}
        </p>
        <p class="text-gray-500 text-sm">
          Please try again later or go back to your dashboard.
        </p>

        <NuxtLink
            to="/"
            class="mt-4 bg-green-500 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-green-600 transition"
        >
          Back to Dashboard
        </NuxtLink>
      </div>
    </div>
  </div>
</template>