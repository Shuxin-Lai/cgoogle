<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center"
        style="background: rgba(0, 0, 0, 0.6)"
      >
        <div class="h-screen w-full max-w-7xl py-8">
          <div ref="target" class="h-full overflow-auto rounded-md bg-white p-8 shadow">
            <example-view @click-item="(item) => $emit('click-item', item)" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import ExampleView from '@/components/workspaces/ExampleView.vue'
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'

defineProps<{
  visible: boolean
}>()
const target = ref()

const emit = defineEmits(['cancel', 'confirm'])
const handleCancel = () => {
  emit('cancel')
}

onClickOutside(target, handleCancel)
</script>

<style scoped></style>
