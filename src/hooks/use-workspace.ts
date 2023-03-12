import { useExampleStore, useHistoryStore, useWorkspaceStore } from '@/stores'
import type { ConfigType } from '@/types'
import { cloneDeep, merge, set as lSet } from 'lodash-es'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { builtinExampleList } from '@/data'
import { storeToRefs } from 'pinia'
import { getDefaultConfig } from '@/constants'
import { dayjs } from '@/utils'

export const useWorkspace = () => {
  const exampleStore = useExampleStore()
  const historyStore = useHistoryStore()
  const route = useRoute()
  const workspaceId = computed(() => {
    return Number(route.params.id)
  })
  const { findOne, update } = useWorkspaceStore()

  const workspace = computed({
    get: () => {
      return findOne(workspaceId.value)
    },
    set(w) {
      update(w as any)
    },
  })

  const tabs = computed(() => {
    return workspace.value?.data.meta.tabs || []
  })

  const activeTabName = computed<ConfigType>(() => {
    const cmps = route.path.split('/')
    return cmps[cmps.length - 1] as ConfigType
  })

  // example
  const activeExampleId = computed(() => workspace.value?.data.activeExampleId)
  const exampleList = computed(() => {
    if (!workspaceId.value) {
      return []
    }
    return exampleStore.find({
      where: (item) => item.data.workspaceId == workspaceId.value,
    })
  })

  const activeExample = computed(() => {
    if (!activeExampleId.value) {
      return null
    }
    const builtinExample = builtinExampleList.find((item) => item.id == activeExampleId.value)
    if (builtinExample) {
      return builtinExample
    }
    return exampleList.value.find((item) => item.id == activeExampleId.value)
  })

  const historyList = computed(() => {
    if (workspaceId.value == null) {
      return []
    }

    return historyStore
      .find({
        where: (item) => item.data.workspaceId == workspaceId.value,
      })
      .sort((a, b) => (dayjs(a.updatedTime).isBefore(dayjs(b.updatedTime)) ? 1 : -1))
  })

  const config = computed({
    get: () => {
      return workspace.value?.data.config
    },
    set(c) {
      workspace.value = lSet(
        workspace.value!,
        'data.config',
        merge(workspace.value!.data.config, c),
      )
    },
  })

  const currentTabConfig = computed({
    get: () => {
      if (!config.value) {
        return null
      }

      return config.value[activeTabName.value]
    },
    set(tabConfig) {
      config.value = lSet(config.value!, activeTabName.value, tabConfig)
    },
  })

  const resetCurrentTagConfig = () => {
    currentTabConfig.value = getDefaultConfig(activeTabName.value) as any
  }

  watch(activeTabName, (n) => {
    if (!workspace.value) {
      return
    }
    const data = cloneDeep(workspace.value.data)
    data.meta.tabs = data.meta.tabs.map((i) =>
      i.name == n ? { ...i, isActive: true } : { ...i, isActive: false },
    )
    update({ id: workspaceId.value, data })
  })

  return {
    tabs,
    activeTabName,
    workspace,
    workspaceId,
    config,
    currentTabConfig,
    activeExampleId,
    activeExample,
    exampleList,
    historyList,

    resetCurrentTagConfig,
  }
}
