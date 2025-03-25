<template>
  <UApp locale="es" class="h-screen">
    <button
      data-drawer-target="default-sidebar"
      data-drawer-toggle="default-sidebar"
      aria-controls="default-sidebar"
      type="button"
      class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
    >
      <span class="sr-only">Open sidebar</span>
      <UIcon name="i-meteor-icons:bars" class="size-5" />
    </button>

    <aside
      id="default-sidebar"
      class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 shadow-lg bg-white dark:bg-gray-800"
      aria-label="Sidebar"
    >
      <SideBar />
    </aside>
    <div class="sm:ml-64">
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </div>
  </UApp>
</template>