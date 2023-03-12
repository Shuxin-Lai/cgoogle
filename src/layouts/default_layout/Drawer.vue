<template>
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
              <li v-for="item in menu" :key="item.id" class="menu-item mb-2 px-4">
                <router-link
                  :to="item.to"
                  class="flex gap-4"
                  :class="{ 'bg-base-300': item.isActive }"
                >
                  <span class="flex-1">
                    {{ item.data.name }}
                  </span>
                  <div class="menu-item__actions flex gap-4">
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

        <div class="user flex h-16 items-center pl-6">User</div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { useGlobalConfigStore, useWorkspaceStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { getInitialWorkspace } from '@/constants'
import { dayjs } from '@/utils'
import { useRoute, useRouter } from 'vue-router'
import { TabGroup } from '@headlessui/vue'
import type { WorkspaceItem } from '@/types'

const workspaceStore = useWorkspaceStore()
const { isDrawerOpen } = storeToRefs(useGlobalConfigStore())
const { items } = storeToRefs(workspaceStore)
const { create } = workspaceStore
const router = useRouter()
const route = useRoute()

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
  alert(item.data.name)
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
