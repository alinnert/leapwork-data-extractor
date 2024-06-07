const $id = (id) => document.getElementById(id)
const inputEl = $id('input')
const outputEl = $id('output')
const linescountEl = $id('linescount')

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

const regex =
  /Timestamp: (\d\d)\.(\d\d)\.(\d\d\d\d) (\d\d:\d\d:\d\d).*Flow: ([^,]+)/

const isResultLine = (l, r) =>
  l.endsWith(`Result: ${r}`) && l.match(regex) !== null

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

  for (const line of lines.filter(l => l.trim() !== '')) {
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
    .map((l) => l.match(regex))
    .filter((l) => l !== null)

  const failedExcelData = extractedData.map((m) => `${m[4]}\t${m[5]}`)

  setOutput(failedExcelData)

  const success = successLines.length
  const done = doneLines.length
  const failed = failedLines.length
  const running = runningLines.length
  const unknown = unknownLines.length

  const firstLineMatch = lines[0].match(regex)
  if (firstLineMatch === null) {
    setLinescount()
    return
  }

  const [, day, month, year] = firstLineMatch ?? []
  const date =
    day !== undefined && month !== undefined && year !== undefined
      ? `${year}-${month}-${day}`
      : null

  setLinescount({ date, success, done, failed, running, unknown })
}

function setOutput(items) {
  outputEl.value = items.join('\n')
}

function setLinescount(
  { date, success, done, failed, running, unknown } = {
    date: null,
    success: 0,
    done: 0,
    failed: 0,
    running: 0,
    unknown: 0,
  },
) {
  const total = success + done + failed + running + unknown

  if (total === 0 || date === null) {
    linescountEl.innerHTML = `<div>Keine Testergebnisse vorhanden</div>`
    return
  }

  const successPercentage = getPercent(total, success)
  const donePercentage = getPercent(total, done)
  const failedPercentage = getPercent(total, failed)
  const runningPercentage = getPercent(total, running)
  const unknownPercentage = getPercent(total, unknown)

  const failedCountHtml = `
    <div class="failed-count">
      ${failed} fehlgeschlagen (${failedPercentage})
    </div>`

  const doneCountHtml = `
    <div class="done-count">
      ${done} beendet (${donePercentage})
    </div>`

  const successCountHtml = `
    <div class="success-count">
      ${success} erfolgreich (${successPercentage})
    </div>`

  const runningCountHtml = `
    <div class="running-count">
      ${running} laufend (${runningPercentage})
    </div>`
  
  const unknownCountHtml = `
    <div class="unknown-count">
      ${unknown} unbekannt (${unknownPercentage})
    </div>`

  const crown = success === total ? ' - 👑' : ''

  linescountEl.innerHTML = `
  <div class="total-count">
    ${total} Testläufe
  </div>
  ${failed > 0 ? failedCountHtml : ''}
  ${done > 0 ? doneCountHtml : ''}
  ${success > 0 ? successCountHtml : ''}
  ${running > 0 ? runningCountHtml : ''}
  ${unknown > 0 ? unknownCountHtml : ''}
  <div class="progress" style="grid-template-columns: ${failed}fr ${done}fr ${success}fr ${running}fr;">
    <div class="progress-failed"></div>
    <div class="progress-done"></div>
    <div class="progress-success"></div>
    <div class="progress-running"></div>
  </div>
  <div class="statusbar-text">Confluence-Überschrift:</div>
  <div class="confluence-template" id="confluence-headline">
    ${date} ${successPercentage} (${success}/${total})${crown}
  </div>
  <div class="statusbar-button">
    <button id="copy-confluence-headline-button">Kopieren</button>
  </div>
  `

  $id('copy-confluence-headline-button').addEventListener('click', async () => {
    await navigator.clipboard.writeText(
      $id('confluence-headline').textContent.trim(),
    )
  })
}

function getPercent(total, amount) {
  const percent = Math.round((1000 / total) * amount) / 10
  return `${percent}%`
}

setLinescount()
