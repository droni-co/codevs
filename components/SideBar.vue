<template>
  <div class="p-2 h-full flex flex-col justify-between">
    <div>
      <UButtonGroup v-if="data?.user" class="w-full mb-2">
        <UButton color="neutral" variant="subtle" label="Button" class="grow">
          <UAvatar :src="data.user.image ?? ''" class="mr-2" />
          {{ data.user.name }}
        </UButton>
        <UButton color="neutral" variant="outline" icon="i-meteor-icons:power" @click="logout" />
      </UButtonGroup>
      <UButton v-else color="info" variant="subtle" label="Button" block icon="i-material-symbols-light:other-houses-outline" @click="signIn('google')">
        Ingresa con Google
      </UButton>
      <UButtonGroup class="w-full mb-2" orientation="vertical">
        <UButton to="/" color="neutral" block variant="outline" icon="i-material-symbols-light:other-houses-outline">
          Inicio
        </UButton>
        <UButton to="/" color="neutral" block variant="outline" icon="i-mdi:code-block-parentheses">
          Desafios
        </UButton>
      </UButtonGroup>
    </div>
    <ClientOnly v-if="!colorMode?.forced">
      <UButton color="neutral" variant="outline" :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'" @click="isDark = !isDark">
        Color mode: {{ isDark ? 'Dark' : 'Light' }}
      </UButton>
    </ClientOnly>
  </div>
</template>
<script setup lang="ts">
const { signIn, signOut, data } = useAuth()
const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});

const logout = () => {
  signOut()
}
</script>