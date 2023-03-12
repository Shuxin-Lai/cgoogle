<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center"
        style="background: rgba(0, 0, 0, 0.6)"
      >
        <div ref="target" class="w-full max-w-xl rounded-md bg-white p-8 shadow">
          <div class="flex justify-end">
            <font-awesome-icon
              class="cursor-pointer"
              icon="fa-solid fa-xmark"
              @click="handleCancel"
            />
          </div>

          <form class="flex flex-col gap-2" @submit.prevent="handleConfirm">
            <c-form-item>
              <div class="prose mb-2">
                <h4>* Name</h4>
              </div>
              <input v-model="form['name']" class="input-bordered input w-full" autofocus />
            </c-form-item>

            <div class="mt-8"></div>

            <div class="btns flex justify-end gap-4">
              <button type="submit" class="btn-primary btn">Confirm</button>
              <button class="btn-outline btn" @click.prevent="handleDelete">Delete</button>
              <button class="btn-outline btn" @click.prevent="handleCancel">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { WorkspaceItem } from '@/types'
import CFormItem from '@/components/workspaces/CFormItem.vue'

const props = defineProps<{
  visible: boolean
  item: WorkspaceItem
}>()
const target = ref()
const initialData = {
  name: '',
}

const { error } = useToast()

const form = ref({ ...initialData })

const emit = defineEmits(['cancel', 'confirm', 'delete'])
const handleCancel = () => {
  emit('cancel')
}

const handleDelete = () => {
  if (window.confirm('Are you sure to delete this workspace?')) {
    emit('delete')
  }
}

const handleConfirm = () => {
  if (!form.value.name) {
    error('Name is required')
    return
  }
  emit('confirm', { ...form.value })
}

onClickOutside(target, handleCancel)

watch(
  () => props.visible,
  (v) => {
    if (!v) return
    form.value = { ...initialData, ...props.item.data }
  },
)
</script>

<style scoped></style>
