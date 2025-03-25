// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@sidebase/nuxt-auth'
  ],
  css: ['assets/css/main.css'],
  auth: {
    globalAppMiddleware: true,
    isEnabled: true,
    baseURL: '/api/auth',
  },
  runtimeConfig: {
    googleClientId: 'YOUR_GOOGLE_CLIENT_ID',
    googleClientSecret: 'YOUR_GOOGLE'
  },
})