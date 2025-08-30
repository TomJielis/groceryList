<script setup lang="ts">
import { ref } from 'vue';
import {useAuth} from "~/composables/useAuth";
import {useAuthStore} from "~/stores/auth";
import { useRouter } from 'vue-router';

const { login } = useAuth();
const authStore = useAuthStore();
const router = useRouter();

// const userData = ref({
//   email: '',
//   password: ''
// });

const userData = ref({
  pincode: '',
})

function handleLogin() {
  login(userData.value)
    .then((data) => {
      authStore.setUser(data.user);

      router.push('/');
    })
    .catch((error) => {
      console.error('Login failed:', error);
    });
}
</script>


<template>
  <div class="flex items-center justify-center bg-gray-50 px-4 h-[90vh]">
    <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-sm">
      <h2 class="text-2xl sm:text-3xl font-extrabold text-center mb-6 text-gray-900">🛒 Login</h2>
      <form @submit.prevent="handleLogin" class="space-y-5">
<!--        <div>-->
<!--          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>-->
<!--          <input-->
<!--              type="email"-->
<!--              id="email"-->
<!--              v-model="userData.email"-->
<!--              class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 placeholder-gray-400"-->
<!--              placeholder="you@example.com"-->
<!--              required-->
<!--          />-->
<!--        </div>-->
<!--        <div>-->
<!--          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>-->
<!--          <input-->
<!--              type="password"-->
<!--              id="password"-->
<!--              v-model="userData.password"-->
<!--              class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 placeholder-gray-400"-->
<!--              placeholder="••••••••"-->
<!--              required-->
<!--          />-->
<!--        </div>-->
        <div>
          <div>
<!--            <input-->
<!--                type="password"-->
<!--                id="pin"-->
<!--                v-model="userData.pincode"-->
<!--                class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 placeholder-gray-400"-->
<!--                placeholder="Enter your 4-digit pin"-->
<!--                maxlength="4"-->
<!--                required-->
<!--            />-->
            <div>
              <input
                  id="pin"
                  v-model="userData.pincode"
                  class="text-center block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 placeholder-gray-400 mt-4"
                  placeholder="Enter your 4-digit pin"
                  maxlength="4"
                  readonly
              />
              <label for="pin" class="block text-sm font-medium text-gray-700 mb-1 text-center">Pin Code</label>
              <div class="grid grid-cols-3 gap-2">
                <button
                    v-for="num in 9"
                    :key="num"
                    type="button"
                    class="bg-gray-200 text-gray-900 py-3 rounded-lg hover:bg-gray-300 active:scale-95 transition transform font-semibold"
                    @click="userData.pincode = (userData.pincode + num).slice(0, 4)"
                >
                  {{ num }}
                </button>
                <div></div>
                <button
                    type="button"
                    class="bg-gray-200 text-gray-900 py-3 rounded-lg hover:bg-gray-300 active:scale-95 transition transform font-semibold"
                    @click="userData.pincode = (userData.pincode + 0).slice(0, 4)"
                >
                  0
                </button>
                <div></div>
              </div>
            </div>
          </div>
        </div>
        <button
            type="submit"
            class="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 active:scale-95 transition transform focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 font-semibold"
        >
          Login
        </button>
      </form>
      <p class="text-sm text-center text-gray-600 mt-6">
        Don't have an account?
        <a href="/auth/register" class="text-green-500 hover:underline font-medium">Register</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>