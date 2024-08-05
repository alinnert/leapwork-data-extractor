<script setup lang="ts">
defineProps<{ passed: number; done: number; failed: number }>()
</script>

<template>
  <div
    class="grid items-stretch w-80 h-4 rounded overflow-hidden border border-theme-700 mx-4"
    :style="{
      gridTemplateColumns: `${passed}fr ${done}fr ${failed}fr`,
    }"
  >
    <div class="bg-emerald-500"></div>
    <div class="bg-amber-600"></div>
    <div class="bg-rose-600"></div>
  </div>
</template>
