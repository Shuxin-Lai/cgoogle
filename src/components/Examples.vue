<template>
  <div v-if="!isList" class="flex flex-wrap gap-6">
    <div
      v-for="example in list"
      :key="example.id"
      class="w-96 cursor-pointer rounded border border-gray-200 bg-base-100 p-2"
      @click="handleClick(example)"
    >
      <div class="card-body p-0">
        <div class="flex">
          <h2 class="card-title flex-1 text-sm line-clamp-1" :title="example.title">
            {{ example.title }}
          </h2>

          <div v-if="isCustom" class="clear" @click.stop="handleRemove(example)">
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

        <p class="text-sm line-clamp-2" :title="example.description">{{ example.description }}</p>
        <div class="card-actions justify-end">
          <div v-for="(tag, index) in example.tags" :key="index" class="badge-ghost badge badge-sm">
            {{ tag }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="flex flex-wrap gap-2" v-else>
    <div
      v-for="example in list"
      :key="example.id"
      class="w-48 cursor-pointer rounded border border-gray-200 bg-base-100 p-2"
      @click="handleClick(example)"
    >
      <div class="card-body p-0">
        <div class="flex justify-between">
          <h2 class="card-title flex-1 text-sm font-normal line-clamp-1" :title="example.title">
            {{ example.title }}
          </h2>

          <div v-if="isCustom" class="clear" @click.stop="handleRemove(example)">
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { exampleList } from '@/data'
import { useAppConfigStore, useConfigStore, useCustomExampleStore } from '@/stores'
import type { ExampleItem } from '@/types'
import { storeToRefs } from 'pinia'
import type { PropType } from 'vue'
const props = defineProps({
  list: {
    type: Array as PropType<ExampleItem[]>,
    default: exampleList,
  },
  isCustom: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits<{ (event: 'click', payload: ExampleItem, isCustom?: boolean): void }>()
const { setConfig } = useConfigStore()
const { complementConfig } = storeToRefs(useConfigStore())
const { remove } = useCustomExampleStore()
const appConfigStore = useAppConfigStore()
const { isList } = storeToRefs(appConfigStore)
const handleClick = (example: ExampleItem) => {
  if (props.isCustom) {
    complementConfig.value.prompt = example.prompt
  }
  setConfig(example.config)

  emit('click', example, props.isCustom)
}

const handleRemove = (example) => {
  if (window.confirm('Are you sure to remove it?')) {
    remove(example)
  }
}
</script>

<style scoped></style>
