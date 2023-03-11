import { defineStore } from 'pinia'
import { computed, onMounted, onBeforeMount, ref, toRaw, watch, type Ref } from 'vue'
import localforage from 'localforage'
import dayjs from 'dayjs'
import { cloneDeep, debounce, isObject, merge } from 'lodash-es'
import type { ExampleItem, GlobalConfig, HistoryItem, Item, WorkspaceItem } from '@/types'
import { L_GLOBAL_CONFIG } from '@/constants'
import { shallowMerge } from '@/utils'
const APP_NAME = 'coogle'

const common = {
  driver: localforage.INDEXEDDB, // Force WebSQL; same as using setDriver()
  name: APP_NAME,
  version: 1.0,
  // size: 4980736, // Size of database, in bytes. WebSQL-only for now.
  description: '',
}

function createStorage(partialConfig: LocalForageOptions) {
  return localforage.createInstance(merge(common, partialConfig))
}

export interface CreateStoreOptions<I extends Item<any>> {
  // where?: (item: I, index: number) => boolean
  init?: (storage: LocalForage, items: Ref<I[]>) => any
}

function createStore<I extends Item<any>>(key: string, options?: CreateStoreOptions<I>) {
  const use = defineStore(key, () => {
    const storage = createStorage({
      name: key,
    })
    const trailingSetItem = debounce(
      (key: string, value: any) => {
        return storage.setItem(key, value)
      },
      400,
      { trailing: true },
    )

    const items = ref<Array<I>>([])
    const sortedItems = computed(() => {
      return [...items.value].sort(
        (a, b) => dayjs(b.updatedTime).unix() - dayjs(a.updatedTime).unix(),
      )
    })
    const create = async (item: Partial<I> & { data: I['data'] }) => {
      const now = dayjs()
      const _item = {
        id: now.unix(),
        createdTime: now.toString(),
        updatedTime: now.toString(),
        ...item,
      } as I as any
      items.value = [...items.value, _item]
      await storage.setItem(String(_item.id), cloneDeep(_item))
      return _item as I
    }

    const remove = async (item: Partial<I> & { id: I['id'] }) => {
      items.value = items.value.filter((i) => i.id != item.id)
      await storage.removeItem(String(item.id))
    }

    const removeAll = async () => {
      items.value = []
      await storage.clear()
    }

    let promise = Promise.resolve() as Promise<any>
    const update = async (item: Partial<I> & { id: I['id'] }) => {
      return new Promise((resolve) => {
        items.value = items.value.map((i) => {
          if (i.id == item.id) {
            const _item = merge(cloneDeep(i), { updatedTime: dayjs().toString() })
            promise = promise.then(() => {
              return Promise.resolve(trailingSetItem(String(_item.id), _item)).finally(() =>
                resolve(_item),
              )
            })

            return _item
          }
          return i
        })
      })
    }

    const find = (config: { where: (item: I, index: number) => boolean }) => {
      return items.value.filter((item, index) => {
        return config.where(item as I, index)
      })
    }

    const findOne = (itemOrId: number | (Partial<I> & { id: I['id'] })) => {
      let id: number
      if (isObject(itemOrId)) {
        id = itemOrId.id
      } else {
        id = itemOrId
      }
      return items.value.find((i) => i.id == id)
    }

    onBeforeMount(async () => {
      if (options?.init) {
        options.init(storage, items as any)
        return
      }
      const keys = await storage.keys()
      const data = await Promise.all(keys.map((k) => storage.getItem(k)))
      items.value = data as any
    })

    return {
      storage,
      items,
      sortedItems,
      create,
      remove,
      update,
      removeAll,
      find,
      findOne,
    }
  })

  return use
}

const defaultWorkspace: WorkspaceItem = {
  id: 0,
  createdTime: String(new Date()),
  updatedTime: String(new Date()),
  data: {
    name: 'Default',
    meta: {
      tabs: [
        {
          name: 'writer',
          isActive: true,
        },
        {
          name: 'chat',
          isActive: false,
        },
        {
          name: 'code',
          isActive: false,
        },
      ],
    },
    // todo
    config: {
      writer: {
        prompt: '',
        model: '',
      },
      chat: {
        model: '',
        messages: [],
      },
      code: {
        model: '',
      },
    },
  },
}
export const useHistoryStore = createStore<HistoryItem>('history')
export const useWorkspaceStore = createStore<WorkspaceItem>('workspace', {
  async init(storage, items) {
    const keys = await storage.keys()
    if (keys.length) {
      const data = await Promise.all(keys.map((k) => storage.getItem(k)))
      items.value = data as any
    } else {
      items.value = [defaultWorkspace]

      await storage.setItem(String(defaultWorkspace.id), defaultWorkspace)
    }
  },
})

export const useExampleStore = createStore<ExampleItem>('example')

export const useGlobalConfigStore = defineStore('config', () => {
  const initialConfig: GlobalConfig = {
    exampleType: 'simple',
    isDrawerOpen: true,
    isConfigOpen: true,
  }
  const config = ref(initialConfig)

  const isDrawerOpen = computed(() => config.value.isDrawerOpen)
  const isConfigOpen = computed(() => config.value.isConfigOpen)
  const toggleDrawer = () => {
    config.value.isDrawerOpen = !config.value.isDrawerOpen
  }

  const toggleConfig = () => {
    config.value.isConfigOpen = !config.value.isConfigOpen
  }

  onBeforeMount(() => {
    const _cacheConfigStr = window.localStorage.getItem(L_GLOBAL_CONFIG)
    if (!_cacheConfigStr) {
      return
    }

    config.value = shallowMerge({}, initialConfig, JSON.parse(_cacheConfigStr))
  })

  watch(
    config,
    debounce(
      (newConfig) => {
        window.localStorage.setItem(L_GLOBAL_CONFIG, JSON.stringify(newConfig))
      },
      200,
      { trailing: true },
    ),
    { deep: true },
  )

  return {
    config,
    isConfigOpen,
    isDrawerOpen,
    toggleConfig,
    toggleDrawer,
  }
})
