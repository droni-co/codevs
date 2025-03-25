<template>
  <div class="p-2 h-full flex flex-col justify-between">
      <div>
        <UButtonGroup class="w-full">
          <UButton color="neutral" variant="subtle" label="Button" class="grow">
            <UAvatar :src="data.user.image" />
            {{ data?.user?.name }}
          </UButton>
          <UButton color="neutral" variant="outline" icon="i-meteor-icons:power"  @click="signOut" />
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
const { signOut, data } = useAuth()
const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});
</script>