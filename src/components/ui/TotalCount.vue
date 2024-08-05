<script setup lang="ts">
defineProps<{ count: number }>()
</script>

<template>
  <div>{{ count }} {{ count === 1 ? 'Testlauf' : 'Testläufe' }}</div>
</template>
