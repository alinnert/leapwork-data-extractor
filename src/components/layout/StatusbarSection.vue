<script setup lang="ts">
const props = defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="flex items-center gap-x-2 mx-3">
    <div v-if="props.title !== undefined" class="font-bold">{{ props.title }}:</div>
    <slot></slot>
  </div>
</template>
