<template>
  <a-config-provider :theme="theme">
    <NuxtLayout v-if="route.path !== '/login'">
      <NuxtPage />
    </NuxtLayout>
    <NuxtPage v-else />
  </a-config-provider>
</template>

<script setup lang="ts">
import { useRoute } from "nuxt/app";
import { onMounted } from 'vue';
const route = useRoute();  // Nuxt3路由
const router = useRouter();  // Vue3路由

onMounted(() => {
  if (route.path === '/') {
    router.replace('/home');
  }
});

const theme = {
  token: {
    colorPrimary: import.meta.env.VITE_COLOR_PRIMARY,
  },
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>