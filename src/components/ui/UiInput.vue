<script setup lang="ts">
const model = defineModel({ type: String })
</script>

<template>
  <input class="input" v-model="model" />
</template>

<style scoped>
.input {
  @apply rounded text-stone-700 border border-stone-400 border-b-stone-800 px-1.5 py-0.5 outline-none;

  &:focus {
    @apply border-stone-800;
  }
}
</style>
