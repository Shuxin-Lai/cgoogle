<template>
  <div class="container relative flex flex-col" style="height: calc(100vh - 100px)">
    <div v-show="chatList.length" class="absolute right-0 -top-14">
      <button class="text-btn btn-ghost btn" @click="handleClearHistory">Clear History</button>
    </div>

    <div class="mb-4 h-full overflow-auto" ref="chatRef">
      <template v-if="chatList.length">
        <div v-for="item in chatList" :key="item.id">
          <div
            class="flex gap-2 py-3 px-2"
            :class="{
              'bg-base-300': !item.isUser,
              'bg-base-200': item.isUser,
            }"
          >
            <div>
              <div v-if="item.isUser">
                <font-awesome-icon icon="fa-regular fa-user" />
              </div>
              <div v-else>
                <svg data-name="OpenAI Logo" width="20px" height="20px" viewBox="140 140 520 520">
                  <defs>
                    <linearGradient id="linear" x1="100%" y1="22%" x2="0%" y2="78%">
                      <stop offset="0%" stop-color="rgb(131,211,231)"></stop>
                      <stop offset="2%" stop-color="rgb(127,203,229)"></stop>
                      <stop offset="25%" stop-color="rgb(86,115,217)"></stop>
                      <stop offset="49%" stop-color="rgb(105,80,190)"></stop>
                      <stop offset="98%" stop-color="rgb(197,59,119)"></stop>
                      <stop offset="100%" stop-color="rgb(197,59,119)"></stop>
                    </linearGradient>
                  </defs>
                  <path
                    id="logo"
                    d="m617.24 354a126.36 126.36 0 0 0 -10.86-103.79 127.8 127.8 0 0 0 -137.65-61.32 126.36 126.36 0 0 0 -95.31-42.49 127.81 127.81 0 0 0 -121.92 88.49 126.4 126.4 0 0 0 -84.5 61.3 127.82 127.82 0 0 0 15.72 149.86 126.36 126.36 0 0 0 10.86 103.79 127.81 127.81 0 0 0 137.65 61.32 126.36 126.36 0 0 0 95.31 42.49 127.81 127.81 0 0 0 121.96-88.54 126.4 126.4 0 0 0 84.5-61.3 127.82 127.82 0 0 0 -15.76-149.81zm-190.66 266.49a94.79 94.79 0 0 1 -60.85-22c.77-.42 2.12-1.16 3-1.7l101-58.34a16.42 16.42 0 0 0 8.3-14.37v-142.39l42.69 24.65a1.52 1.52 0 0 1 .83 1.17v117.92a95.18 95.18 0 0 1 -94.97 95.06zm-204.24-87.23a94.74 94.74 0 0 1 -11.34-63.7c.75.45 2.06 1.25 3 1.79l101 58.34a16.44 16.44 0 0 0 16.59 0l123.31-71.2v49.3a1.53 1.53 0 0 1 -.61 1.31l-102.1 58.95a95.16 95.16 0 0 1 -129.85-34.79zm-26.57-220.49a94.71 94.71 0 0 1 49.48-41.68c0 .87-.05 2.41-.05 3.48v116.68a16.41 16.41 0 0 0 8.29 14.36l123.31 71.19-42.69 24.65a1.53 1.53 0 0 1 -1.44.13l-102.11-59a95.16 95.16 0 0 1 -34.79-129.81zm350.74 81.62-123.31-71.2 42.69-24.64a1.53 1.53 0 0 1 1.44-.13l102.11 58.95a95.08 95.08 0 0 1 -14.69 171.55c0-.88 0-2.42 0-3.49v-116.68a16.4 16.4 0 0 0 -8.24-14.36zm42.49-63.95c-.75-.46-2.06-1.25-3-1.79l-101-58.34a16.46 16.46 0 0 0 -16.59 0l-123.31 71.2v-49.3a1.53 1.53 0 0 1 .61-1.31l102.1-58.9a95.07 95.07 0 0 1 141.19 98.44zm-267.11 87.87-42.7-24.65a1.52 1.52 0 0 1 -.83-1.17v-117.92a95.07 95.07 0 0 1 155.9-73c-.77.42-2.11 1.16-3 1.7l-101 58.34a16.41 16.41 0 0 0 -8.3 14.36zm23.19-50 54.92-31.72 54.92 31.7v63.42l-54.92 31.7-54.92-31.7z"
                    fill="var(--gray-900)"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <div v-if="!item.isUser && item.stat != 'success'">
                <div v-if="item.stat == 'pending'">
                  <div class="loading btn-ghost btn-xs btn"></div>
                </div>
                <div v-else-if="item.stat == 'error'" class="text-red-500">
                  {{ item.content }}
                </div>
              </div>

              <div v-else>
                <pre
                  :style="{
                    'white-space': 'pre-wrap',
                    'word-wrap': 'break-word',
                    'line-height': '1.35',
                    'font-size': '15px',
                  }"
                >
            {{ item.content && item.content.startsWith('\n') ? item.content : '\n' + item.content }}
          </pre
                >
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <example-view @click-item="handleClickExample" />
      </template>
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="relative">
        <textarea
          :value="config.prompt"
          autofocus
          class="textarea-bordered textarea h-20 w-full overflow-y-auto"
          ref="textareaRef"
          @input="handleInput"
        />

        <div class="btns absolute right-4 bottom-4 bg-inherit">
          <div class="flex cursor-pointer gap-4">
            <button @click.stop="handleClear">
              <font-awesome-icon icon="fa-solid fa-xmark" />
            </button>

            <button type="submit">
              <font-awesome-icon icon="fa-regular fa-paper-plane" />
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { createChatCompletion } from '@/apis'
import { useWorkspace } from '@/hooks'
import { useHistoryStore } from '@/stores'
import { logger, sleep } from '@/utils'
import { cloneDeep, isString, merge, set } from 'lodash-es'
import type { CreateChatCompletionRequest } from 'openai'
import { computed, nextTick, onMounted, ref, type WritableComputedRef } from 'vue'
import ExampleView from '@/components/workspaces/ExampleView.vue'
import type { ExampleItem } from '@/types'

const { currentTabConfig, workspaceId, activeTabName, historyList } = useWorkspace()

const chatRef = ref<HTMLDivElement>()
const textareaRef = ref<HTMLTextAreaElement>()
const config = currentTabConfig as WritableComputedRef<any>
const isLoading = ref(false)
const historyStore = useHistoryStore()
const { create, update, removeMore } = historyStore

const chatList = computed(() => {
  const list: { isUser: boolean; content: string; stat: string; id: string }[] = []
  historyList.value.forEach((item) => {
    const { data, id } = item
    const { config, response, stat } = data
    list.unshift({
      content: stat == 'success' ? response![0].text : item.data.error || '',
      isUser: false,
      stat,
      id: id + '_assistant',
    })
    list.unshift({
      // @ts-ignore
      content: config.prompt,
      isUser: true,
      stat,
      id: id + '_user',
    })
  })
  return list
})

const handleClear = () => {
  handleInput('')
  nextTick(() => {
    textareaRef.value?.focus()
  })
}
const handleInput = (valueOrEvent: any) => {
  if (isString(valueOrEvent)) {
    config.value = set(config.value, 'prompt', valueOrEvent)
    return
  }
  config.value = set(config.value, 'prompt', valueOrEvent.target.value)
}

const scrollToEnd = () => {
  nextTick(() => {
    if (!chatRef.value) return
    chatRef.value.scrollTo({
      top: chatRef.value.scrollHeight,
      behavior: 'smooth',
    })
  })
}

const handleSubmit = async () => {
  if (isLoading.value) {
    return
  }

  if (!config.value.prompt) {
    return
  }

  const _config = cloneDeep(config.value)
  isLoading.value = true
  let history = await create({
    data: {
      workspaceId: workspaceId.value!,
      config: _config,
      stat: 'pending',
      type: activeTabName.value,
    },
  })

  const { max_history = 1, prompt, ...requestData } = _config
  let list = chatList.value

  if (list.length && list[list.length - 1].stat == 'pending') {
    list = chatList.value.slice(0, chatList.value.length - 2)
  }

  const length = Math.min(list.length, max_history * 2)
  let idx = list.length - length

  requestData.messages = []

  for (let i = idx; i < list.length; i += 2) {
    if (chatList.value[i].stat != 'success') continue

    requestData.messages.push({
      role: 'user',
      content: list[i].content,
    })

    requestData.messages.push({
      role: 'assistant',
      content: list[i + 1].content,
    })
  }

  requestData.messages.push({
    role: 'user',
    content: prompt,
  })

  logger.log('messages: ', requestData.messages)

  handleClear()

  scrollToEnd()
  const result = await createChatCompletion(requestData).finally(() => {
    isLoading.value = false
  })
  const { stat, data, message } = result
  history = set(
    history,
    'data',
    merge(history.data, { response: data, stat, error: stat == 'error' ? message : null }),
  )
  // logger.log('history: ', history)
  await update(history)
  // scrollToEnd()
}

const handleClickExample = (e: ExampleItem) => {
  if (e.data.isBuiltin) {
    handleInput(e.data.placeholder || '')
  } else {
    handleInput(e.data.defaultInput || '')
  }
}

const handleClearHistory = async () => {
  const isOk = window.confirm('Are you sure to clear history')
  if (!isOk) {
    return
  }
  await removeMore({
    where: (item) =>
      item.data.workspaceId == workspaceId.value && item.data.type == activeTabName.value,
  })
}
onMounted(scrollToEnd)
</script>

<style scoped></style>
