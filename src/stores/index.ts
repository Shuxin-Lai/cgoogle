import { APP_CONFIG, OPENAI_CONFIG } from '@/constants'
import { CustomExampleStorage, HistoryStorage } from '@/storage'
import type { ExampleItem, HistoryItem } from '@/types'
import { cloneDeep, debounce, merge } from 'lodash-es'
import type { CreateCompletionRequest, CreateEditRequest } from 'openai'
import { defineStore } from 'pinia'
import { computed, getCurrentInstance, onMounted, reactive, ref, toRaw, watch } from 'vue'

const DEFAULT_COMPLEMENT_CONFIG: CreateCompletionRequest = {
  n: 1,
  model: 'gpt-3.5-turbo',
  prompt: '',
  temperature: 0.6,
  stop: undefined,
  frequency_penalty: undefined,
  presence_penalty: undefined,
  top_p: undefined,
  max_tokens: 1000,
}

const _lastConfig = window.localStorage.getItem(OPENAI_CONFIG)
let _complementConfig = DEFAULT_COMPLEMENT_CONFIG
if (_lastConfig) {
  _complementConfig = JSON.parse(_lastConfig)
}

export const useConfigStore = defineStore('config', () => {
  const _saveToLocal = debounce(
    (v) => {
      window.localStorage.setItem(OPENAI_CONFIG, JSON.stringify(v))
    },
    200,
    {
      trailing: true,
    },
  )

  const complementConfig = ref(_complementConfig)

  const reset = () => {
    complementConfig.value = DEFAULT_COMPLEMENT_CONFIG
    localStorage.removeItem(OPENAI_CONFIG)
  }

  const setConfig = (config: CreateCompletionRequest) => {
    complementConfig.value = cloneDeep(config)
  }
  watch(
    complementConfig,
    (newVal) => {
      _saveToLocal(newVal)
    },
    {
      deep: true,
    },
  )

  return { complementConfig, setConfig, reset }
})

export const useHistoryStore = defineStore('history', () => {
  const _historyList = ref<HistoryItem[]>([])
  const add = (config: HistoryItem['config']) => {
    let prompt = config.prompt || ''
    prompt = String(config.prompt).trim()
    const conf = { ...cloneDeep(config), prompt }
    const clientId = Date.now()
    const item: HistoryItem = {
      clientId: clientId,
      stat: 'pending',
      config: conf,
    }

    _historyList.value = [item, ..._historyList.value]
    return item
  }

  const _saveToLocal = debounce(
    (historyItem: HistoryItem) => {
      return HistoryStorage.setItem(String(historyItem.clientId), toRaw(historyItem))
    },
    200,
    {
      trailing: true,
    },
  )

  const update = (clientId: number, partialItem: Partial<HistoryItem>) => {
    const list: HistoryItem[] = []

    for (const item of _historyList.value) {
      if (item.clientId == clientId) {
        const newItem = merge(item, partialItem)
        _saveToLocal(newItem)
        list.push(newItem)
      } else {
        list.push(item)
      }
    }

    _historyList.value = list
  }
  const remove = (item: HistoryItem) => {
    _historyList.value = _historyList.value.filter((i) => i.clientId != item.clientId)
    HistoryStorage.removeItem(String(item.clientId))
  }

  const clear = () => {
    _historyList.value = []
    HistoryStorage.clear()
  }

  const historyList = computed(() => {
    return [..._historyList.value].sort((a, b) => Number(b.clientId) - Number(a.clientId))
  })

  onMounted(async () => {
    const keys = await HistoryStorage.keys()
    const items = await Promise.all(keys.map((k) => HistoryStorage.getItem(k)))
    _historyList.value = items as any
  })

  return {
    historyList: historyList,
    add,
    update,
    clear,
    remove,
  }
})

export const useAppConfigStore = defineStore('app_config', () => {
  const DEFAULT_CONFIG = {
    example_type: 'list',
  }
  const _conf = JSON.parse(window.localStorage.getItem(APP_CONFIG) || '{}')
  const config = reactive<typeof DEFAULT_CONFIG>(merge(DEFAULT_CONFIG, _conf))
  const isList = computed(() => config.example_type == 'list')
  const toggleExampleType = () => {
    config.example_type = config.example_type == 'list' ? 'grid' : 'list'
  }
  const _saveConfig = debounce(
    (config) => {
      window.localStorage.setItem(APP_CONFIG, JSON.stringify(config))
    },
    200,
    { trailing: true },
  )

  watch(config, (newConfig) => {
    _saveConfig(newConfig)
  })
  return {
    config,
    isList,
    toggleExampleType,
  }
})

export const useDialogStore = defineStore('dialog', () => {
  const isOpen = ref(false)
  const isExampleOpen = ref(false)
  return {
    isOpen,
    isExampleOpen,
  }
})

export const useCustomExampleStore = defineStore('custom_example', () => {
  onMounted(async () => {
    const keys = await CustomExampleStorage.keys()
    const items = await Promise.all(keys.map((k) => CustomExampleStorage.getItem<ExampleItem>(k)))
    _list.value = items as any
  })

  const _list = ref<ExampleItem[]>([])
  const list = computed(() => {
    return [..._list.value].sort((b, a) => Number(b.id) - Number(a.id))
  })

  const add = (item: ExampleItem) => {
    CustomExampleStorage.setItem(item.id, item)
    _list.value.push(item)
  }

  const remove = (item: ExampleItem) => {
    _list.value = _list.value.filter((i) => i.id != item.id)
    CustomExampleStorage.removeItem(item.id)
  }
  return { list, add, remove }
})
