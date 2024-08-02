<script setup lang="ts">
import { computed, ref } from 'vue'
import UiButton from './components/ui/UiButton.vue'
import UiInput from './components/ui/UiInput.vue'

type Result = 'Passed' | 'Done' | 'Failed' | 'Running'

type DataEntry = {
  date: string
  time: string
  flow: string
  agent: string
  schedule: string
  runtime: string
  result: Result
}

const dataEntryRegex =
  /^Timestamp: ((\d\d\.\d\d\.\d\d\d\d) (\d\d:\d\d:\d\d)( \+\d\d:\d\d)?), Flow: ([^,]*?), Agent: ([^,]*?), Schedule: ([^,]*?), Runtime: (\d\d:\d\d:\d\d\.\d{7}), Result: (Passed|Done|Failed|Running)$/

function getPercent(total: number, amount: number): string {
  const percent = Math.round((1000 / total) * amount) / 10
  return `${percent}%`
}

function handleClearDataClick() {
  input.value = ''
}

function handlePasteDataClick() {
  navigator.clipboard.readText().then((t) => {
    input.value = t
  })
}

async function handleCopyResultClick() {
  await navigator.clipboard.writeText(outputText.value)
}

const branchName = ref('')

const input = ref('')

const inputRows = computed(() => {
  return input.value
    .split('\n')
    .map((r) => r.trim())
    .filter((r) => r !== '')
})

const data = computed((): DataEntry[] => {
  return inputRows.value
    .map((r): DataEntry | null => {
      const match = r.match(dataEntryRegex)

      if (match === null) return null
      const [, , date, time, , flow, agent, schedule, runtime, result] = match

      if (result !== 'Passed' && result !== 'Done' && result !== 'Failed' && result !== 'Running') {
        return null
      }

      return { date, time, flow, agent, schedule, runtime, result }
    })
    .filter((r) => r !== null)
})

const passedRows = computed(() => data.value.filter((r) => r.result === 'Passed'))
const passedPercentage = computed(() => getPercent(data.value.length, passedRows.value.length))

const doneRows = computed(() => data.value.filter((r) => r.result === 'Done'))
const donePercentage = computed(() => getPercent(data.value.length, doneRows.value.length))

const failedRows = computed(() => data.value.filter((r) => r.result === 'Failed'))
const failedPercentage = computed(() => getPercent(data.value.length, failedRows.value.length))

const runningRows = computed(() => data.value.filter((r) => r.result === 'Running'))
const runningPercentage = computed(() => getPercent(data.value.length, runningRows.value.length))

const dateOfFirstRow = computed((): { day: string; month: string; year: string } | null => {
  if (data.value.length === 0) return null
  const match = data.value[0].date.match(/^(\d\d)\.(\d\d)\.(\d\d\d\d)$/)
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
  return branchName.value.trim() !== '' ? ` - ${branchName.value}` : ''
})

const confluenceHeadline = computed((): string => {
  if (confluenceHeadlineDate.value === null || data.value.length === 0) {
    return '-'
  }

  const crownSuffix = passedRows.value.length === data.value.length ? ' - 👑' : ''
  return `${confluenceHeadlineDate.value} ${passedPercentage.value} (${passedRows.value.length}/${data.value.length})${confluenceHeadlineBranchSuffix.value}${crownSuffix}`
})

const confluenceHeadlineStillRunning = computed(() => {
  if (confluenceHeadlineDate.value === null) {
    return ''
  }

  return `${confluenceHeadlineDate.value}${confluenceHeadlineBranchSuffix.value} (läuft noch)`
})

const outputText = computed((): string => {
  return failedRows.value.map((r) => `${r.time}\t${r.flow}`).join('\n')
})

async function handleCopyHeadlineClick() {
  await navigator.clipboard.writeText(confluenceHeadline.value)
}

async function handleCopyHeadlineRunningClick() {
  await navigator.clipboard.writeText(confluenceHeadlineStillRunning.value)
}
</script>

<template>
  <div class="app-layout">
    <header class="header">
      <div class="app-logo">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="icon"
        >
          <path
            fill-rule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
            clip-rule="evenodd"
          />
        </svg>
      </div>

      <h1 class="title">Leapwork Data Extractor</h1>

      <div class="toolbar">
        <UiButton @click="handleClearDataClick">
          <template v-slot:icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              class="size-4"
            >
              <path
                fill-rule="evenodd"
                d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
                clip-rule="evenodd"
              />
            </svg>
          </template>
          Daten leeren
        </UiButton>
        <UiButton @click="handlePasteDataClick">
          <template v-slot:icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              class="size-4"
            >
              <path
                d="M8 1a.75.75 0 0 1 .75.75V5h-1.5V1.75A.75.75 0 0 1 8 1ZM7.25 5v4.44L6.03 8.22a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l2.5-2.5a.75.75 0 1 0-1.06-1.06L8.75 9.44V5H11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2.25Z"
              />
            </svg>
          </template>
          Daten aus Zwischenablage einfügen
        </UiButton>
      </div>

      <div class="toolbar toolbar--secondary">
        <UiButton @click="handleCopyResultClick">
          <template v-slot:icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              class="size-4"
            >
              <path
                d="M8.75 6h-1.5V3.56L6.03 4.78a.75.75 0 0 1-1.06-1.06l2.5-2.5a.75.75 0 0 1 1.06 0l2.5 2.5a.75.75 0 1 1-1.06 1.06L8.75 3.56V6H11a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.25v5.25a.75.75 0 0 0 1.5 0V6Z"
              />
            </svg>
          </template>
          Ergebnis für Excel kopieren
        </UiButton>
      </div>
    </header>

    <textarea
      class="text text--input"
      v-model="input"
      placeholder="Anleitung:
      
Der Leapwork Data Extractor filtert aus Leapwork kopierte Testergebnisse die
Fehlgeschlagenen heraus und zieht aus diesen die Uhrzeit und den Namen heraus,
sodass diese Daten in Excel eingefügt werden können.

- Testfälle in Leapwork markieren, rechtsklicken und 'Copy flow run data' klicken.
- Diese aus der Zwischenablage hier ins linke Textfeld einfügen.
- Das Ergebnis auf der rechten Seite kopieren und in Excel einfügen.

Format-Beispiel:

Timestamp: DD.MM.YYYY hh:mm:ss +hh:mm, Flow: [flow name], Agent: [agent name], Schedule: [schedule name], Runtime: hh:mm:ss.ms{7}, Result: [Passed|Done|Failed|Running]"
    ></textarea>

    <textarea
      class="text text--output"
      readonly
      placeholder="Keine Ausgabe vorhanden"
      :value="outputText"
    ></textarea>

    <footer class="statusbar">
      <div class="statusbar-row data-info" v-if="data.length === 0">
        <div class="statusbar-section">Keine Testergebnisse vorhanden</div>
      </div>
      <div class="statusbar-row" v-if="data.length > 0">
        <div class="statusbar-section">
          {{ data.length }} {{ data.length === 1 ? 'Testlauf' : 'Testläufe' }}
        </div>

        <div class="counter counter--passed" v-if="passedRows.length > 0">
          {{ passedRows.length }} erfolgreich ({{ passedPercentage }})
        </div>
        <div class="counter counter--done" v-if="doneRows.length > 0">
          {{ doneRows.length }} beendet ({{ donePercentage }})
        </div>
        <div class="counter counter--failed" v-if="failedRows.length > 0">
          {{ failedRows.length }} fehlgeschlagen ({{ failedPercentage }})
        </div>
        <div class="counter counter--running" v-if="runningRows.length > 0">
          {{ runningRows.length }} laufend ({{ runningPercentage }})
        </div>

        <div>
          <div
            class="progress"
            :style="{
              gridTemplateColumns: `${passedRows.length}fr ${doneRows.length}fr ${failedRows.length}fr ${runningRows.length}fr`,
            }"
          >
            <div class="progress-value progress-value--passed"></div>
            <div class="progress-value progress-value--done"></div>
            <div class="progress-value progress-value--failed"></div>
            <div class="progress-value progress-value--running"></div>
          </div>
        </div>
      </div>

      <div class="statusbar-row">
        <div class="statusbar-section">
          <label for="branch-name">Branch:</label>
          <UiInput id="branch-name" class="branch-input" v-model="branchName"></UiInput>
        </div>

        <div class="statusbar-section">
          <div>Überschrift:</div>
          <div class="confluence-headline">{{ confluenceHeadline }}</div>

          <UiButton :disabled="data.length === 0" @click="handleCopyHeadlineClick">
            <template v-slot:icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                class="size-4"
              >
                <path
                  d="M8.75 6h-1.5V3.56L6.03 4.78a.75.75 0 0 1-1.06-1.06l2.5-2.5a.75.75 0 0 1 1.06 0l2.5 2.5a.75.75 0 1 1-1.06 1.06L8.75 3.56V6H11a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.25v5.25a.75.75 0 0 0 1.5 0V6Z"
                />
              </svg>
            </template>
            Überschrift kopieren
          </UiButton>
          <UiButton :disabled="data.length === 0" @click="handleCopyHeadlineRunningClick">
            <template v-slot:icon
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                class="size-4"
              >
                <path
                  fill-rule="evenodd"
                  d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm7.75-4.25a.75.75 0 0 0-1.5 0V8c0 .414.336.75.75.75h3.25a.75.75 0 0 0 0-1.5h-2.5v-3.5Z"
                  clip-rule="evenodd"
                />
              </svg>
            </template>
            Überschrift kopieren (läuft noch)
          </UiButton>
        </div>
      </div>

      <div class="statusbar-links">
        <a href="https://github.com/alinnert/leapwork-data-extractor">Quellcode auf GitHub</a>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-layout {
  @apply fixed inset-0 grid grid-rows-[auto,1fr,auto] grid-cols-[auto,1fr] bg-theme-600;
}

.icon {
  @apply w-[24px] h-[24px];
}

.header {
  @apply col-span-2 grid grid-cols-[auto,auto,1fr,auto] items-center h-10;
}

.app-logo {
  @apply pl-3 pr-1 flex items-center text-lime-300;
}

.title {
  @apply text-lime-100 ml-1 mr-6 font-bold tracking-wide;
}

.toolbar {
  @apply flex gap-x-1;
}

.toolbar--secondary {
  @apply pr-2;
}

.text {
  @apply rounded outline-none px-2 py-1 text-xs font-mono placeholder:text-base shadow-lg;
}

.text--input {
  @apply resize-x mx-2 w-[70vw] min-w-[15vw] max-w-[80vw] bg-theme-50 placeholder:text-theme-600;
}

.text--output {
  @apply resize-none bg-theme-100 text-theme-800 placeholder:text-theme-600 mr-2;
}

.statusbar {
  @apply h-20 col-span-2 grid grid-rows-2 grid-cols-[1fr,auto] text-white text-sm;
}

.statusbar-row {
  @apply flex items-center;

  &:first-child {
    @apply col-span-2;
  }
}

.data-info {
  @apply flex gap-x-1 items-center;

  & > * {
    @apply flex items-center py-1;
  }
}

.counter {
  @apply rounded px-3 py-1 ml-2;
}

.counter--passed {
  @apply bg-emerald-700;
}

.counter--done {
  @apply bg-amber-700;
}

.counter--failed {
  @apply bg-rose-700;
}

.counter--running {
  @apply bg-sky-700;
}

.progress {
  @apply grid items-stretch w-80 h-4 ml-4 rounded overflow-hidden border border-theme-700;
}

.progress-value--passed {
  @apply bg-emerald-500;
}

.progress-value--done {
  @apply bg-amber-600;
}

.progress-value--failed {
  @apply bg-rose-600;
}

.progress-value--running {
  @apply bg-sky-500;
}

.confluence-headline {
  @apply px-2 py-1 bg-theme-100 text-black rounded;
}

.statusbar-section {
  @apply flex items-center gap-x-2 mx-3;
}

.branch-input {
  @apply w-28;
}

.statusbar-links {
  @apply flex items-center px-3 ml-auto;
}
</style>
