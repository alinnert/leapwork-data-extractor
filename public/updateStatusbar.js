import { getPercent } from './index.js'
import { $class, $id, linescountEl } from './values.js'

const defaultOptions = {
  date: null,
  success: 0,
  done: 0,
  failed: 0,
  running: 0,
  unknown: 0,
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
    linescountEl.innerHTML = `<div>Keine Testergebnisse vorhanden</div>`
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

  linescountEl.innerHTML = `
  <div class="total-count">
    ${total} Testläufe
  </div>

  ${success > 0 ? successCountHtml : ''}
  ${done > 0 ? doneCountHtml : ''}
  ${failed > 0 ? failedCountHtml : ''}
  ${running > 0 ? runningCountHtml : ''}
  ${unknown > 0 ? unknownCountHtml : ''}

  <div class="progress" style="grid-template-columns: ${success}fr ${done}fr ${failed}fr ${running}fr;">
    <div class="progress-success"></div>
    <div class="progress-done"></div>
    <div class="progress-failed"></div>
    <div class="progress-running"></div>
  </div>

  <div class="statusbar-text">Confluence-Überschrift:</div>
  <div class="confluence-template" id="confluence-headline">
    ${date} ${successPercentage} (${success}/${total})${crown}
  </div>
  <div class="statusbar-button">
    <button class="copy-confluence-headline-button">Kopieren</button>
    <button class="copy-confluence-headline-button" data-date="${date}">Kopieren (noch laufend)</button>
  </div>
  `

  $class('copy-confluence-headline-button').forEach((button) => {
    button.addEventListener('click', async (event) => {
      const dataDate = event.currentTarget.dataset.date

      if (dataDate === undefined) {
        const headlineText = $id('confluence-headline').textContent.trim()
        await navigator.clipboard.writeText(headlineText)
      } else {
        await navigator.clipboard.writeText(`${dataDate} (läuft noch)`)
      }
    })
  })
}
