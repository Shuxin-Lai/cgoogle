<template>
  <teleport to="body">
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
            <ul class="menu menu-compact flex flex-col p-0 px-4">
              <li class="menu-title pb-2">Workspaces</li>
              <li v-for="item in menu" :key="item.id">
                <router-link :to="item.to" class="flex gap-4" active-class="bg-base-300">
                  <span class="flex-1">
                    {{ item.data.name }}
                  </span>
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

const { isDrawerOpen } = storeToRefs(useGlobalConfigStore())
const { sortedItems } = storeToRefs(useWorkspaceStore())

const menu = computed(() => {
  return sortedItems.value.map((item) => {
    let to = `/workspaces/${item.id}/`
    const active = item.data.meta.tabs.find((i) => i.isActive)
    to = active ? to + active.name : to + item.data.meta.tabs[0].name

    return { ...item, to }
  })
})
</script>

<style scoped lang="scss">
.drawer-container {
  width: var(--vt-drawer-width);
}
</style>
