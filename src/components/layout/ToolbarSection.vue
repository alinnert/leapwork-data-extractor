<script setup lang="ts">
const props = defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="flex items-center gap-x-1 mx-2 text-sm">
    <div v-if="props.title !== undefined" class="font-bold select-none mx-2">{{ props.title }}:</div>
    <slot></slot>
  </div>
</template>
