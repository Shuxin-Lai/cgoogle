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
        <c-form />
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import CForm from '@/components/CForm.vue'
import { useGlobalConfigStore } from '@/stores'
import { storeToRefs } from 'pinia'

const { isConfigOpen } = storeToRefs(useGlobalConfigStore())
</script>

<style scoped lang="scss">
.config-container {
  width: var(--vt-config-width);
}
</style>
