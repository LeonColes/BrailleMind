import type { PersistenceOptions } from 'pinia-plugin-persistedstate'

export const useDarkStore = defineStore('darkMode', () => {
  const darkMode = ref<boolean>(false)
  return { darkMode }
}, {
  persist: {
    key: 'darkMode',
    storage: localStorage,
    paths: ['darkMode'],
  } as PersistenceOptions,
})