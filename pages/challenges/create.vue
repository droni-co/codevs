<template>
  <UContainer class="py-4">
    <UForm :schema="schema" :state="newChallenge" @submit="saveChallenge">
      <UStepper ref="stepper" :items="items">
        <template #content="{ item }">
          <div v-if="item.slot === 'info'">
            <UFormField label="Nombre del desafío" name="name" class="mb-4" required>
              <UInput v-model="newChallenge.name" size="xl" class="block" placeholder="ej. Suma de dos números" />
            </UFormField>

            <UFormField label="Descripción" name="description" class="mb-4" required>
              <UTextarea v-model="newChallenge.description" class="block" placeholder="ej. Dado un array de enteros y un objetivo crear una funcion que retorne los indices de dos números que sumados de como reusltado el objetivo. " />
            </UFormField>

            <UFormField label="Instrucciones del desafío" name="content" description="Definiciones del reto y ejemplos para tener como referencia en formato Markdown" class="mb-4" required>
              <MonacoEditor v-model="newChallenge.content" class="w-full h-50" :options="{ theme: colorMode.value === 'dark' ? 'vs-dark' : 'vs-light', minimap: { enabled: false }, wordWrap: 'on', tabSize: 2, autoIndent: 'brackets' }" lang="markdown" />
            </UFormField>

            <UFormField label="Complejidad" name="level" class="mb-4">
              <USlider :min="0" :max="10" :default-value="5" :step="1" />
            </UFormField>
          </div>
          <div v-else-if="item.slot === 'testing'">
            <UFormField label="Nombre de la funcion" name="funcName" description="Función que se evaluara en pruebas ej. sumaDosNumeros." class="mb-4" required>
              <UInput v-model="newChallenge.funcName" class="block" placeholder="sumaDosNumeros" @change="scaffold()" />
            </UFormField>
            <h2 class="text-lg mb-4">Tests</h2>
            <UFormField label="Casos de prueba" description="Agrega diferentes test con sus entradas y salidas esperadas para poder validar el cumplimiento del reto." class="mb-4">
              <UButtonGroup>
                <UBadge color="neutral" variant="outline" size="lg" label="Entrada" />
                <UInput v-model="newTestCase.inputs" placeholder="parametros" />
                <UBadge color="neutral" variant="outline" size="lg" label="salida:" />
                <UInput v-model="newTestCase.output" placeholder="valor" />
                <UButton icon="i-meteor-icons:plus" variant="outline" @click="addTest">
                  Agregar
                </UButton>
              </UButtonGroup>
            </UFormField>
            {{ newChallenge.tests }}
          </div>
          <div v-else-if="item.slot === 'scaffold'">
            <MonacoEditor v-model="newChallenge.scaffold" class="w-full h-50" :options="{ theme: colorMode.value === 'dark' ? 'vs-dark' : 'vs-light', minimap: { enabled: false }, wordWrap: 'on', tabSize: 2, autoIndent: 'brackets', readOnly: true }" lang="typescript" />

            <UButton type="submit" class="mt-4">
              Crear desafío
            </UButton>
          </div>
        </template>
      </UStepper>

      <div class="flex gap-2 justify-between mt-4">
        <UButton
          leading-icon="i-lucide-arrow-left"
          :disabled="!stepper?.hasPrev"
          @click="stepper?.prev()"
        >
          Anterior
        </UButton>

        <UButton
          trailing-icon="i-lucide-arrow-right"
          :disabled="!stepper?.hasNext"
          @click="stepper?.next()"
        >
          Siguiente
        </UButton>
      </div>
    </UForm>
  </UContainer>
</template>
<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent, StepperItem } from '@nuxt/ui'
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
  level: 1,
  scaffold: '',
  tests: []
})

const newTestCase = ref({
  inputs: '',
  output: '',
})

const addTest = () => {
  newChallenge.value.tests.push(newTestCase.value)
  newTestCase.value = {
    inputs: '',
    output: ''
  }
}

const toast = useToast()
async function saveChallenge(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  // $fetch('/api/challenges', {
  //   method: 'POST',
  //   body: event.data
  // })
  console.log(event.data)
}

const scaffold = () => {
  newChallenge.value.scaffold = ` // Scaffold funcction, start here!
  function ${newChallenge.value.funcName}() {
    return null;
  }
  `
}
const stepper = useTemplateRef('stepper')
const items = ref<StepperItem[]>([
  {
    slot: 'info',
    title: 'Definiciones',
    description: 'Agrega información sobre el desafío',
    icon: 'i-material-symbols:chat-info-outline-rounded'
  },
  {
    slot: 'testing',
    title: 'Testing',
    description: 'Configura las entradas y salidas esperadas',
    icon: 'i-qlementine-icons:test-16'
  },
  {
    slot: 'scaffold',
    title: 'Scaffold',
    description: 'Crea la función base para el desafío',
    icon: 'i-material-symbols:code-rounded'
  }
])
</script>