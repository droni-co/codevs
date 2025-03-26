<template>
  <div class="flex h-screen">
    <div class="w-1/2 p-4">
      <h1 class="text-2xl font-bold">
        {{ challenge.name }}
      </h1>
      <p>
        {{ challenge.description }}
      </p>
      {{ challenge.content }}
      <p>
        <strong>Code:</strong> {{ challenge.slug }}
      </p>
    </div>
    <div class="flex flex-col w-full h-full">
      <div class="flex justify-between p-4">
        <h2 class="text-xl font-bold">Code</h2>
        <UButton icon="i-meteor-icons:play" @click="compileCode">
          Compile
        </UButton>
      </div>
  
      <MonacoEditor v-model="value" class="w-full h-full" :options="{ theme: colorMode.value === 'dark' ? 'vs-dark' : 'vs-light' }" lang="typescript" />
      <div class="p-3 pb-10 h-100 overflow-y-auto">
        <div class="flex justify-between">
          <h2 class="text-xl font-bold">Result</h2>
          <p v-if="consoleTime > 0" class="text-sm">Time: {{ consoleTime }}ms</p>
        </div>
        <pre>{{ consoleResult }}</pre>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import ts from "typescript";
import type { Challenge } from "~/types";
const colorMode = useColorMode();
const route = useRoute();
const challenge = await $fetch<Challenge>(`/api/challenges/${route.params.slug}`);
const value = ref(`
function ${challenge.funcName}() {
  return null;
}
`);
const consoleResult = ref('');
const consoleTime = ref(0);


console.log(challenge);


const compileCode = async () => {
  consoleResult.value = '';
  const codigo = ts.transpileModule(value.value, { compilerOptions: { module: ts.ModuleKind.CommonJS }});

  const codigoTest = `
    ${codigo.outputText}
    return {
      test: 'Suma de 1 + 2',
      esperado: 3,
      obtenido: ${challenge.funcName}(1, 2),
      check: ${challenge.funcName}(1, 2) === 3
    }
  `;
  try {
    // Usando Function, para mas seguridad.
    const funcionEjecutable = new Function(codigoTest);
    const inicio = performance.now();
    const resultado = await funcionEjecutable();
    const fin = performance.now();
    consoleTime.value = fin - inicio;
    if(resultado !== undefined){
      console.log(resultado);
      consoleResult.value = resultado;
    }
  } catch (error) {
    consoleResult.value = "Error: " + error;
  }
  
}
</script>