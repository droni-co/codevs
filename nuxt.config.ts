// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  sourcemap: false,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@sidebase/nuxt-auth',
    'nuxt-monaco-editor',
    '@prisma/nuxt'
  ],
  css: ['assets/css/main.css'],
  app: {
    head: {
      title: 'Codev | Desafios de programación js', // default fallback title
      htmlAttrs: {
        lang: 'es',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ]
    }
  },
  auth: {},
  runtimeConfig: {
    googleClientId: 'YOUR_GOOGLE_CLIENT_ID',
    googleClientSecret: 'YOUR_GOOGLE'
  },
  monacoEditor: {
    // These are default values:
    locale: 'en',
    componentName: {
      codeEditor: 'MonacoEditor',
      diffEditor: 'MonacoDiffEditor'
    }
  },
  vite: {
    resolve: {
      alias: {
        '.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js',
      },
    },
  }
})