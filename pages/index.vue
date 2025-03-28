<template>
  <UContainer class="py-4">
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-semibold">Challenges</h2>
      <UButton to="/challenges/create" icon="i-meteor-icons:plus">
        Create challenge
      </UButton>
    </div>
    <div class="grid grid-cols-3 gap-4 mt-4">
      <UCard v-for="challenge in challenges" :key="challenge.id">
        <NuxtLink :to="`/challenges/${challenge.slug}`">
          <h3 class="text-lg font-semibold">{{ challenge.name }}</h3>
        </NuxtLink>
        <p class="text-sm">{{ challenge.description }}</p>
      </UCard>
    </div>
  </UContainer>
</template>
<script setup lang="ts">
import type { Challenge } from '~/types';
const challenges = await $fetch<Challenge[]>('/api/challenges');
</script>