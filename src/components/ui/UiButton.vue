<script setup lang="ts">
import type { Component } from 'vue'

const props = withDefaults(defineProps<{ icon?: Component; dark?: boolean }>(), { dark: false })
</script>

<template>
  <button class="button" :class="{ light: !props.dark, dark: props.dark }">
    <div class="icon" v-if="props.icon !== undefined">
      <component :is="props.icon" class="size-4"></component>
    </div>
    <slot></slot>
  </button>
</template>

<style scoped>
.button {
  @apply flex items-center text-sm border rounded px-2 py-1 select-none;

  &.light {
    @apply border-black/20 border-b-black/65 bg-black/10 text-black/80;

    &:disabled {
      @apply border-transparent bg-white/20 text-black/50;
    }

    &:not(:disabled):hover {
      @apply bg-black/20;
    }

    &:not(:disabled):active {
      @apply bg-black/30 border-black/75;
    }
  }

  &.dark {
    @apply border-black/20 border-b-black/80 bg-black/20 text-white;

    &:disabled {
      @apply border-transparent bg-white/20 text-black/50;
    }

    &:not(:disabled):hover {
      @apply bg-black/30;
    }

    &:not(:disabled):active {
      @apply bg-black/40 border-black/75;
    }
  }
}

.icon {
  @apply mr-2;
}
</style>
