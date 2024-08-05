<script setup lang="ts">
const model = defineModel({ type: String })
</script>

<template>
  <textarea
    v-model="model"
    class="rounded outline-none px-2 py-1 text-xs font-mono placeholder:text-base shadow-lg"
  />
</template>
