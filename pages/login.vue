<template>
  <div>
    <button v-for="provider in providers" :key="provider.id" @click="signIn(provider.id)">
      Sign in with {{ provider.name }} {{ provider.id }}
    </button>  
  </div>
</template>

<script setup lang="ts">
// Remember to disable the middleware protection from your page!
definePageMeta({
  auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/' },
  layout: 'blank'
})

const { signIn, getProviders } = useAuth()
const providers = await getProviders()
</script>