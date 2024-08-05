<script setup lang="ts">
import { getPercent } from '@/lib/getPercentage.js'
import { ClockIcon, DocumentDuplicateIcon } from '@heroicons/vue/16/solid'
import { computed } from 'vue'
import StatusbarSection from '../layout/StatusbarSection.vue'
import UiButton from '../ui/UiButton.vue'
import UiOutput from '../ui/UiOutput.vue'

const props = defineProps<{
  passedCount: number
  totalCount: number
  date: string | undefined
  branchName: string
}>()

const passedPercentage = computed(() => getPercent(props.totalCount, props.passedCount))

const dateOfFirstRow = computed((): { day: string; month: string; year: string } | null => {
  if (props.totalCount === 0) return null
  if (props.date === undefined) return null
  const match = props.date.match(/^(\d\d)\.(\d\d)\.(\d\d\d\d)$/)
  if (match === null) return null
  const [, day, month, year] = match
  return { day, month, year }
})

const confluenceHeadlineDate = computed((): string | null => {
  if (dateOfFirstRow.value === null) return '-'
  const { day, month, year } = dateOfFirstRow.value
  return `${year}-${month}-${day}`
})

const confluenceHeadlineBranchSuffix = computed((): string => {
  return props.branchName.trim() !== '' ? ` - ${props.branchName}` : ''
})

const confluenceHeadline = computed((): string => {
  if (confluenceHeadlineDate.value === null || props.totalCount === 0) {
    return '-'
  }

  const crownSuffix = props.passedCount === props.totalCount ? ' - 👑' : ''
  return `${confluenceHeadlineDate.value} ${passedPercentage.value} (${props.passedCount}/${props.totalCount})${confluenceHeadlineBranchSuffix.value}${crownSuffix}`
})

const confluenceHeadlineStillRunning = computed(() => {
  if (confluenceHeadlineDate.value === null) {
    return ''
  }

  return `${confluenceHeadlineDate.value}${confluenceHeadlineBranchSuffix.value} (läuft noch)`
})

async function handleCopyHeadlineClick() {
  await navigator.clipboard.writeText(confluenceHeadline.value)
}

async function handleCopyHeadlineRunningClick() {
  await navigator.clipboard.writeText(confluenceHeadlineStillRunning.value)
}
</script>

<template>
  <StatusbarSection title="Confluence-Überschrift" v-if="totalCount > 0">
    <UiOutput>{{ confluenceHeadline }}</UiOutput>

    <UiButton
      :disabled="totalCount === 0"
      :icon="DocumentDuplicateIcon"
      @click="handleCopyHeadlineClick"
    >
      Kopieren
    </UiButton>
    <UiButton
      :disabled="totalCount === 0"
      :icon="ClockIcon"
      @click="handleCopyHeadlineRunningClick"
    >
      Kopieren (läuft noch)
    </UiButton>
  </StatusbarSection>
</template>
