<template>
  <div class="flex flex-col gap-8">
    <div
      v-for="(item, index) in exampleItems"
      :key="index"
      class="example-list"
      :class="{ 'border-b pb-4': index != exampleItems.length - 1 }"
    >
      <div class="prose">
        <h4>{{ item.title }}</h4>
      </div>
      <div class="mt-4"></div>
      <examples
        :active-id="activeExampleId"
        :list="item.list"
        @remove="handleRemoveExample"
        @click="handleClickExample"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Examples from '@/components/workspaces/Examples.vue'
import { builtinExampleList } from '@/data'
import { useWorkspace } from '@/hooks'
import { useExampleStore } from '@/stores'
import type { ExampleItem } from '@/types'
import { computed } from 'vue'

const { activeExampleId, exampleList, globalExampleList } = useWorkspace()
const { remove: removeExample } = useExampleStore()

const exampleItems = computed(() => {
  const res = [
    {
      title: 'Builtin Examples',
      list: builtinExampleList,
    },
  ]

  if (globalExampleList.value.length) {
    res.unshift({
      title: 'Global Examples',
      list: globalExampleList.value,
    })
  }

  if (exampleList.value.length) {
    res.unshift({
      title: 'Workspace Examples',
      list: exampleList.value,
    })
  }

  return res
})

const emit = defineEmits(['click-item'])
const handleClickExample = (e: ExampleItem) => {
  emit('click-item', e)
}

const handleRemoveExample = (example: ExampleItem) => {
  removeExample(example)
}
</script>

<style scoped></style>
