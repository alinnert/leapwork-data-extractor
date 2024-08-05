<script setup lang="ts">
import { getPercent } from '@/lib/getPercentage.js'
import { computed } from 'vue'

const props = defineProps<{
  type: 'passed' | 'done' | 'failed' | 'running'
  count: number
  total: number
}>()

const wording: Record<typeof props.type, string> = {
  passed: 'erfolgreich',
  done: 'beendet',
  failed: 'fehlgeschlagen',
  running: 'laufend',
}

const classNames: Record<typeof props.type, string> = {
  passed: 'bg-emerald-700 border border-emerald-950 text-emerald-100',
  done: 'bg-amber-700 border border-amber-950 text-amber-100',
  failed: 'bg-rose-700 border border-rose-950 text-rose-100',
  running: 'bg-sky-700 border border-sky-950 text-sky-100',
}

const percentage = computed(() => getPercent(props.total, props.count))

const label = computed(() => {
  return `${props.count} ${wording[props.type]} (${percentage.value})`
})
</script>

<template>
  <div class="rounded px-2 py-0.5" :class="classNames[type]" v-if="count > 0">{{ label }}</div>
</template>
