<template>
  <teleport to="body">
    <transition name="slideRight">
      <div
        v-show="isConfigOpen"
        class="config-container fixed top-0 right-0 z-50 h-screen overflow-auto overflow-x-hidden border-l px-2"
      >
        <div class="prose">
          <h3>Config</h3>
        </div>
        <div class="mt-4"></div>
        <c-form :config="config" :type="type" @update:config="(v) => emits('change', v)" />
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import CForm from '@/components/workspaces/CForm.vue'
import { useGlobalConfigStore } from '@/stores'
import type { ConfigType, HistoryData } from '@/types'
import { storeToRefs } from 'pinia'
defineProps<{ config: HistoryData['config']; type: ConfigType }>()

const { isConfigOpen } = storeToRefs(useGlobalConfigStore())

const emits = defineEmits(['change'])
</script>

<style scoped lang="scss">
.config-container {
  width: var(--vt-config-width);
}
</style>
