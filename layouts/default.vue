<template>
  <div class="page-wrapper">
    <slot />
  </div>
</template>

<style scoped>
.page-wrapper {
  background: transparent; /* ✅ allow body background to show through */
  min-height: 100dvh;
}
</style>
