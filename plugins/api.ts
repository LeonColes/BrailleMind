export default defineNuxtPlugin((nuxtApp) => {
  const token = useCookie('token').value;


  const api = $fetch.create({
    baseURL: 'https://api.nuxt.com',
    onRequest({ request, options, error }) {
      if (token) {
        // note that this relies on ofetch >= 1.4.0 - you may need to refresh your lockfile
        options.headers.set('Authorization', `Bearer ${token}`)
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        await nuxtApp.runWithContext(() => navigateTo('/login'))
      }
    }
  })

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api
    }
  }
})