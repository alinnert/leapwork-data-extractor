const $id = (id) => document.getElementById(id)
const inputEl = $id('input')
const outputEl = $id('output')
const linescountEl = $id('linescount')

const regex =
  /Timestamp: (\d\d)\.(\d\d)\.(\d\d\d\d) (\d\d:\d\d:\d\d).*Flow: ([^,]+)/

const isResultLine = (l, r) =>
  l.endsWith(`Result: ${r}`) && l.match(regex) !== null

inputEl.addEventListener('input', (event) => {
  const lines = event.target.value.split('\n')

  const successLines = lines.filter((l) => isResultLine(l, 'Passed'))
  const doneLines = lines.filter((l) => isResultLine(l, 'Done'))
  const failedLines = lines.filter((l) => isResultLine(l, 'Failed'))

  const extractedData = failedLines
    .map((l) => l.match(regex))
    .filter((l) => l !== null)

  const failedExcelData = extractedData.map((m) => m[4] + '\t' + m[5])

  setOutput(failedExcelData)

  const success = successLines.length
  const done = doneLines.length
  const failed = failedLines.length

  const [, day, month, year] = extractedData[0] ?? []
  const date =
    day !== undefined && month !== undefined && year !== undefined
      ? `${year}-${month}-${day}`
      : null

  setLinescount({ date, success, done, failed })
})

function setOutput(items) {
  outputEl.value = items.join('\n')
}

function setLinescount(
  { date, success, done, failed } = {
    date: null,
    success: 0,
    done: 0,
    failed: 0,
  },
) {
  const total = success + done + failed

  if (total === 0 || date === null) {
    linescountEl.innerHTML = `<div>Keine Testergebnisse vorhanden</div>`
    return
  }

  const successPercentage = (100 / total) * success
  const donePercentage = (100 / total) * done
  const failedPercentage = (100 / total) * failed

  linescountEl.innerHTML = `
  <div class="total-count">
    insgesamt: ${total}
  </div>
  <div class="failed-count">
    fehlgeschlagen: ${failed} (${Math.round(failedPercentage)} %)
  </div>
  <div class="done-count">
    beendet: ${done} (${Math.round(donePercentage)} %)
  </div>
  <div class="success-count">
    erfolgreich: ${success} (${Math.round(successPercentage)} %)
  </div>
  <div class="progress" style="grid-template-columns: ${failed}fr ${done}fr ${success}fr;">
    <div class="progress-failed"></div>
    <div class="progress-done"></div>
    <div class="progress-success"></div>
  </div>
  <div class="statusbar-text">Confluence-Überschrift:</div>
  <div class="confluence-template">
    ${date} ${Math.round(successPercentage)}% (${success}/${total})
  </div>
  `
}

setLinescount()
