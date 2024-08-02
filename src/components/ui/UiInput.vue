<script setup lang="ts">
const model = defineModel()
</script>

<template>
  <input class="input" v-model="model">
</template>

<style scoped>
.input {
  @apply rounded bg-theme-100 text-theme-900 border border-theme-900 px-1.5 py-1 outline-none;

  &:hover {
    @apply bg-theme-50;
  }
  
  &:focus {
    @apply bg-theme-50;
  }
}
</style>