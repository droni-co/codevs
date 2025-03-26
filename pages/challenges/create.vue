<template>
  <UContainer class="py-4">
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold">Create new challenge</h2>
        </div>
      </template>
      <div class="flex w-full">
        <UForm :schema="schema" :state="newChallenge" class="space-y-4 w-1/2" @submit="onSubmit">
          <UFormField label="Name" name="name">
            <UInput v-model="newChallenge.name" size="xl" class="block" />
          </UFormField>

          <UFormField label="Description" name="description">
            <UTextarea v-model="newChallenge.description" class="block" />
          </UFormField>

          <UFormField label="Content (markdown)" name="content">
            <MonacoEditor v-model="newChallenge.content" class="w-full h-50" :options="{ theme: colorMode.value === 'dark' ? 'vs-dark' : 'vs-light' }" lang="markdown" />
          </UFormField>

          <UFormField label="Boilerplate (typescript)" name="boilerplate">
            <MonacoEditor v-model="newChallenge.boilerplate" class="w-full h-50" :options="{ theme: colorMode.value === 'dark' ? 'vs-dark' : 'vs-light' }" lang="typescript" />
          </UFormField>

          <UFormField label="Level" name="level">
            <USlider :min="0" :max="10" :default-value="5" :step="1" />
          </UFormField>

          <UButton type="submit">
            Create challenge
          </UButton>
        </UForm>
        <div class="w-1/2 p-4">
          <h1 class="text-2xl font-bold">
            {{ newChallenge.name }}
          </h1>
          <p>
            {{ newChallenge.description }}
          </p>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>
<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'
const colorMode = useColorMode();

const schema = v.object({
  name: v.pipe(v.string(), v.minLength(10, 'Must be at least 3 characters')),
  description: v.pipe(v.string(), v.minLength(50, 'Must be at least 50 characters')),
  content: v.pipe(v.string(), v.minLength(50, 'Must be at least 50 characters')),
  boilerplate: v.pipe(v.string(), v.minLength(50, 'Must be at least 50 characters')),
  level: v.number()
})

type Schema = v.InferOutput<typeof schema>

const newChallenge = ref({
  name: '',
  description: '',
  content: '',
  boilerplate: '// typescript function name',
  level: 1
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  console.log(event.data)
}
</script>