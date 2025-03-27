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
            <UFormField label="Casos de prueba" name="tests" description="Agrega diferentes test con sus entradas y salidas esperadas para poder validar el cumplimiento del reto." class="mb-4">
              <UButtonGroup>
                <UInput v-model="newTestCase.name" placeholder="Nombre del test" />
                <UBadge color="neutral" variant="outline" size="lg" label="Entrada" />
                <UInput v-model="newTestCase.inputs" placeholder="parametros" />
                <UBadge color="neutral" variant="outline" size="lg" label="Salida:" />
                <UInput v-model="newTestCase.output" placeholder="valor" />
                <UButton icon="i-meteor-icons:plus" variant="outline" @click="addTest">
                  Agregar
                </UButton>
              </UButtonGroup>
            </UFormField>
            <div class="flex flex-col">
              <div v-for="(test, index) in newChallenge.tests" :key="test.id" class="flex gap-2 items-center border border-slate-500 rounded p-2 shadow-lg">
                <div class="grow">
                  <h2 class="text-secondary">{{ test.name }}</h2>
                  <UButtonGroup class="grow">
                    <UBadge color="neutral" variant="outline" :label="'Entrada: ' + test.inputs" />
                    <UBadge color="neutral" variant="outline" :label="'Salida: ' + test.output" />
                  </UButtonGroup>
                </div>
                <code class="grow text-end">{{ newChallenge.funcName }}({{ test.inputs }}) === {{ test.output }}</code>
                <UButton icon="i-meteor-icons:trash" variant="outline" @click="removeTest(index)" />
              </div>
            </div>
            <pre>
              {{ newChallenge.scaffold }}
            </pre>
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
import type { Challenge, Test } from '~/types';
definePageMeta({
  middleware: 'sidebase-auth'
})
const colorMode = useColorMode();

const schema = v.object({
  name: v.pipe(v.string(), v.minLength(10, 'Debe ser al menos 10 caracteres')),
  description: v.pipe(v.string(), v.minLength(50, 'Debe ser al menos 50 caracteres')),
  content: v.pipe(v.string(), v.minLength(50, 'Debe ser al menos 50 caracteres')),
  funcName: v.pipe(v.string(), v.minLength(5, 'Debe ser al menos 5 caracteres'), v.regex(/^[a-zA-Z]+$/, 'Solo se permiten caracteres alfabéticos')),
  level: v.number(),
  scaffold: v.string(),
  tests: v.pipe(
    v.array(v.object({
      name: v.string(),
      inputs: v.string(),
      output: v.string()
    })),
    v.minLength(5, 'Debe tener al menos 5 casos de prueba')
  ),
})

type Schema = v.InferOutput<typeof schema>

const newChallenge:Ref<Challenge> = ref({
  id: '',
  slug: '',
  name: '',
  description: '',
  content: '# ejemplos\n > Describe las caracteristicas del reto y algunos ejemplos para tener como referencia\n```\n  Inputs: [0,1,2,3], 5\n  Output: [2,3] \n```',
  funcName: '',
  level: 1,
  scaffold: '',
  tests: [],
  created_at: new Date(),
  userId: ''
})

const newTestCase:Ref<Test> = ref({
  id: '',
  challengeId: '',
  name: '',
  inputs: '',
  output: '',
})

const addTest = () => {
  if(!newChallenge.value.tests) return;
  newChallenge.value.tests.push(newTestCase.value)
  newTestCase.value = {
    id: '',
    challengeId: '',
    name: '',
    inputs: '',
    output: ''
  }
  scaffold()
}
const removeTest = (index: number) => {
  if(!newChallenge.value.tests) return;
  newChallenge.value.tests.splice(index, 1)
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
  const firstTest = (newChallenge.value.tests ?? [])[0] ?? null
  let inputs = ''
  let output = 'null'
  let outputType = ''
  if(firstTest) {
    console.log(firstTest.inputs)
    firstTest.inputs.split(',').forEach((input, index) => {
      inputs += `param${index + 1}: ${determinarTipo(input)}, `
      output = firstTest.output
      outputType = `: ${determinarTipo(firstTest.output)}`
    })
  }
  newChallenge.value.scaffold = ` // Scaffold funcction, start here!
  function ${newChallenge.value.funcName}(${inputs.slice(0, -2)})${outputType} {
    /* Make your magic here */
    return ${output};
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

const determinarTipo = (srt:string) => {
  try {
    const valor = JSON.parse(srt);
    if (Array.isArray(valor)) { return 'array'; }
    if (valor === null) { return 'object'; }
    return typeof valor;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    // Si JSON.parse falla, asumimos que es una cadena
    return 'string';
  }
}
</script>