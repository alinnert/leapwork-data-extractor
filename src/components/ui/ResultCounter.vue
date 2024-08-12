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
  passed: 'bg-emerald-200 text-emerald-950 border border-emerald-400',
  done: 'bg-amber-200 text-amber-950 border border-amber-400',
  failed: 'bg-rose-200 text-rose-950 border border-rose-400',
  running: 'bg-sky-200 text-sky-950 border border-sky-400',
}

const percentage = computed(() => getPercent(props.total, props.count))

const label = computed(() => {
  return `${props.count} ${wording[props.type]} (${percentage.value})`
})
</script>

<template>
  <div class="rounded px-2 py-0.5" :class="classNames[type]" v-if="count > 0">{{ label }}</div>
</template>
