<template>
  <UContainer class="py-4">
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold">Challenges</h2>
          <UButton to="/challenges/create" icon="i-meteor-icons:plus">
            Create challenge
          </UButton>
        </div>
      </template>
      <div v-for="challenge in challenges" :key="challenge.id">
        <NuxtLink :to="`/challenges/${challenge.slug}`">
          <h3 class="text-lg font-semibold">{{ challenge.name }}</h3>
        </NuxtLink>
        <p>{{ challenge.description }}</p>
      </div>
    </UCard>
  </UContainer>
</template>
<script setup lang="ts">
const challenges = (await useFetch<Challenge[]>('/api/challenges')).data;
</script>