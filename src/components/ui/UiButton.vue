<script setup lang="ts">
import type { Component } from 'vue'

const props = defineProps<{ icon?: Component }>()
</script>

<template>
  <button class="button">
    <div class="icon" v-if="props.icon !== undefined">
      <component :is="props.icon" class="size-4"></component>
    </div>
    <slot></slot>
  </button>
</template>

<style scoped>
.button {
  @apply flex items-center text-sm border border-theme-700 border-b-theme-900 rounded bg-black/20 text-white px-2 py-1 select-none;

  &:disabled {
    @apply border-theme-600 bg-theme-500 text-theme-200;
  }

  &:not(:disabled):hover {
    @apply bg-black/30 border-theme-800 border-b-theme-950;
  }

  &:not(:disabled):active {
    @apply bg-black/40 border-theme-900;
  }
}

.icon {
  @apply mr-2;
}
</style>
