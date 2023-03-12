<template>
  <div class="flex flex-col gap-8">
    <history-item
      v-for="item in historyList"
      :key="item.id"
      :item="item"
      @rewrite="$emit('rewrite', item)"
      @remove="$emit('remove', item)"
    />
  </div>
</template>

<script setup lang="ts">
import type { HistoryItem as Item } from '@/types'
import HistoryItem from './HistoryItem.vue'

defineProps<{ historyList: Item[] }>()
</script>

<style scoped></style>
