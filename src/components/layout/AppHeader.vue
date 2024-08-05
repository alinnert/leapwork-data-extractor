<script setup lang="ts">
import AppLogo from './AppLogo.vue'
</script>

<template>
  <header class="col-span-2 grid grid-cols-[auto,auto,1fr,auto] items-center px-0 h-10">
    <AppLogo></AppLogo>

    <div class="flex gap-x-1">
      <slot name="primary"></slot>
    </div>
    <div class="flex gap-x-1 pr-2">
      <slot name="secondary"></slot>
    </div>
  </header>
</template>
