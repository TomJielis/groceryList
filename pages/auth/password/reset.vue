<script setup lang="ts">
import {ref} from 'vue';
import {useAuth} from "~/composables/useAuth";
import {useRouter} from "vue-router";
import {useAuthStore} from "~/stores/auth";
import {useNotification} from "~/composables/useNotification";

const {showNotification} = useNotification();
const {resetPassword} = useAuth();
const router = useRouter();
const mailSent = ref(false);
const userData = ref({
  email: '',
});


function handleResetPassword() {
  resetPassword(userData.value)
      .then(() => {
        mailSent.value = true;
      })
      .catch((error) => {
        showNotification(error);
      });
}
</script>

<template>
  <div class="h-[90vh] flex items-center justify-center px-4">
    <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-sm">
      <div v-if="!mailSent">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-center mb-6 text-gray-900">📝 Reset password</h2>
        <form @submit.prevent="handleResetPassword" class="space-y-5">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
                type="email"
                id="email"
                v-model="userData.email"
                class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 placeholder-gray-400"
                placeholder="you@example.com"
                required
            />
          </div>
          <button
              type="submit"
              class="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 active:scale-95 transition transform focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 font-semibold"
          >
            Submit
          </button>
        </form>
        <p class="text-sm text-center text-gray-600 mt-6">
          Already have an account?
          <nuxtLink to="/auth/login" class="text-green-500 hover:underline font-medium">Login</nuxtLink>
        </p>
      </div>
      <div v-else class="text-center space-y-4">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900">📝 Check your email!</h2>
        <p class="text-sm text-gray-700">
          If an account exists for the provided email address, we've sent you a password reset link.
          Please check your inbox — and don't forget to look in your spam or junk folder just in case.
        </p>
        <p class="text-sm text-center text-gray-600 mt-6">
          Already have an account?
          <nuxtLink to="/auth/login" class="text-green-500 hover:underline font-medium">Login</nuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
