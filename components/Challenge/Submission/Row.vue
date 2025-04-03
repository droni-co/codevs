<template>
  <div class="flex justify-between items-center p-2 border-b border-slate-500 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
    <div>
      <div class="flex">
        <UAvatar
          :src="props.submission.user.picture"
          :alt="props.submission.user.name"
          size="sm"
          class="mr-2 mb-1"
        />
        <h3 class="font-bold pt-1">{{ submission.user.name }}</h3>
      </div>
      <p class="text-sm text-slate-500 dark:text-slate-400">
        <UIcon name="i-material-symbols:alarm-on-outline-rounded" />
        {{ Math.round(Number(props.submission.complete_time)) }}ms 
        <UIcon name="i-material-symbols:calendar-clock-outline" />
        {{ new Date(submission.created_at).toLocaleString() }}
      </p>
    </div>
    <div class="flex items-center">
      <UButton
        icon="i-material-symbols-light:code-rounded"
        variant="outline"
        class="mr-2 cursor-pointer"
        @click="emitLoadCode('loadCode', submission.code)" />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Submission } from '~/types'
const props = defineProps<{
  submission: Submission
}>()

const emitLoadCode = defineEmits<{
  (e: 'loadCode', code: string): void
}>()
</script>