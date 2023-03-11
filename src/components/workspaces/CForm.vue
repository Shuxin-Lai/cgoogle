<template>
  <div class="flex flex-col gap-4">
    <c-form-item
      label="Model"
      tooltip="ID of the model to use. You can use the List models API to see all of your available models, or see our Model overview for descriptions of them."
    >
      <select
        :value="config['model']"
        class="select-bordered select w-full"
        @change="handleUpdate('model', $event)"
      >
        <option v-for="o in options" :key="o.value" :value="o.value">
          {{ o.label }}
        </option>
      </select>
    </c-form-item>

    <c-form-item
      label="N"
      tooltip="How many completions to generate for each prompt. Note: Because this parameter generates many completions, it can quickly consume your token quota. Use carefully and ensure that you have reasonable settings for max_tokens and stop."
    >
      <input
        :value="config['n']"
        @input="handleUpdate('n', $event)"
        min="0"
        max="10"
        type="number"
        class="input-bordered input w-full"
      />
    </c-form-item>

    <c-form-item
      label="Max Tokens"
      tooltip="The maximum number of tokens to generate in the completion. The token count of your prompt plus max_tokens cannot exceed the model's context length. Most models have a context length of 2048 tokens (except for the newest models, which support 4096)."
    >
      <input
        :value="config['max_tokens']"
        @input="handleUpdate('max_tokens', $event)"
        min="0"
        max="2048"
        placeholder="0 ~ 2048(4096)"
        type="number"
        class="input-bordered input w-full"
      />
    </c-form-item>

    <c-form-item
      label="Temperature"
      tooltip="What sampling temperature to use. Higher values means the model will take more risks. Try 0.9 for more creative applications, and 0 (argmax sampling) for ones with a well-defined answer. We generally recommend altering this or top_p but not both."
    >
      <input
        :value="config['temperature']"
        @input="handleUpdate('temperature', $event)"
        min="0"
        max="1"
        type="number"
        class="input-bordered input w-full"
      />
    </c-form-item>

    <c-form-item
      label="Presence Penalty"
      tooltip="Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics. "
    >
      <input
        :value="config['presence_penalty']"
        @input="handleUpdate('presence_penalty', $event)"
        min="-2"
        max="2"
        placeholder="-2 ~ 2"
        type="number"
        class="input-bordered input w-full"
      />
    </c-form-item>

    <c-form-item
      label="Top P"
      tooltip="An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or temperature but not both."
    >
      <input
        :value="config['top_p']"
        @input="handleUpdate('top_p', $event)"
        min="0"
        max="1"
        placeholder="0 ~ 1"
        type="number"
        class="input-bordered input w-full"
      />
    </c-form-item>
    <c-form-item>
      <template #label>
        <div class="flex w-full">
          <span class="flex-1"> Stop </span>

          <div class="tooltip tooltip-left tooltip-primary" data-tip="Add a \n">
            <kbd
              class="kbd kbd-sm cursor-pointer"
              @click.prevent="
                () => {
                  stop = '\n'
                  handleAddStop()
                }
              "
            >
              <span class="lowercase">\n</span>
            </kbd>
          </div>
        </div>
      </template>
      <div class="flex">
        <input v-model="stop" class="input-bordered input flex-1" />
        <button
          class="btn-outline btn hover:bg-transparent hover:text-black"
          @click="handleAddStop"
        >
          Add
        </button>
      </div>
      <div class="mt-4 flex flex-wrap gap-2">
        <div
          v-for="s in stops"
          :key="s"
          class="badge-ghost badge-outline badge cursor-pointer gap-2"
          @click="handleRemoveStop(s)"
        >
          <font-awesome-icon icon="fa-solid fa-xmark" />
          <span>{{ s }}</span>
        </div>
      </div>
    </c-form-item>
  </div>
</template>

<script setup lang="ts">
import type { ConfigType, HistoryData } from '@/types'
import { computed, ref } from 'vue'
import CFormItem from './CFormItem.vue'
const stop = ref('')
const props = defineProps<{
  config: HistoryData['config']
  type: ConfigType
}>()
const stops = computed(() => (props.config.stop || []) as string[])

const options = [
  {
    value: 'gpt-3.5-turbo',
    label: '(Chat) gpt-3.5-turbo',
  },
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
]

const emit = defineEmits(['update:config'])
const handleUpdate = (path: keyof HistoryData['config'], valueOrEvent: any) => {
  let newConfig
  if (valueOrEvent instanceof Event) {
    newConfig = {
      ...props.config,
      // @ts-ignore
      [path]: valueOrEvent.target.value,
    }
  } else {
    newConfig = {
      ...props.config,
      [path]: valueOrEvent,
    }
  }
  emit('update:config', newConfig)
}

const handleAddStop = () => {
  if (!stop.value) {
    return ''
  }

  handleUpdate('stop', Array.from(new Set([stop.value, ...stops.value])))
  stop.value = ''
}
const handleRemoveStop = (s: string) => {
  const _stops = stops.value.filter((_s) => _s != s)
  handleUpdate('stop', {
    ...props.config,
    stop: _stops,
  })
}
</script>

<style scoped></style>
