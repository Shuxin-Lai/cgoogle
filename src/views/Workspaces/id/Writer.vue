<template>
  <example-shower
    :visible="isShowExamples"
    @click-item="handleClickExample"
    @cancel="isShowExamples = false"
  />

  <div class="prompt">
    <div class="relative">
      <div class="absolute right-4 bottom-4">
        <div class="flex cursor-pointer gap-4 bg-white pl-4 pt-4">
          <font-awesome-icon icon="fa-solid fa-fill" @click="handleFill" />
          <font-awesome-icon icon="fa-solid fa-xmark" @click="handleClear" />
        </div>
      </div>

      <textarea
        :value="config?.prompt"
        :placeholder="placeholder"
        autofocus
        class="textarea-bordered textarea w-full pb-8"
        rows="6"
        @input="handleInput"
        ref="textareaRef"
      />
    </div>
    <div class="mt-2"></div>
    <div class="flex justify-end gap-4">
      <button
        class="btn-outline btn-ghost btn-sm btn"
        :class="{ loading: isLoading }"
        @click="handleShowExamples"
      >
        Examples
      </button>

      <button class="btn-primary btn-sm btn" :class="{ loading: isLoading }" @click="handleSubmit">
        Submit
      </button>
    </div>
  </div>

  <div class="mt-4 pb-8">
    <transition name="fade">
      <div v-if="!historyList.length">
        <example-view @click-item="handleClickExample" />
      </div>
    </transition>

    <div v-if="historyList.length">
      <div class="flex justify-between">
        <div class="prose">
          <h3>History</h3>
        </div>

        <button class="text-btn btn-ghost btn" @click="handleClearHistory">Clear</button>
      </div>
    </div>

    <history :history-list="historyList" @remove="handleRemoveHistory" @rewrite="handleRewrite" />
  </div>
</template>

<script setup lang="ts">
import { useWorkspace } from '@/hooks'
import { cloneDeep, isString, merge, set } from 'lodash-es'
import type { CreateCompletionRequest } from 'openai'
import type { ExampleItem, HistoryItem } from '@/types'
import { computed, nextTick, ref, type WritableComputedRef } from 'vue'
import ExampleView from '@/components/workspaces/ExampleView.vue'
import { logger, sleep } from '@/utils'
import { createCompletion } from '@/apis'
import { useHistoryStore } from '@/stores'
import History from '@/components/workspaces/History.vue'
import ExampleShower from './ExampleShower.vue'

const {
  currentTabConfig,
  historyList,
  workspace,
  workspaceId,
  activeExampleId,
  activeExample,
  activeTabName,
} = useWorkspace()
const config = currentTabConfig as WritableComputedRef<CreateCompletionRequest>
const textareaRef = ref<HTMLTextAreaElement>()
const historyStore = useHistoryStore()
const { create, update, remove, removeMore } = historyStore

const isLoading = ref(false)
const isShowExamples = ref(false)

const handleInput = (valueOrEvent: any) => {
  if (isString(valueOrEvent)) {
    config.value = set(config.value, 'prompt', valueOrEvent)
    return
  }
  config.value = set(config.value, 'prompt', valueOrEvent.target.value)
}

const placeholder = computed(() => {
  const defaultVal = 'Write something...'
  if (!activeExample.value) {
    return defaultVal
  }
  return activeExample.value.data.placeholder || activeExample.value.data.defaultInput || defaultVal
})
const focus = async (scroll = true) => {
  textareaRef.value?.focus()
  await nextTick()

  if (config.value.prompt && scroll) {
    const ch = textareaRef.value!.clientHeight
    const sh = textareaRef.value!.scrollHeight
    if (ch + 20 < sh) {
      textareaRef.value!.scrollTo({
        top: 9999,
        behavior: 'smooth',
      })
    }
  }
}
const handleFill = () => {
  if (!activeExample.value) {
    focus(false)
    return
  }

  if (activeExample.value.data.isBuiltin) {
    handleInput(activeExample.value.data.placeholder || '')
  } else if (activeExample.value.data.defaultInput) {
    handleInput(activeExample.value.data.defaultInput)
  }
  focus(false)
}
const handleClear = () => {
  handleInput('')
  focus()
}

const handleClickExample = (e: ExampleItem) => {
  if (e.id == activeExampleId.value) {
    return
  }
  isShowExamples.value = false

  workspace.value = set(workspace.value!, 'data.activeExampleId', e.id)
  const config = cloneDeep(e.data.config)

  if (!e.data.isBuiltin && e.data.defaultInput) {
    // @ts-ignore
    config.prompt = e.data.defaultInput
  }
  currentTabConfig.value = config
  focus()
}

const handleSubmit = async () => {
  if (isLoading.value) {
    return
  }

  if (!config.value.prompt) {
    return
  }

  isLoading.value = true
  sleep(200).finally(() => {
    isLoading.value = false
  })
  let history = await create({
    data: {
      workspaceId: workspaceId.value!,
      config: config.value,
      stat: 'pending',
      type: activeTabName.value,
    },
  })

  const result = await createCompletion(config.value)
  const { stat, data, message } = result
  history = set(
    history,
    'data',
    merge(history.data, { response: data, stat, error: stat == 'error' ? message : null }),
  )
  logger.log('history: ', history)
  await update(history)
}

const handleClearHistory = async () => {
  const isOk = window.confirm('Are you sure to clear history')
  if (!isOk) {
    return
  }
  await removeMore({
    where: (item) => item.data.workspaceId == workspaceId.value,
  })
}

const handleRemoveHistory = (item: HistoryItem) => {
  remove(item)
}
const handleRewrite = (item: HistoryItem) => {
  // @ts-ignore
  handleInput(item.data.config.prompt)
  focus()
}

const handleShowExamples = () => {
  isShowExamples.value = true
}
</script>

<style scoped></style>
