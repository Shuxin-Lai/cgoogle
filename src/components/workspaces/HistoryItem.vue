<template>
  <div class="relative border bg-base-100 px-4 py-2">
    <div class="absolute right-4 top-2 flex gap-4">
      <div class="flex cursor-pointer justify-center gap-4 bg-inherit pl-2 pb-2">
        <font-awesome-icon icon="fa-solid fa-pen-to-square" @click="handleRewrite" />
        <font-awesome-icon icon="fa-solid fa-xmark" @click="handleRemove" />
      </div>
    </div>

    <div class="card-body p-0">
      <h2 class="card-title text-sm font-normal line-clamp-2" :title="config.prompt">
        {{ config.prompt }}
      </h2>

      <template v-if="isPending">
        <div class="btn-xl loading btn-ghost btn bg-transparent text-primary"></div>
      </template>
      <template v-else-if="isError || (isSuccess && choices.length == 0)">
        <div class="flex gap-2 text-red-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 flex-shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>

          <template v-if="isError"> Error: {{ item.data.error }} </template>
          <template v-else> Error: result empty</template>
        </div>
      </template>
      <template v-else>
        <div
          v-for="(choice, index) in choices"
          :key="index"
          :class="{ 'mb-4 border-b pb-4': index != choices.length - 1 }"
        >
          <pre
            style="white-space: pre-wrap; word-wrap: break-word; line-height: 1.35; font-size: 15px"
          >
            {{ '\n' + choice.text }}
          </pre>
          <div class="flex justify-end">
            <button
              class="btn-link btn font-normal capitalize text-black"
              @click="handleCopy(choice)"
            >
              Copy
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalToast } from '@/toast'
import type { HistoryItem } from '@/types'
import { copyToClipboard } from '@/utils'
import type { CreateCompletionRequest, CreateCompletionResponseChoicesInner } from 'openai'
import { computed } from 'vue'

const globalToast = useGlobalToast()

const props = defineProps<{ item: HistoryItem }>()
const stat = computed(() => props.item.data.stat)
const isPending = computed(() => stat.value == 'pending')
const isSuccess = computed(() => stat.value == 'success')
const isError = computed(() => stat.value == 'error')
const choices = computed(() => props.item.data.response || [])
const config = computed(() => props.item.data.config as CreateCompletionRequest)

const handleCopy = async (choice: CreateCompletionResponseChoicesInner) => {
  // await copy(choice.text || '')
  copyToClipboard(choice.text || '')
  globalToast.success('Copied')
}
const emit = defineEmits(['remove', 'rewrite'])
const handleRewrite = () => {
  emit('rewrite')
}
const handleRemove = () => {
  emit('remove')
}
</script>

<style scoped></style>
