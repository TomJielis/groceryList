<script setup lang="ts">

import {ref} from "vue";
import {useRoute} from "vue-router";
import {useAuth} from "~/composables/useAuth";

const form = ref({
  token: '',
});

const hasError = ref(false)
const errorText = ref('')
const title = ref('Verify Email');
const body = ref('Verifying your email address...');

const auth = useAuth();
const route = useRoute();

form.value.token = route.params.id as string;


auth.verifyEmail(form.value).then((data:any) => {
  console.log(data);
  title.value = 'Email Verified Successfully'
  body.value = 'Your email has been successfully verified. You can now log in to your account.\n'
  // Redirect to login or home page after successful verification
  // window.location.href = '/login';
}).catch((error) => {
  console.log('hiero')
  title.value = 'Email Verified failed'
  body.value = 'There was an issue verifying your email. Please try again or contact support.'
  hasError.value = true;
  console.log(error);
  errorText.value = error || 'An unexpected error occurred.';

  // Optionally, show an error message to the user
});

</script>

<template>
  <div class="h-[90vh] bg-[#f1fdf3] flex items-center justify-center px-4 text-center">
    <div class="max-w-md w-full bg-white shadow-xl rounded-xl p-8">
      <div class="flex flex-col items-center space-y-4">
        <img
            src="/icons/groceryCart.png"
            alt="Grocery List Logo"
            class="w-14 h-14"
        />
        <h1 class="text-2xl font-bold text-green-600">{{title}}</h1>
        <p class="text-gray-600">
          {{body}}
        </p>

        <p v-if="hasError">
          {{errorText}}
        </p>
        <NuxtLink
            to="/auth/login"
            class="mt-4 bg-green-500 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-green-600 transition"
        >
          Go to Login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>