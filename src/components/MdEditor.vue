<template>
  <div class="md-editor">
    <div class="mb-2 flex gap-8">
      <div class="flex items-center gap-2">
        <span> Mode: </span>
        <div class="flex gap-4">
          <label v-for="mode in modes" :key="mode" :for="mode" @click="handleChange(mode)">
            <input
              type="radio"
              :name="mode"
              class="radio radio-sm"
              :checked="currentMode == mode"
            />
            {{ mode }}
          </label>
        </div>
      </div>
      <div>
        <span class="cursor-pointer underline" @click="handleCopy">Copy</span>
      </div>
    </div>

    <div class="md-editor" :id="id" v-bind="$attrs"></div>
  </div>
</template>

<script setup lang="ts">
import { copyToClipboard } from '@/utils'
import breaks from '@bytemd/plugin-breaks'
import gfm from '@bytemd/plugin-gfm'
import highlight from '@bytemd/plugin-highlight'
import { Editor } from 'bytemd'
import { onBeforeMount, onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'

const plugins = [
  gfm(),
  highlight(),
  breaks(),
  // Add more plugins here
]
const props = defineProps<{ initialValue?: string; initialMode?: string }>()

let _id = 0
const id = 'md-editor-' + _id++
const modes = ['tab', 'split']
const currentMode = ref(props.initialMode || modes[0])
let editor: any
const emit = defineEmits(['change-mode', 'change'])
const toast = useToast()
let text = props.initialValue || ''

onMounted(() => {
  // @ts-ignore
  editor = new Editor({
    target: document.querySelector('#' + id), // DOM to render
    props: {
      mode: currentMode.value,
      value: text,
      plugins,
    },
  })

  // @ts-ignore
  editor.$on('change', (e) => {
    // @ts-ignore
    editor.$set({ value: e.detail.value })
    text = e.detail.value
    emit('change', e.detail.value)
  })
})

const handleCopy = () => {
  copyToClipboard(text)
  toast.success('Copied')
}
const handleChange = (mode: string) => {
  currentMode.value = mode
  editor?.$set({ mode: mode })
  emit('change-mode', mode)
}

onBeforeMount(() => {
  editor?.$destroy()
})
</script>

<style lang="scss">
.md-editor {
  .bytemd {
    height: calc(100vh - 75px);
  }
}
</style>
