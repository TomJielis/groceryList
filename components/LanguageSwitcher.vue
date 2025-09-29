<template>
  <div class="relative">
    <button
      @click="toggleDropdown"
      class="flex items-center space-x-1 text-white hover:bg-green-600 px-2 py-1 rounded transition-colors duration-200"
      :class="{ 'bg-green-600': isOpen }"
    >
      <span class="text-sm">{{ getCurrentLanguageFlag() }}</span>
      <svg class="w-3 h-3 transition-transform duration-200" :class="{ 'rotate-180': isOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px]"
      @click.stop
    >
      <button
        v-for="locale in availableLocales"
        :key="locale.code"
        @click="switchLanguage(locale.code)"
        class="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 first:rounded-t-lg last:rounded-b-lg"
        :class="{ 'bg-green-50 text-green-700 font-medium': currentLocale === locale.code }"
      >
        <span>{{ getLanguageFlag(locale.code) }}</span>
        <span>{{ locale.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, locales, setLocale } = useI18n()
const isOpen = ref(false)

const currentLocale = computed(() => locale.value)
const availableLocales = computed(() => locales.value)

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function switchLanguage(newLocale: string) {
  setLocale(newLocale)
  isOpen.value = false
}

function getCurrentLanguageFlag() {
  return getLanguageFlag(currentLocale.value)
}

function getLanguageFlag(localeCode: string) {
  const flags: Record<string, string> = {
    'nl': '🇳🇱',
    'en': '🇺🇸'
  }
  return flags[localeCode] || '🌐'
}

function closeDropdown(event: Event) {
  const target = event.target as Element
  if (!target.closest('.relative')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>
