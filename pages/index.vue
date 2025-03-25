<template>
  <div>
    <h1>Home Page</h1>
    <UAlert title="Heads up!" />
    You are currently {{ status }}.
    <button @click="signIn">Sign In</button>
    <button @click="signOut">Sign Out</button>
  </div>
</template>
<script setup lang="ts">
const { status, signIn, signOut } = useAuth()
</script>