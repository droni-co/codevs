<template>
  <div>
    <h1>Room: {{ route.params.code }}</h1>
    {{ room }}
  </div>
</template>
<script setup lang="ts">
const route = useRoute();

const room = (await useFetch<Room>(`/api/rooms/${route.params.code}`)).data;
</script>