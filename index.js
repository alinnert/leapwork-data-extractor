const $id = (id) => document.getElementById(id)
const inputEl = $id('input')
const outputEl = $id('output')
const linescountEl = $id('linescount')

$id('clear-data-button').addEventListener('click', () => {
  inputEl.value = ''
  handleInputElInput([])
})

$id('paste-data-button').addEventListener('click', async () => {
  inputEl.value = await navigator.clipboard.readText()
  handleInputElInput(inputEl.value.split('\n'))
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
  handleInputElInput(event.target.value.split('\n'))
})

function handleInputElInput(lines) {
  const successLines = lines.filter((l) => isResultLine(l, 'Passed'))
  const doneLines = lines.filter((l) => isResultLine(l, 'Done'))
  const failedLines = lines.filter((l) => isResultLine(l, 'Failed'))
  const runningLines = lines.filter((l) => isResultLine(l, 'Running'))

  const extractedData = failedLines
    .map((l) => l.match(regex))
    .filter((l) => l !== null)

  const failedExcelData = extractedData.map((m) => m[4] + '\t' + m[5])

  setOutput(failedExcelData)

  const success = successLines.length
  const done = doneLines.length
  const failed = failedLines.length
  const running = runningLines.length

  const [, day, month, year] = extractedData[0] ?? []
  const date =
    day !== undefined && month !== undefined && year !== undefined
      ? `${year}-${month}-${day}`
      : null

  setLinescount({ date, success, done, failed, running })
}

function setOutput(items) {
  outputEl.value = items.join('\n')
}

function setLinescount(
  { date, success, done, failed, running } = {
    date: null,
    success: 0,
    done: 0,
    failed: 0,
    running: 0,
  },
) {
  const total = success + done + failed + running

  if (total === 0 || date === null) {
    linescountEl.innerHTML = `<div>Keine Testergebnisse vorhanden</div>`
    return
  }

  const successPercentage = (100 / total) * success
  const donePercentage = (100 / total) * done
  const failedPercentage = (100 / total) * failed
  const runningPercentage = (100 / total) * running

  linescountEl.innerHTML = `
  <div class="total-count">
    ${total} Testläufe
  </div>
  <div class="failed-count">
    ${failed} fehlgeschlagen (${Math.round(failedPercentage)} %)
  </div>
  <div class="done-count">
    ${done} beendet (${Math.round(donePercentage)} %)
  </div>
  <div class="success-count">
    ${success} erfolgreich (${Math.round(successPercentage)} %)
  </div>
  <div class="running-count">
    ${running} laufend (${Math.round(runningPercentage)} %)
  </div>
  <div class="progress" style="grid-template-columns: ${failed}fr ${done}fr ${success}fr ${running}fr;">
    <div class="progress-failed"></div>
    <div class="progress-done"></div>
    <div class="progress-success"></div>
    <div class="progress-running"></div>
  </div>
  <div class="statusbar-text">Confluence-Überschrift:</div>
  <div class="confluence-template" id="confluence-headline">
    ${date} ${Math.round(successPercentage)}% (${success}/${total})
  </div>
  <div class="statusbar-button">
    <button id="copy-confluence-headline-button">Kopieren</button>
  </div>
  `

  $id('copy-confluence-headline-button').addEventListener('click', async () => {
    await navigator.clipboard.writeText($id('confluence-headline').textContent.trim())
  })
}

setLinescount()
