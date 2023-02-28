<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-end gap-2">
      <button class="underline" @click="handleSave">Save</button>
      <button class="underline" @click="reset">Reset</button>
    </div>
    <div v-for="field in complementFields" :key="field.name" class="field">
      <label class="block">
        <div class="mb-2 flex items-center gap-2">
          <!-- label  -->
          <span class="capitalize text-gray-700">
            {{ startCase(field.name) }}
          </span>
          <div
            v-if="field.props.placeholder"
            class="tooltip tooltip-left tooltip-primary"
            :data-tip="field.props.placeholder"
          >
            <svg
              t="1677419404678"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2237"
              width="20"
              height="20"
            >
              <path
                d="M509.92 795.84c157.904 0 285.92-128.016 285.92-285.92C795.84 352 667.808 224 509.92 224 352 224 224 352 224 509.92c0 157.904 128 285.92 285.92 285.92z m0 48C325.504 843.84 176 694.32 176 509.92 176 325.504 325.504 176 509.92 176c184.416 0 333.92 149.504 333.92 333.92 0 184.416-149.504 333.92-333.92 333.92z m-2.448-400.704h16a16 16 0 0 1 16 16v201.728a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V459.136a16 16 0 0 1 16-16z m0-100.176h16a16 16 0 0 1 16 16v23.648a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16v-23.648a16 16 0 0 1 16-16z"
                fill="#000000"
                p-id="2238"
              ></path>
            </svg>
          </div>
        </div>
        <template v-if="field.type == 'list'">
          <div class="flex items-center">
            <input
              v-bind="field.props"
              type="text"
              class="input-bordered input w-full max-w-xs"
              :id="`list-${field.name}`"
              v-on:keyup.enter="handleAdd(field)"
            />
            <button
              class="btn-outline btn hover:bg-transparent hover:text-black"
              @click="handleAdd(field)"
            >
              Add
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="(tag, index) in getItems(complementConfig[field.name])"
              class="mt-2 flex gap-2"
              :key="index"
            >
              <div
                class="badge-ghost badge-outline badge cursor-pointer gap-2"
                @click.prevent="handleDelete(field, tag)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  class="inline-block h-4 w-4 stroke-current"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
                {{ tag.includes('\n') ? JSON.stringify(tag) : tag }}
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="field.type != 'select'">
          <input
            v-model="complementConfig[field.name]"
            v-bind="field.props"
            :type="field.type"
            class="input-bordered input w-full max-w-xs"
          />
        </template>
        <template v-else>
          <select
            v-model="complementConfig[field.name]"
            class="select-bordered select w-full max-w-xs"
          >
            <option v-for="o in field.options" :key="o.value" :value="o.value">
              {{ o.label || o.value }}
            </option>
          </select>
        </template>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConfigStore, useDialogStore } from '@/stores'
import { startCase } from 'lodash-es'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
const { isOpen } = storeToRefs(useDialogStore())

const complementFields = [
  {
    name: 'model',
    type: 'select',
    options: [
      {
        value: 'text-davinci-003',
        label: '(GPT-3) text-davinci-003',
      },
      {
        value: 'text-curie-001',
        label: '(GPT-3) text-curie-001',
      },
      {
        value: 'text-babbage-001',
        label: '(GPT-3) text-babbage-001',
      },
      {
        value: 'text-ada-001',
        label: '(GPT-3) text-ada-001',
      },
      {
        value: 'code-davinci-002',
        label: '(Codex) code-davinci-002',
      },
      {
        value: 'code-cushman-001',
        label: '(Codex) code-cushman-001',
      },
    ],
    props: {
      placeholder:
        'ID of the model to use. You can use the List models API to see all of your available models, or see our Model overview for descriptions of them.',
    },
  },
  {
    name: 'n',
    type: 'number',
    props: {
      placeholder:
        'How many completions to generate for each prompt. Note: Because this parameter generates many completions, it can quickly consume your token quota. Use carefully and ensure that you have reasonable settings for max_tokens and stop.',
      min: 0,
      max: 10,
    },
  },
  {
    name: 'max_tokens',
    type: 'number',
    props: {
      placeholder: `The maximum number of tokens to generate in the completion. The token count of your prompt plus max_tokens cannot exceed the model's context length. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).`,
      min: 0,
    },
  },
  {
    name: 'temperature',
    type: 'number',
    props: {
      placeholder: `What sampling temperature to use. Higher values means the model will take more risks. Try 0.9 for more creative applications, and 0 (argmax sampling) for ones with a well-defined answer. We generally recommend altering this or top_p but not both.`,
    },
  },
  {
    name: 'frequency_penalty',
    type: 'number',
    props: {
      placeholder: `Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.`,
      min: -2,
      max: 2,
    },
  },
  {
    name: 'presence_penalty',
    type: 'number',
    props: {
      placeholder: `Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics. `,
      min: -2,
      max: 2,
    },
  },
  {
    name: 'top_p',
    type: 'number',
    props: {
      placeholder: `An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or temperature but not both.`,
    },
  },
  {
    name: 'stop',
    type: 'list',
    props: {
      placeholder: '',
    },
  },
]
const store = useConfigStore()
const { reset } = store
const { complementConfig } = storeToRefs(store)
const getItems = (str: string | string[]) => {
  if (Array.isArray(str)) {
    return str
  }
  str = str || ''
  return str
    .split(',')
    .map((i) => i.trim())
    .filter((s) => !!s)
}
const handleDelete = (field: (typeof complementFields)[0], tag: string) => {
  const items = getItems(complementConfig.value[field.name])
  const res = items.filter((i) => i != tag)
  complementConfig.value[field.name] = res
}

const handleAdd = (field: (typeof complementConfig)[0]) => {
  const id = `list-${field.name}`
  const input = document.querySelector<HTMLInputElement>('#' + id)!
  const value = input.value
  if (!value) {
    return
  }

  const items = getItems(complementConfig.value[field.name])
  const newItems = [value, ...items]

  complementConfig.value[field.name] = Array.from(new Set(newItems))
  input.value = ''
}
const handleSave = () => {
  isOpen.value = true
}
</script>

<style scoped></style>
