<template>
  <div class="flex h-screen">
    <div class="w-3/7 p-4">
      <h1 class="text-2xl">{{ challenge.name }}</h1>
      <p class="text-sm">{{ challenge.description }}</p>
      <article class="prose dark:prose-invert">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="md.render(challenge.content)" />
      </article>
      <div v-if="submissions.length > 0">
        <ChallengeSubmissionRow
          v-for="submission in submissions"
          :key="submission.id"
          :submission="submission"
          :challenge="challenge"
          @load-code="loadCode" />
      </div>
    </div>
    <div class="flex flex-col w-4/7 h-full">
      <div class="flex justify-between p-4">
        <h2 class="text-xl font-bold">Código</h2>
        <UButton icon="i-meteor-icons:play" @click="compileCode">
          Compile
        </UButton>
      </div>
  
      <MonacoEditor
        v-model="value"
        class="w-full"
        :class="{ 'h-1/2': consoleResults.length > 0, 'h-full': consoleResults.length === 0 }"
        :options="{ theme: colorMode.value === 'dark' ? 'vs-dark' : 'vs-light' }"
        lang="typescript" />
      <div class="overflow-y-auto bg-slate-100 dark:bg-slate-800 p-2" :class="{ 'h-1/2': consoleResults.length > 0 }">
        <div class="flex justify-between border border-slate-500 rounded p-2 shadow-lg mb-2">
          <div>
            <h2 class="font-bold">Resultado de los tests</h2>
            <p v-if="consoleTime > 0" class="text-sm">
              <UIcon name="i-material-symbols:alarm-on-outline-rounded" />
              {{ Math.round(consoleTime) }}ms 
              <UIcon name="lucide:test-tubes" />
              {{ consoleResults.length }} tests
            </p>
          </div>
          <div>
            <UButton
              v-if="checkResult() && !isSubmissionCode"
              icon="i-mdi-light:content-save"
              @click="saveResult"
            >
              Guardar
            </UButton>
          </div>
        </div>
        <UAlert
          v-for="(result, index) in consoleResults" :key="index"
          :color="result.check ? 'success' : 'error'"
          variant="outline"
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
import type { Challenge, Test, TestResult, Submission } from "~/types";
import markdownit from 'markdown-it'
import { ChallengeSubmissionRow } from "#components";
const { status: authStatus } = useAuth()
const toast = useToast()
const md = markdownit()
const colorMode = useColorMode();
const route = useRoute();
const challenge = await $fetch<Challenge>(`/api/challenges/${route.params.slug}`);
const tests = await $fetch<Test[]>(`/api/challenges/${route.params.slug}/tests`);
const submissions = ref<Submission[]>([]);
const value = ref(challenge.scaffold);
const consoleResults = ref<TestResult[]>([]);
const consoleTime = ref(0);
const isSubmissionCode = ref(false);

const compileCode = async () => {
  consoleResults.value = [];
  const codigo = ts.transpileModule(value.value, { compilerOptions: { module: ts.ModuleKind.CommonJS }});
  const inicio = performance.now();
  for (const test of tests) {
    let breakProccess = false;
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
      
      const resultado = await funcionEjecutable();
      if(resultado !== undefined){
        consoleResults.value.push(resultado);
        breakProccess = !resultado.check;
      }
    } catch (error) {
      consoleResults.value.push({test: '', esperado: '', obtenido: String(error), check: false});
      breakProccess = true;
    }
    if(breakProccess) {
      break;
    }
  }
  const fin = performance.now();
  consoleTime.value = fin - inicio;
}

const checkResult = () => {
  if(consoleResults.value.length === tests.length && authStatus.value === 'authenticated') {
    consoleResults.value.find((result) => !result.check);
    return true;
  }
  return false;
}

const getSubmissions = async () => {
  if(authStatus.value === 'authenticated') {
    submissions.value = await $fetch<Submission[]>(`/api/challenges/${route.params.slug}/submissions`);
  }
}
getSubmissions()

const saveResult = () => {
  if(checkResult()) {
    $fetch(`/api/challenges/${challenge.slug}/submissions`, {
      method: 'POST',
      body: {
        challengeId: challenge.id,
        code: value.value,
        complete_time: consoleTime.value
      }
    }).then(() => {
      toast.add({
        title: 'Success',
        description: 'Se ha guardado el resultado.',
        color: 'success'
      })
      getSubmissions()
    }).catch(() => {
      toast.add({
        title: 'Error',
        description: 'Un error ha ocurrido al guardar el resultado.',
        color: 'error'
      })
    })
  }
}

const loadCode = (code: string) => {
  isSubmissionCode.value = true;
  value.value = code;
}

</script>