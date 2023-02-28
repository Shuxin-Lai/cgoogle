<template>
  <div class="flex flex-col gap-8">
    <history-item
      v-for="item in historyList"
      :key="item.clientId"
      :item="item"
      @remove="
        () => {
          handleRemove(item)
        }
      "
    />
  </div>
</template>

<script setup lang="ts">
import { useHistoryStore } from '@/stores'
import { storeToRefs } from 'pinia'
import HistoryItem from './HistoryItem.vue'

const store = useHistoryStore()
const { remove } = store
const { historyList } = storeToRefs(store)
const handleRemove = (item: any) => {
  remove(item)
}
</script>

<style scoped></style>
