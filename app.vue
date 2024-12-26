<template>
  <a-config-provider :theme="theme">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </a-config-provider>
</template>

<script setup lang="ts">

const appConfig = useAppConfig()

const theme = ref({
  token: {
    colorPrimary: appConfig.theme.primaryColor,
  },
});
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  /* overflow: hidden; */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
}
</style>