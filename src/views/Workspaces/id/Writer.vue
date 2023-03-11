<template>
  <div class="prompt">
    <textarea
      v-model="config.prompt"
      autofocus
      class="textarea-bordered textarea w-full"
      rows="6"
      @change="handleChange"
    />
    <div class="flex justify-end">
      <button class="btn-outline btn-ghost btn-sm btn">submit</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWorkspace } from '@/hooks'
import { shallowMerge } from '@/utils'
import type { CreateCompletionRequest } from 'openai'
import type { WritableComputedRef } from 'vue'

const { currentTabConfig } = useWorkspace()
const config = currentTabConfig as WritableComputedRef<CreateCompletionRequest>
const handleChange = () => {
  currentTabConfig.value = shallowMerge({}, currentTabConfig.value)
}
</script>

<style scoped></style>
