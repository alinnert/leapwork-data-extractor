<script setup lang="ts">
const model = defineModel({ type: String })
</script>

<template>
  <textarea
    v-model="model"
    class="rounded outline-none px-2 py-1 text-[0.66rem] leading-tight font-mono placeholder:text-base border border-stone-300 focus:outline-2 focus:outline-offset-0 focus:outline-black/20"
  />
</template>
