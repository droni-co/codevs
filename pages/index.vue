<template>
  <UContainer class="py-4">
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold">Rooms</h2>
          <UButton to="/" icon="i-meteor-icons:plus">
            Create Room
          </UButton>
        </div>
      </template>
      <div v-for="room in rooms" :key="room.id">
        <NuxtLink :to="`/rooms/${room.code}`">
          <h3 class="text-lg font-semibold">{{ room.name }}</h3>
        </NuxtLink>
        <p>{{ room.description }}</p>
      </div>
    </UCard>
  </UContainer>
</template>
<script setup lang="ts">
const rooms = (await useFetch<Room[]>('/api/rooms')).data;
</script>