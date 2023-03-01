<template>
  <div class="relative border bg-base-100 px-4 py-2">
    <div class="absolute right-4 top-2 flex gap-4">
      <div class="clear cursor-pointer" @click="handleRewrite">
        <svg
          t="1677681937524"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2269"
          width="20"
          height="20"
        >
          <path
            d="M853.333333 501.333333c-17.066667 0-32 14.933333-32 32v320c0 6.4-4.266667 10.666667-10.666666 10.666667H170.666667c-6.4 0-10.666667-4.266667-10.666667-10.666667V213.333333c0-6.4 4.266667-10.666667 10.666667-10.666666h320c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32H170.666667c-40.533333 0-74.666667 34.133333-74.666667 74.666666v640c0 40.533333 34.133333 74.666667 74.666667 74.666667h640c40.533333 0 74.666667-34.133333 74.666666-74.666667V533.333333c0-17.066667-14.933333-32-32-32z"
            fill="#666666"
            p-id="2270"
          ></path>
          <path
            d="M405.333333 484.266667l-32 125.866666c-2.133333 10.666667 0 23.466667 8.533334 29.866667 6.4 6.4 14.933333 8.533333 23.466666 8.533333h8.533334l125.866666-32c6.4-2.133333 10.666667-4.266667 14.933334-8.533333l300.8-300.8c38.4-38.4 38.4-102.4 0-140.8-38.4-38.4-102.4-38.4-140.8 0L413.866667 469.333333c-4.266667 4.266667-6.4 8.533333-8.533334 14.933334z m59.733334 23.466666L761.6 213.333333c12.8-12.8 36.266667-12.8 49.066667 0 12.8 12.8 12.8 36.266667 0 49.066667L516.266667 558.933333l-66.133334 17.066667 14.933334-68.266667z"
            fill="#666666"
            p-id="2271"
          ></path>
        </svg>
      </div>
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
          <pre
            style="white-space: pre-wrap; word-wrap: break-word; line-height: 1.35; font-size: 15px"
          >
            {{ choice.text }}
          </pre>
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
import { copyToClipboard } from '@/utils'

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
