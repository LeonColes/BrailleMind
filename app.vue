<template>
  <a-config-provider :theme="theme">
    <NuxtLayout v-if="route.path !== '/login'" />
    <NuxtPage v-else />
  </a-config-provider>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "nuxt/app";
import { onMounted, ref } from 'vue';

const route = useRoute();  // Nuxt3路由
const router = useRouter();  // Vue3路由
const config = useRuntimeConfig(); // 运行时配置
const theme = ref({
  token: {
    colorPrimary: config.public.colorPrimary,
  },
});

onMounted(() => {
  if(route.path === '/') router.replace('/home');
});
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
}
</style>