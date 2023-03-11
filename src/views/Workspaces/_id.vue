<template>
  <TransitionRoot
    :show="workspace != null"
    enter="transition-opacity duration-75"
    enter-from="opacity-0"
    enter-to="opacity-100"
    leave="transition-opacity duration-150"
    leave-from="opacity-100"
    leave-to="opacity-0"
  >
    <config
      v-if="currentTabConfig"
      :config="currentTabConfig"
      :type="activeTabName"
      @change="handleChange"
    />

    <div class="header flex h-8 items-center justify-between px-4">
      <div class="left">
        <div class="tooltip tooltip-right tooltip-primary" data-tip="Menu">
          <menu-icon @click="toggleDrawer" />
        </div>
      </div>
      <div class="right">
        <div class="tooltip tooltip-left tooltip-primary" data-tip="Config">
          <menu-icon @click="toggleConfig" />
        </div>
      </div>
    </div>

    <div class="tabs flex justify-center">
      <router-link
        v-for="tab in tabs"
        :to="{
          path: `/workspaces/${$route.params.id}/${tab.name}`,
        }"
        :key="tab.name"
        class="tab-bordered tab"
        :class="{ 'tab-active': tab.name == activeTabName }"
      >
        <span class="capitalize">
          {{ tab.title || tab.name }}
        </span>
      </router-link>
    </div>

    <div class="mt-4"></div>
    <div class="px-4">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </TransitionRoot>
</template>

<script setup lang="ts">
import Config from '@/components/workspaces/Config.vue'
import { TransitionRoot } from '@headlessui/vue'
import { useWorkspace } from '@/hooks'
import MenuIcon from '@/components/MenuIcon.vue'
import { useGlobalConfigStore } from '@/stores'

const configStore = useGlobalConfigStore()
const { toggleConfig, toggleDrawer } = configStore
const { tabs, activeTabName, workspace, currentTabConfig } = useWorkspace()
const handleChange = (config: any) => {
  currentTabConfig.value = config
}
</script>

<style scoped></style>
