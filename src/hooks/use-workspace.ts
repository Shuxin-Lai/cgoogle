import { useWorkspaceStore } from '@/stores'
import type { ConfigType } from '@/types'
import { cloneDeep, merge, set as lSet } from 'lodash-es'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'

export const useWorkspace = () => {
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
      config.value = lSet(
        config.value!,
        activeTabName.value,
        merge(config.value![activeTabName.value], tabConfig),
      )
    },
  })

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
  }
}
