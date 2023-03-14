<template>
  <workspace-editor
    :visible="visible"
    :item="editingWorkspace"
    @cancel="visible = false"
    @confirm="handleConfirm"
    @delete="handleDelete"
  />

  <teleport to="#sider">
    <transition name="slideLeft">
      <div
        v-show="isDrawerOpen"
        class="drawer-container fixed top-0 left-0 z-50 h-screen overflow-auto bg-base-200"
      >
        <div class="wrapper">
          <router-link class="cursor-pointer" to="/">
            <div class="logo flex h-16 items-center pl-6">
              <div class="font-title inline-flex text-3xl font-semibold text-primary">
                <span class="capitalize"> Coogle </span>
              </div>
            </div>
          </router-link>
          <div class="workspaces" style="height: calc(100vh - 8rem)">
            <ul class="menu menu-compact flex flex-col p-0">
              <li class="menu-title pb-2">
                <div class="flex items-center justify-between">
                  <span> Workspaces </span>
                  <div class="flex gap-4">
                    <button class="btn-ghost btn-xs" @click="handleAddWorkspace">+</button>
                  </div>
                </div>
              </li>
              <li v-for="(item, index) in menu" :key="item.id" class="menu-item mb-2 px-4">
                <router-link
                  :to="item.to"
                  class="flex gap-4"
                  :class="{ 'bg-base-300': item.isActive }"
                >
                  <span class="flex-1">
                    {{ item.data.name }}
                  </span>
                  <div v-if="index != 0" class="menu-item__actions flex gap-4">
                    <font-awesome-icon
                      icon="fa-solid fa-pen-to-square"
                      @click.prevent="handleEdit(item)"
                    />
                  </div>
                </router-link>
              </li>
            </ul>
          </div>
        </div>

        <!-- <div class="user flex h-16 items-center pl-6">User</div> -->
        <div class="flex h-16 cursor-pointer items-center pl-6" @click="handleClear">
          Clear All Data
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import {
  useGlobalConfigStore,
  useWorkspaceStore,
  useExampleStore,
  useHistoryStore,
  getStorages,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { getInitialWorkspace } from '@/constants'
import { dayjs } from '@/utils'
import { useRoute, useRouter } from 'vue-router'
import type { WorkspaceData, WorkspaceItem } from '@/types'
import WorkspaceEditor from '@/views/Workspaces/id/WorkspaceEditor.vue'
import { set } from 'lodash-es'

const workspaceStore = useWorkspaceStore()
const exampleStore = useExampleStore()
const historyStore = useHistoryStore()
const { isDrawerOpen } = storeToRefs(useGlobalConfigStore())
const { items } = storeToRefs(workspaceStore)
const { create, remove, update } = workspaceStore
const router = useRouter()
const route = useRoute()
const editingWorkspace = ref<WorkspaceItem | null>(null)
const visible = ref(false)

const menu = computed(() => {
  const activeId = route.params.id as string

  return items.value.map((item) => {
    let to = `/workspaces/${item.id}/`
    const {
      data: { activeTabName },
    } = item

    const active = activeTabName
      ? item.data.meta.tabs.find((i) => i.name == activeTabName)
      : item.data.meta.tabs[0]

    to = active ? to + active.name : to + item.data.meta.tabs[0].name

    return { ...item, to, isActive: String(item.id) == activeId }
  })
})

const handleAddWorkspace = async () => {
  const item = await create({
    data: getInitialWorkspace('Workspace-' + dayjs().format('YYYY-MM-DD')),
  })
  let to = `/workspaces/${item.id}/`
  const active = item.data.meta.tabs.find((i) => i.isActive)
  to = active ? to + active.name : to + item.data.meta.tabs[0].name
  router.push(to)
}

const handleEdit = (item: WorkspaceItem) => {
  editingWorkspace.value = item
  visible.value = true
}
const handleConfirm = async (workspaceData: WorkspaceData) => {
  const ws = set(editingWorkspace.value!, 'data', workspaceData)
  await update(ws)
  visible.value = false
}
const handleDelete = async () => {
  visible.value = false
  const _id = route.params.id as string
  if (route.path.startsWith('/workspaces') && _id == String(editingWorkspace.value!.id)) {
    router.replace(menu.value[0].to)
  }
  await Promise.all([
    historyStore.removeMore({
      where: (item) => item.data.workspaceId == editingWorkspace.value!.id,
    }),
    exampleStore.removeMore({
      where: (item) =>
        item.data.workspaceId != null && item.data.workspaceId == editingWorkspace.value!.id,
    }),
    remove(editingWorkspace.value!),
  ])
}

const handleClear = async () => {
  if (!window.confirm('Are you sure to remove all data?')) {
    return
  }
  const storages = getStorages()
  const storageList = Object.keys(storages).map((key) => storages[key])
  const promises = storageList.map((s) => s.clear())
  await Promise.all(promises)
  window.localStorage.clear()
  window.location.href = '/'
}
</script>

<style scoped lang="scss">
.drawer-container {
  width: var(--vt-drawer-width);
}

.menu-item {
  &__actions {
    @apply transition-all;
    opacity: 0;
  }

  &:hover {
    .menu-item__actions {
      opacity: 1;
    }
  }
}
</style>
