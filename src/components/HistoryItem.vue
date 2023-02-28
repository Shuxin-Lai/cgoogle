<template>
  <div class="relative border bg-base-100 px-4 py-2">
    <div class="absolute right-4 top-2">
      <div class="clear cursor-pointer" @click="handleRemove">
        <svg
          t="1677590028203"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="5303"
          width="20"
          height="20"
        >
          <path
            d="M556.8 512L832 236.8c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0L512 467.2l-275.2-277.333333c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l275.2 277.333333-277.333333 275.2c-12.8 12.8-12.8 32 0 44.8 6.4 6.4 14.933333 8.533333 23.466666 8.533333s17.066667-2.133333 23.466667-8.533333L512 556.8 787.2 832c6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466666-8.533333c12.8-12.8 12.8-32 0-44.8L556.8 512z"
            fill="#666666"
            p-id="5304"
          ></path>
        </svg>
      </div>
    </div>
    <div class="card-body p-0">
      <h2 class="card-title text-sm font-normal line-clamp-2" :title="item.config.prompt || ''">
        {{ item.config.prompt || '' }}
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

          <template v-if="isError"> Error: {{ item.error && item.error.message }} </template>
          <template v-else> Error: result empty</template>
        </div>
      </template>
      <template v-else>
        <div
          v-for="(choice, index) in choices"
          :key="index"
          :class="{ 'mb-4 border-b pb-4': index != choices.length - 1 }"
        >
          <div>
            {{ choice.text }}
          </div>
          <div class="flex justify-end">
            <button
              class="btn-link btn font-normal capitalize text-black"
              @click="handleCopy(choice)"
            >
              copy
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HistoryItem } from '@/types'
import { computed } from 'vue'
import { useClipboard } from '@vueuse/core'
import type { CreateCompletionResponseChoicesInner } from 'openai'
import { useGlobalToast } from '@/toast'

const globalToast = useGlobalToast()

const props = defineProps<{ item: HistoryItem }>()
const isPending = computed(() => props.item.stat == 'pending')
const isSuccess = computed(() => props.item.stat == 'success')
const isError = computed(() => props.item.stat == 'error')
const choices = computed(() => {
  const cs = props.item.result?.choices || []
  return cs.filter((c) => {
    const t = c.text || ''
    return !!t.trim()
  })
})

const { copy } = useClipboard()
const handleCopy = async (choice: CreateCompletionResponseChoicesInner) => {
  await copy(choice.text || '')
  globalToast.success('Copied')
}
const emit = defineEmits(['remove'])
const handleRemove = () => {
  emit('remove')
}
</script>

<style scoped></style>
