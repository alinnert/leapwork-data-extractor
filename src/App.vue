<script setup lang="ts">
import {
  ClipboardDocumentListIcon,
  DocumentDuplicateIcon,
  TrashIcon,
} from '@heroicons/vue/16/solid'
import AppFooter from './components/layout/AppFooter.vue'
import AppFrame from './components/layout/AppFrame.vue'
import AppHeader from './components/layout/AppHeader.vue'
import ToolbarRow from './components/layout/ToolbarRow.vue'
import ToolbarSection from './components/layout/ToolbarSection.vue'
import LinkList from './components/ui/LinkList.vue'
import ProgressBar from './components/ui/ProgressBar.vue'
import ResultCounter from './components/ui/ResultCounter.vue'
import TotalCount from './components/ui/TotalCount.vue'
import UiButton from './components/ui/UiButton.vue'
import UiInput from './components/ui/UiInput.vue'
import UiTextarea from './components/ui/UiTextarea.vue'
import ConfluenceHeadline from './components/widgets/ConfluenceHeadline.vue'
import manualText from './manual.txt?raw'
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
        <ToolbarSection>
          <UiButton
            dark
            :disabled="data.input.value === ''"
            :icon="TrashIcon"
            @click="handleClearDataClick"
          >
            Leeren
          </UiButton>

          <UiButton dark :icon="ClipboardDocumentListIcon" @click="handlePasteDataClick">
            Einfügen
          </UiButton>
        </ToolbarSection>
      </template>

      <template #toolbars>
        <ToolbarRow>
          <ToolbarSection title="Branch">
            <UiInput id="branch-name" class="w-32" v-model="data.branchName.value" />
          </ToolbarSection>

          <ConfluenceHeadline
            :passedCount="data.passedRows.value.length"
            :totalCount="data.items.value.length"
            :date="data.items.value[0]?.date"
            :branchName="data.branchName.value"
          ></ConfluenceHeadline>

          <template #secondary>
            <ToolbarSection>
              <UiButton
                :disabled="data.outputText.value.trim() === ''"
                :icon="DocumentDuplicateIcon"
                @click="handleCopyResultClick"
              >
                Ergebnis kopieren
              </UiButton>
            </ToolbarSection>
          </template>
        </ToolbarRow>
      </template>
    </AppHeader>

    <UiTextarea
      v-model="data.input.value"
      class="resize-x mx-2 w-[70vw] min-w-[15vw] max-w-[80vw] placeholder:text-stone-600"
      :placeholder="manualText"
    />

    <UiTextarea
      readonly
      class="resize-none bg-stone-200 text-stone-800 placeholder:text-stone-600 mr-2"
      placeholder="Keine Ausgabe vorhanden"
      :value="data.outputText.value"
    ></UiTextarea>

    <AppFooter>
      <ToolbarRow>
        <ToolbarSection title="Ergebnisse" v-if="data.items.value.length === 0">
          Keine vorhanden
        </ToolbarSection>

        <ToolbarSection title="Ergebnisse" v-else>
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
        </ToolbarSection>

        <template #secondary>
          <LinkList>
            <a href="https://github.com/alinnert/leapwork-data-extractor">Quellcode</a>
          </LinkList>
        </template>
      </ToolbarRow>
    </AppFooter>
  </AppFrame>
</template>
