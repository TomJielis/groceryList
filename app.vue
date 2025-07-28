<template>
  <div>
    <Navbar />
    <nuxtPage />
  </div>
</template>

<script>

import {useAuth} from "~/composables/useAuth.js";

const {retrieveCsrfToken} = useAuth();
retrieveCsrfToken();

</script>