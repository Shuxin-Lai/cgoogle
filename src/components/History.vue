<template>
  <div class="flex flex-col gap-8">
    <history-item
      v-for="item in historyList"
      :key="item.clientId"
      :item="item"
      @rewrite="() => handleRewrite(item)"
      @remove="
        () => {
          handleRemove(item)
        }
      "
    />
  </div>
</template>

<script setup lang="ts">
import { useConfigStore, useHistoryStore } from '@/stores'
import type { HistoryItem as Item } from '@/types'
import { storeToRefs } from 'pinia'
import HistoryItem from './HistoryItem.vue'

const store = useHistoryStore()
const { remove } = store
const { historyList } = storeToRefs(store)
const { complementConfig } = storeToRefs(useConfigStore())
const handleRemove = (item: any) => {
  remove(item)
}
const handleRewrite = (item: Item) => {
  complementConfig.value = {
    ...item.config,
  }
  document.querySelector<HTMLInputElement>('#prompt-input')?.focus()
}
</script>

<style scoped></style>
