import { computed, ref } from 'vue'

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

export function useData() {
  const dataEntryRegex =
    /^Timestamp: ((\d\d\.\d\d\.\d\d\d\d) (\d\d:\d\d:\d\d)( \+\d\d:\d\d)?), Flow: ([^,]*?), Agent: ([^,]*?), Schedule: ([^,]*?), Runtime: (\d\d:\d\d:\d\d\.\d{7}), Result: (Passed|Done|Failed|Running)$/

  const input = ref('')

  const branchName = ref('')

  const inputRows = computed(() => {
    return input.value
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r !== '')
  })

  const items = computed((): DataEntry[] => {
    return inputRows.value
      .map((r): DataEntry | null => {
        const match = r.match(dataEntryRegex)

        if (match === null) return null
        const [, , date, time, , flow, agent, schedule, runtime, result] = match

        if (
          result !== 'Passed' &&
          result !== 'Done' &&
          result !== 'Failed' &&
          result !== 'Running'
        ) {
          return null
        }

        return { date, time, flow, agent, schedule, runtime, result }
      })
      .filter((r) => r !== null)
  })

  const passedRows = computed(() => items.value.filter((r) => r.result === 'Passed'))
  const doneRows = computed(() => items.value.filter((r) => r.result === 'Done'))
  const failedRows = computed(() => items.value.filter((r) => r.result === 'Failed'))
  const runningRows = computed(() => items.value.filter((r) => r.result === 'Running'))

  const outputText = computed((): string => {
    return failedRows.value.map((r) => `${r.time}\t${r.flow}`).join('\n')
  })

  return { input, branchName, items, passedRows, doneRows, failedRows, runningRows, outputText }
}
