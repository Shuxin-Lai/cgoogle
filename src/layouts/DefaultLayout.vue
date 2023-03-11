<template>
  <div class="default_layout h-screen w-screen">
    <drawer />
    <div class="main_container transform transition-all duration-500" :style="containerStyle">
      <slot />
    </div>
    <config />
  </div>
</template>

<script setup lang="ts">
import Drawer from './default_layout/Drawer.vue'
import Config from './default_layout/Config.vue'
import { storeToRefs } from 'pinia'
import { useGlobalConfigStore } from '@/stores'
import { computed } from 'vue'

const { config } = storeToRefs(useGlobalConfigStore())
const containerStyle = computed(() => {
  let paddingLeft = ''
  let paddingRight = ''
  if (config.value.isDrawerOpen) {
    paddingLeft = 'var(--vt-drawer-width)'
  }
  if (config.value.isConfigOpen) {
    paddingRight = 'var(--vt-config-width)'
  }
  return {
    paddingLeft,
    paddingRight,
  }
})
</script>

<style lang="scss" scoped></style>
