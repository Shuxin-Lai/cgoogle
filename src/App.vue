<template>
  <Dialog :open="isOpen" class="absolute z-50">
    <div class="fixed inset-0 bg-black/30" />
    <div class="fixed inset-0 flex items-center justify-center">
      <DialogPanel ref="target" class="w-full max-w-xl rounded bg-white p-8">
        <form @submit.prevent="handleSave">
          <label class="block">
            <div class="mb-2">Title</div>
            <div>
              <input
                v-model="form.title"
                autofocus
                type="text"
                id="dialog-title-input"
                class="input-bordered input w-full"
              />
            </div>
          </label>
          <label class="block">
            <div class="mb-2">Description</div>
            <div>
              <input v-model="form.description" type="text" class="input-bordered input w-full" />
            </div>
          </label>
          <label class="block">
            <div class="mb-2">Prompt</div>
            <div>
              <textarea v-model="form.prompt" class="input-bordered input h-32 w-full" />
            </div>
          </label>
          <label class="block">
            <div class="mb-2">Tags</div>
            <div>
              <input
                v-model="form.tags"
                placeholder="comma separated value"
                type="text"
                class="input-bordered input w-full"
              />
            </div>
          </label>

          <div class="mt-4 flex gap-2">
            <button class="btn-primary btn" type="submit">Confirm</button>
            <button class="btn-outline btn" @click.prevent="() => (isOpen = false)">Cancel</button>
          </div>
        </form>
      </DialogPanel>
    </div>
  </Dialog>

  <default-layout>
    <router-view />
  </default-layout>
</template>

<script lang="ts" setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { onClickOutside } from '@vueuse/core'
import { useDialogStore, useConfigStore, useCustomExampleStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { nextTick, ref, watch } from 'vue'
import type { ExampleItem } from './types'
import { cloneDeep } from 'lodash-es'
import { useGlobalToast } from './toast'
import { Dialog, DialogPanel } from '@headlessui/vue'

const { isOpen, isExampleOpen } = storeToRefs(useDialogStore())
const { complementConfig } = storeToRefs(useConfigStore())
const _initData = {
  title: '',
  description: '',
  id: '',
  prompt: '',
  tags: '',
  config: {} as any,
}
const form = ref<Omit<ExampleItem, 'tags'> & { tags: string }>({ ..._initData })

const target = ref(null)
const { add } = useCustomExampleStore()

watch(isOpen, (newVal) => {
  if (newVal) {
    form.value.config = cloneDeep(complementConfig.value)
    form.value.prompt = complementConfig.value.prompt || ''
    nextTick(() => {
      document.querySelector<HTMLInputElement>('#dialog-title-input')?.focus()
    })
  }
})

onClickOutside(target, (event) => {
  isOpen.value = false
})
const globalToast = useGlobalToast()

const handleSave = () => {
  if (!form.value.title.trim()) {
    return
  }
  const example = cloneDeep(form.value) as any
  example.tags = form.value.tags
    .split(',')
    .map((t) => t.trim())
    .filter((t) => !!t)

  example.id = Date.now()
  add(example)

  globalToast.success('success')
  isOpen.value = false
  form.value = { ..._initData }
}
</script>
