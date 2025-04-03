<template>
  <div class="flex justify-between items-center p-2 border-b border-slate-500 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
    <div>
      <div class="flex">
        <UAvatar
          :src="props.submission.user.avatar"
          :alt="props.submission.user.name"
          class="mr-2"
        />
        <h3 class="font-bold pt-1">{{ submission.user.name }}</h3>
      </div>
      <p class="text-sm text-slate-500 dark:text-slate-400">
        <UIcon name="i-material-symbols:alarm-on-outline-rounded" />
        {{ props.submission.complete_time }}ms 
      </p>
    </div>
    <div class="flex items-center">
      Botones
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Submission } from '~/types'
const props = defineProps<{
  submission: Submission
}>()
</script>