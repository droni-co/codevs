<template>
  <UContainer class="py-4">
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold">Create new challenge</h2>
        </div>
      </template>
      <div class="flex w-full">
        <UForm :schema="schema" :state="newChallenge" class="space-y-4 w-1/2" @submit="saveChallenge">
          <UFormField label="Name" name="name" required>
            <UInput v-model="newChallenge.name" size="xl" class="block" placeholder="ej. Suma de dos números" />
          </UFormField>

          <UFormField label="Function name" name="funcName" description="Nombre de la funcion que se evaluara en pruebas ej. sumaDosNumeros." required>
            <UInput v-model="newChallenge.funcName" class="block" placeholder="sumaDosNumeros" />
          </UFormField>

          <UFormField label="Description" name="description" required>
            <UTextarea v-model="newChallenge.description" class="block" placeholder="ej. Dado un array de enteros y un objetivo crear una funcion que retorne los indices de dos números que sumados de como reusltado el objetivo. " />
          </UFormField>

          <UFormField label="Content" name="content" description="Definiciones del reto y ejemplos para tener como referencia en formato Markdown" required>
            <MonacoEditor v-model="newChallenge.content" class="w-full h-50" :options="{ theme: colorMode.value === 'dark' ? 'vs-dark' : 'vs-light', minimap: { enabled: false }, wordWrap: 'on', tabSize: 2, autoIndent: 'brackets' }" lang="markdown" />
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
definePageMeta({
  middleware: 'sidebase-auth'
})
const colorMode = useColorMode();

const schema = v.object({
  name: v.pipe(v.string(), v.minLength(10, 'Debe ser al menos 10 caracteres')),
  description: v.pipe(v.string(), v.minLength(50, 'Debe ser al menos 50 caracteres')),
  content: v.pipe(v.string(), v.minLength(50, 'Debe ser al menos 50 caracteres')),
  funcName: v.pipe(v.string(), v.minLength(5, 'Debe ser al menos 5 caracteres'), v.regex(/^[a-zA-Z]+$/, 'Solo se permiten caracteres alfabéticos')),
  level: v.number()
})

type Schema = v.InferOutput<typeof schema>

const newChallenge = ref({
  name: '',
  description: '',
  content: '# ejemplos\n > Describe las caracteristicas del reto y algunos ejemplos para tener como referencia\n```\n  Inputs: [0,1,2,3], 5\n  Output: [2,3] \n```',
  funcName: '',
  level: 1
})

const toast = useToast()
async function saveChallenge(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  $fetch('/api/challenges', {
    method: 'POST',
    body: event.data
  })
}
</script>