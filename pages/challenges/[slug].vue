<template>
  <div class="flex h-screen">
    <div class="w-3/7 p-4">
      <article class="prose dark:prose-invert">
        <h1>{{ challenge.name }}</h1>
        <p>
          {{ challenge.description }}
        </p>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="md.render(challenge.content)" />
      </article>
    </div>
    <div class="flex flex-col w-4/7 h-full">
      <div class="flex justify-between p-4">
        <h2 class="text-xl font-bold">Code</h2>
        <UButton icon="i-meteor-icons:play" @click="compileCode">
          Compile
        </UButton>
      </div>
  
      <MonacoEditor v-model="value" class="w-full min-h-3/5" :options="{ theme: colorMode.value === 'dark' ? 'vs-dark' : 'vs-light' }" lang="typescript" />
      <div class="overflow-y-auto h-full bg-slate-800 p-2">
        <div class="flex justify-between border border-slate-500 rounded p-2 shadow-lg">
          <h2 class="text-xl font-bold">Result</h2>
          <p v-if="consoleTime > 0" class="text-sm">Time: {{ consoleTime }}ms</p>
        </div>
        <UAlert
          v-for="result in consoleResults" :key="result.test"
          :color="result.check ? 'success' : 'error'"
          :title="result.test"
          :description="result.check ? '' : 'Expected: ' + JSON.stringify(result.esperado) + ' - Got: ' + JSON.stringify(result.obtenido)"
          icon="i-lucide-terminal"
          class="mb-1"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import ts from "typescript";
import type { Challenge, Test, TestResult } from "~/types";
import markdownit from 'markdown-it'
const md = markdownit()
const colorMode = useColorMode();
const route = useRoute();
const challenge = await $fetch<Challenge>(`/api/challenges/${route.params.slug}`);
const value = ref(challenge.scaffold);
const consoleResults = ref<TestResult[]>([]);
const consoleTime = ref(0);

const compileCode = async () => {
  consoleResults.value = [];
  const codigo = ts.transpileModule(value.value, { compilerOptions: { module: ts.ModuleKind.CommonJS }});
  const tests = await $fetch<Test[]>(`/api/challenges/${route.params.slug}/tests`);
  tests.forEach(async (test)=>{
    const codigoTest = `
      ${codigo.outputText}
      return {
        test: '${challenge.funcName}(${test.inputs})',
        esperado: ${test.output},
        obtenido: ${challenge.funcName}(${test.inputs}),
        check: (() => {
          const a = ${challenge.funcName}(${test.inputs});
          const b = ${test.output};
          if(a === b) { return true; }
          if(typeof a !== typeof b) { return false; }
          if(Array.isArray(a) && Array.isArray(b)) {
            if(a.length !== b.length) { return false; }
            for(let i = 0; i < a.length; i++) {
              if(a[i] !== b[i]) { return false; }
            }
            return true;
          }
          return false;
        })()
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
        consoleResults.value.push(resultado);
      }
    } catch (error) {
      consoleResults.value.push({test: '', esperado: '', obtenido: String(error), check: false});
    }  
  })
}
</script>