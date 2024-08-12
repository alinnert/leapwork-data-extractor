<script setup lang="ts">
import AppLogo from './AppLogo.vue'
</script>

<template>
  <div class="col-span-2">
    <header
      class="bg-theme-600"
    >
      <div class="titlebar grid grid-cols-[auto,auto,1fr,auto] items-center h-10 drag text-white text-sm">
        <AppLogo></AppLogo>

        <div class="flex gap-x-1 no-drag">
          <slot name="primary"></slot>
        </div>

        <div></div>

        <div class="flex gap-x-1 pr-2 no-drag">
          <slot name="secondary"></slot>
        </div>
      </div>
    </header>

    <div>
      <slot name="toolbars"></slot>
    </div>
  </div>
</template>

<style>
.titlebar {
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
