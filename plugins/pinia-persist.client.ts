import { defineNuxtPlugin } from '#app'
import type { Pinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin((nuxtApp) => {
  // nuxtApp.$pinia 就是自动创建好的 Pinia 实例
  (nuxtApp.$pinia as Pinia).use(piniaPluginPersistedstate)
})