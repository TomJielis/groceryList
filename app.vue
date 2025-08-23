<template>
  <div class="min-h-screen flex flex-col overflow-x-hidden">
    <Navbar />
    <nuxtPage />
  </div>
</template>
<script>
useHead({
  link: [
    { rel: 'manifest', href: '/manifest.json' }
  ]
})
</script>