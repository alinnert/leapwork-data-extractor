import { updateStatusbar } from './updateStatusbar.js'
import { $id, inputEl, outputEl, resultLineRegex } from './values.js'

$id('clear-data-button').addEventListener('click', () => {
  inputEl.value = ''
  handleInputElInput()
})

$id('paste-data-button').addEventListener('click', async () => {
  inputEl.value = await navigator.clipboard.readText()
  handleInputElInput()
})

$id('copy-result-button').addEventListener('click', async () => {
  if (outputEl.value === '') return
  await navigator.clipboard.writeText(outputEl.value)
})

const isResultLine = (l, r) =>
  l.endsWith(`Result: ${r}`) && l.match(resultLineRegex) !== null

inputEl.addEventListener('input', (event) => {
  handleInputElInput()
})

function handleInputElInput() {
  const lines = inputEl.value.split('\n')

  let successLines = []
  let doneLines = []
  let failedLines = []
  let runningLines = []
  let unknownLines = []

  for (const line of lines.filter((l) => l.trim() !== '')) {
    if (isResultLine(line, 'Passed')) {
      successLines.push(line)
    } else if (isResultLine(line, 'Done')) {
      doneLines.push(line)
    } else if (isResultLine(line, 'Failed')) {
      failedLines.push(line)
    } else if (isResultLine(line, 'Running')) {
      runningLines.push(line)
    } else {
      unknownLines.push(line)
    }
  }

  const extractedData = failedLines
    .map((l) => l.match(resultLineRegex))
    .filter((l) => l !== null)

  const failedExcelData = extractedData.map((m) => `${m[4]}\t${m[5]}`)

  setOutput(failedExcelData)

  const success = successLines.length
  const done = doneLines.length
  const failed = failedLines.length
  const running = runningLines.length
  const unknown = unknownLines.length

  const firstLineMatch = lines[0].match(resultLineRegex)
  if (firstLineMatch === null) {
    updateStatusbar()
    return
  }

  const [, day, month, year] = firstLineMatch ?? []
  const date =
    day !== undefined && month !== undefined && year !== undefined
      ? `${year}-${month}-${day}`
      : null

  updateStatusbar({ date, success, done, failed, running, unknown })
}

function setOutput(items) {
  outputEl.value = items.join('\n')
}

export function getPercent(total, amount) {
  const percent = Math.round((1000 / total) * amount) / 10
  return `${percent}%`
}

updateStatusbar()
