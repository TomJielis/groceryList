<script setup lang="ts">
import {useAuth} from "~/composables/useAuth";
const { user, logout } = useAuth();

function logoutUser() {
  logout()
}

</script>

<template>
  <nav class="bg-green-500 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-xl font-bold"><nuxtLink to="/">Grocery List</nuxtLink></h1>
      <ul class="flex space-x-4">
        <nuxtLink to="/lists" class="hover:underline">Lists</nuxtLink>
        <nuxtLink v-if="!user" to="/auth/login" class="hover:underline">Login</nuxtLink>
        <nuxtLink v-if="!user" to="/auth/register" class="hover:underline">Register</nuxtLink>
        <nuxtLink v-if="user" @click="logoutUser" class="hover:underline">Logout</nuxtLink>
      </ul>
    </div>
  </nav>
</template>
