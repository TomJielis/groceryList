<script setup lang="ts">
import { ref } from "vue";
import { useCards } from "~/composables/useCards"; // werkt in Nuxt
import {useRouter} from "vue-router";
const formData = ref({
  title: "",
  attachment: null as File | null,
});

const { storeCard , getCards} = useCards();
const router = useRouter();
function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    formData.value.attachment = target.files[0];
  }
}

function handleSubmit() {
  if (!formData.value.attachment) return;

  const reader = new FileReader();
  reader.onload = async () => {
    const base64 = reader.result as string;

    storeCard({
      title: formData.value.title,
      attachment: base64,
    });

    // Reset form
    formData.value = {
      title: "",
      attachment: null,
    };

    await getCards();
    router.push('/cards/');
  };
  reader.readAsDataURL(formData.value.attachment);
}
</script>
<template>
  <div class="h-[90vh]">
    <form @submit.prevent="handleSubmit" class="space-y-4 p-4">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700">Titel</label>
        <input
            v-model="formData.title"
            type="text"
            id="title"
            required
            class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base sm:text-lg"
        />
      </div>
      <div>
        <label for="attachment" class="block text-sm font-medium text-gray-700">Bijlage</label>
        <input
            @change="handleFileChange"
            type="file"
            id="attachment"
            required
            class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base sm:text-lg"
        />
      </div>
      <button
          type="submit"
          class="w-full py-3 rounded-xl bg-blue-600 text-white font-medium text-base hover:bg-blue-700 transition"
      >
        Save
      </button>
    </form>
  </div>
</template>