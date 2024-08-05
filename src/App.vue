<script setup lang="ts">
import {
  ClipboardDocumentListIcon,
  DocumentDuplicateIcon,
  TrashIcon,
} from '@heroicons/vue/16/solid'
import AppFooter from './components/layout/AppFooter.vue'
import AppFrame from './components/layout/AppFrame.vue'
import AppHeader from './components/layout/AppHeader.vue'
import StatusbarRow from './components/layout/StatusbarRow.vue'
import StatusbarSection from './components/layout/StatusbarSection.vue'
import LinkList from './components/ui/LinkList.vue'
import ProgressBar from './components/ui/ProgressBar.vue'
import ResultCounter from './components/ui/ResultCounter.vue'
import TotalCount from './components/ui/TotalCount.vue'
import UiButton from './components/ui/UiButton.vue'
import UiInput from './components/ui/UiInput.vue'
import UiTextarea from './components/ui/UiTextarea.vue'
import ConfluenceHeadline from './components/widgets/ConfluenceHeadline.vue'
import { useData } from './useData.js'

const data = useData()

function handleClearDataClick() {
  data.input.value = ''
}

function handlePasteDataClick() {
  navigator.clipboard.readText().then((t) => {
    data.input.value = t
  })
}

async function handleCopyResultClick() {
  await navigator.clipboard.writeText(data.outputText.value)
}
</script>

<template>
  <AppFrame>
    <AppHeader>
      <template #primary>
        <StatusbarSection>
          <UiButton
            :disabled="data.input.value === ''"
            :icon="TrashIcon"
            @click="handleClearDataClick"
          >
            Leeren
          </UiButton>

          <UiButton :icon="ClipboardDocumentListIcon" @click="handlePasteDataClick">
            Einfügen
          </UiButton>
        </StatusbarSection>

        <StatusbarSection title="Branch">
          <UiInput id="branch-name" class="w-32" v-model="data.branchName.value" />
        </StatusbarSection>

        <ConfluenceHeadline
          :passedCount="data.passedRows.value.length"
          :totalCount="data.items.value.length"
          :date="data.items.value[0]?.date"
          :branchName="data.branchName.value"
        ></ConfluenceHeadline>
      </template>

      <template #secondary>
        <UiButton
          :disabled="data.outputText.value.trim() === ''"
          :icon="DocumentDuplicateIcon"
          @click="handleCopyResultClick"
        >
          Ergebnis kopieren
        </UiButton>
      </template>
    </AppHeader>

    <UiTextarea
      v-model="data.input.value"
      class="resize-x mx-2 w-[70vw] min-w-[15vw] max-w-[80vw] bg-theme-50 placeholder:text-theme-600"
      placeholder="Was ist der Leapwork Data Extractor?
====================================
      
Der Leapwork Data Extractor filtert aus den von Leapwork kopierten Testergebnissen die
Fehlgeschlagenen heraus und bringt sie in ein Format, das in Excel eingefügt werden kann,
um dort weitere Details zu den fehlgeschlagenen Tests angeben zu können.


Wie funktioniert der Leapwork Data Extractor?
=============================================

1. Testfälle in Leapwork markieren, rechtsklicken und 'Copy flow run data' klicken.
2. Diese aus der Zwischenablage hier ins linke Textfeld einfügen.
3. Das Ergebnis auf der rechten Seite kopieren und in Excel einfügen.


Format-Beispiel
===============

Timestamp: DD.MM.YYYY hh:mm:ss +hh:mm, Flow: [flow name], Agent: [agent name], Schedule: [schedule name], Runtime: hh:mm:ss.ms{7}, Result: [Passed|Done|Failed|Running]"
    />

    <UiTextarea
      readonly
      class="resize-none bg-theme-100 text-theme-800 placeholder:text-theme-600 mr-2"
      placeholder="Keine Ausgabe vorhanden"
      :value="data.outputText.value"
    ></UiTextarea>

    <AppFooter>
      <StatusbarRow v-if="data.items.value.length === 0">
        <StatusbarSection title="Ergebnisse">Keine vorhanden</StatusbarSection>
      </StatusbarRow>

      <StatusbarRow v-else>
        <StatusbarSection title="Ergebnisse">
          <TotalCount :count="data.items.value.length" class="mr-4" />

          <ResultCounter
            type="passed"
            :count="data.passedRows.value.length"
            :total="data.items.value.length"
          />
          <ResultCounter
            type="done"
            :count="data.doneRows.value.length"
            :total="data.items.value.length"
          />
          <ResultCounter
            type="failed"
            :count="data.failedRows.value.length"
            :total="data.items.value.length"
          />

          <ProgressBar
            :passed="data.passedRows.value.length"
            :done="data.doneRows.value.length"
            :failed="data.failedRows.value.length"
          />
        </StatusbarSection>

        <template #secondary>
          <LinkList>
            <a href="https://github.com/alinnert/leapwork-data-extractor">Quellcode</a>
          </LinkList>
        </template>
      </StatusbarRow>
    </AppFooter>
  </AppFrame>
</template>
