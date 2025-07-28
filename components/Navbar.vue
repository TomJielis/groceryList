<script setup lang="ts">
</script>

<template>
  <nav class="bg-green-500 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-xl font-bold"><nuxtLink to="/">Grocery List</nuxtLink></h1>
      <ul class="flex space-x-4">
        <nuxtLink to="list" class="hover:underline">List</nuxtLink>
        <nuxtLink to="auth/login" class="hover:underline">Login</nuxtLink>
        <nuxtLink to="auth/register" class="hover:underline">Register</nuxtLink>
      </ul>
    </div>
  </nav>
</template>
