<template>
  <div v-if="!isList" class="flex flex-wrap gap-6">
    <div
      v-for="example in list"
      :key="example.id"
      class="w-96 cursor-pointer rounded border border-gray-200 bg-base-100 p-2 transition-all"
      :class="{ 'border-primary': activeId == example.id }"
      @click="emit('click', example)"
    >
      <div class="card-body p-0">
        <div class="flex">
          <h2 class="card-title flex-1 text-sm line-clamp-1" :title="example.data.title">
            {{ example.data.title }}
          </h2>

          <font-awesome-icon
            v-if="!example.data.isBuiltin"
            icon="fa-solid fa-xmark"
            @click="emit('remove', example)"
          />
        </div>

        <p class="text-sm line-clamp-2" :title="example.data.description">
          {{ example.data.description }}
        </p>
        <div class="card-actions justify-end">
          <div
            v-for="(tag, index) in example.data.tags"
            :key="index"
            class="badge-ghost badge badge-sm"
          >
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
      :class="{ 'border-primary': activeId == example.id }"
      @click="emit('click', example)"
    >
      <div class="card-body p-0">
        <div class="flex justify-between">
          <h2
            class="card-title flex-1 text-sm font-normal line-clamp-1"
            :title="example.data.title"
          >
            {{ example.data.title }}
          </h2>

          <font-awesome-icon
            v-if="!example.data.isBuiltin"
            icon="fa-solid fa-xmark"
            @click="emit('remove', example)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalConfigStore } from '@/stores'
import type { ExampleItem } from '@/types'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

defineProps<{
  list: ExampleItem[]
  activeId?: number | null
}>()

const emit = defineEmits(['click', 'remove'])
const { config } = storeToRefs(useGlobalConfigStore())
const isList = computed(() => config.value.exampleType == 'simple')
</script>

<style scoped></style>
