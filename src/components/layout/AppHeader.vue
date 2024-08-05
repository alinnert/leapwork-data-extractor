<script setup lang="ts">
import AppLogo from './AppLogo.vue'
</script>

<template>
  <header class="header col-span-2 grid grid-cols-[auto,auto,1fr,auto] items-center h-10 drag">
    <AppLogo></AppLogo>

    <div class="flex gap-x-1 no-drag">
      <slot name="primary"></slot>
    </div>

    <div></div>
    
    <div class="flex gap-x-1 pr-2 no-drag">
      <slot name="secondary"></slot>
    </div>
  </header>
</template>

<style>
.header {
  margin-left: env(titlebar-area-x, 0);
  margin-right: calc(100% - env(titlebar-area-x, 0) - env(titlebar-area-width, 0));
}

.drag {
  -webkit-app-region: drag;
  app-region: drag;
}

.no-drag {
  -webkit-app-region: no-drag;
  app-region: no-drag;
}
</style>
