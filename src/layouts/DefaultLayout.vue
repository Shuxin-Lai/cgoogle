<template>
  <div class="default_layout h-screen w-screen">
    <drawer />
    <div class="main_container transform transition-all duration-500" :style="containerStyle">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import Drawer from './default_layout/Drawer.vue'
import { storeToRefs } from 'pinia'
import { useGlobalConfigStore } from '@/stores'
import { computed } from 'vue'
import { useWorkspace } from '@/hooks'
import { useRoute } from 'vue-router'

const { config } = storeToRefs(useGlobalConfigStore())
const { isWorkspaceEditorOpen } = useWorkspace()
const route = useRoute()
const isEditorOpen = computed(() => {
  return route.path.startsWith('/workspaces') && isWorkspaceEditorOpen.value
})
const containerStyle = computed(() => {
  let paddingLeft = ''
  let paddingRight = ''
  if (config.value.isDrawerOpen) {
    paddingLeft = 'var(--vt-drawer-width)'
  }
  if (config.value.isConfigOpen) {
    paddingRight = 'var(--vt-config-width)'
  }
  if (isEditorOpen.value) {
    paddingRight = 'var(--vt-editor-width)'
  }
  return {
    paddingLeft,
    paddingRight,
  }
})
</script>

<style lang="scss" scoped></style>
