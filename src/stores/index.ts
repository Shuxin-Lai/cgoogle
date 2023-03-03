import { defineStore } from 'pinia'
import { computed, onMounted, ref, type Ref } from 'vue'
import localforage from 'localforage'
import dayjs from 'dayjs'
import { isObject, merge } from 'lodash-es'
import type { ExampleItem, HistoryItem, Item, WorkspaceItem } from '@/types'
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
  where?: (item: I, index: number) => boolean
  init?: (storage: LocalForage, items: Ref<I[]>) => any
}

function createStore<I extends Item<any>>(key: string, options?: CreateStoreOptions<I>) {
  const use = defineStore(key, () => {
    const storage = createStorage({
      name: key,
    })

    const items = ref<Array<I>>([])
    const sortedItems = computed(() => {
      return [...items.value].sort(
        (a, b) => dayjs(b.updatedTime).unix() - dayjs(a.updatedTime).unix(),
      )
    })
    const create = async (item: Partial<I> & { data: I['data'] }) => {
      const now = Date()
      const _item = {
        id: +now,
        createdTime: now,
        updatedTime: now,
        ...item,
      } as I as any
      items.value = [...items.value, _item]
      await storage.setItem(String(_item.id), _item)
      return _item
    }

    const remove = async (item: Partial<I> & { id: I['id'] }) => {
      items.value = items.value.filter((i) => i.id != item.id)
      await storage.removeItem(String(item.id))
    }

    const removeAll = async () => {
      items.value = []
      await storage.clear()
    }

    const update = async (item: Partial<I> & { id: I['id'] }) => {
      return new Promise((resolve) => {
        items.value = items.value.map((i) => {
          if (i.id == item.id) {
            const _item = merge(i, item, { updatedTime: String(new Date()) })
            storage.setItem(String(_item.id), _item).finally(() => resolve(_item))
            return _item
          }
          return i
        })
      })
    }

    const find = () => {
      if (!options || !options.where) {
        return []
      }

      return items.value.filter((item, index) => {
        return options.where!(item as I, index)
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

    onMounted(async () => {
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
    // todo
    config: {} as any,
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
export const useConfigStore = defineStore('config', () => {
  const config = ref({
    isDrawerOpen: true,
    isConfigOpen: true,
  })

  return {
    config,
  }
})
