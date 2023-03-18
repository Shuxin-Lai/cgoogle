<template>
  <teleport to="#sider">
    <Transition name="slideRight">
      <div
        v-if="visible"
        class="config-container fixed top-0 right-0 z-50 h-screen overflow-auto overflow-x-hidden border-l px-2 pt-4"
      >
        <md-editor
          :initial-value="initialValue"
          :initial-mode="initialMode"
          @change="(v) => emit('change', v)"
          @change-mode="(v) => emit('change-mode', v)"
        />
      </div>
    </Transition>
  </teleport>
</template>

<script setup lang="ts">
import MdEditor from '../MdEditor.vue'
defineProps<{ visible?: boolean; initialValue?: string; initialMode?: string }>()
const emit = defineEmits(['change', 'change-mode'])
</script>

<style scoped lang="scss">
.config-container {
  width: var(--vt-editor-width);
  height: 100vh;
  background: hsla(var(--b1) / var(--tw-bg-opacity, 1));
  // background: white;
  z-index: 51;
}
</style>
