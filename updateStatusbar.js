import { getPercent } from './index.js'
import { $class, $id, dataInfoEl } from './values.js'

const defaultOptions = {
  date: null,
  success: 0,
  done: 0,
  failed: 0,
  running: 0,
  unknown: 0,
}

const state = {
  branchName: '',
}

export function updateStatusbar({
  date,
  success,
  done,
  failed,
  running,
  unknown,
} = defaultOptions) {
  const total = success + done + failed + running + unknown

  if (total === 0 || date === null) {
    dataInfoEl.innerHTML = `<div>Keine Testergebnisse vorhanden</div>`
    return
  }

  const successPercentage = getPercent(total, success)
  const donePercentage = getPercent(total, done)
  const failedPercentage = getPercent(total, failed)
  const runningPercentage = getPercent(total, running)
  const unknownPercentage = getPercent(total, unknown)

  const successCountHtml = `
    <div class="success-count">
    ${success} erfolgreich (${successPercentage})
    </div>`

  const doneCountHtml = `
    <div class="done-count">
    ${done} beendet (${donePercentage})
    </div>`

  const failedCountHtml = `
    <div class="failed-count">
      ${failed} fehlgeschlagen (${failedPercentage})
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

  dataInfoEl.innerHTML = `
  <div class="total-count">
    ${total} Testläufe
  </div>

  ${success > 0 ? successCountHtml : ''}
  ${done > 0 ? doneCountHtml : ''}
  ${failed > 0 ? failedCountHtml : ''}
  ${running > 0 ? runningCountHtml : ''}
  ${unknown > 0 ? unknownCountHtml : ''}

  <div>
    <div class="progress" style="grid-template-columns: ${success}fr ${done}fr ${failed}fr ${running}fr;">
      <div class="progress-success"></div>
      <div class="progress-done"></div>
      <div class="progress-failed"></div>
      <div class="progress-running"></div>
    </div>
  </div>

  <div class="statusbar-text">Confluence-Überschrift:</div>

  <div class="confluence-headline" id="confluence-headline">
    ${date} ${successPercentage} (${success}/${total})${crown}
  </div>

  <div class="statusbar-buttons">
    <input id="branch-input" value="${state.branchName}" placeholder="Branch-Name">
    <button class="copy-confluence-headline-button">Kopieren</button>
    <button class="copy-confluence-headline-button" data-date="${date}">Kopieren (läuft noch)</button>
  </div>
  `

  $id('branch-input').addEventListener('input', (event) => {
    state.branchName = event.currentTarget.value
  })

  $class('copy-confluence-headline-button').forEach((button) => {
    button.addEventListener('click', async (event) => {
      const dataDate = event.currentTarget.dataset.date

      if (dataDate === undefined) {
        const baseHeadline = $id('confluence-headline').textContent.trim()
        const headline = addBranchNameToHeadline(baseHeadline)
        await navigator.clipboard.writeText(headline)
      } else {
        const headline = addBranchNameToHeadline(`${dataDate} (läuft noch)`)
        await navigator.clipboard.writeText(headline)
      }
    })
  })
}

function addBranchNameToHeadline(baseHeadline) {
  return state.branchName.trim() === ''
    ? baseHeadline
    : `${baseHeadline} - ${state.branchName}`
}
