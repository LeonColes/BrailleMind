<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <a-button type="primary">测试</a-button>
  </div>
</template>

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