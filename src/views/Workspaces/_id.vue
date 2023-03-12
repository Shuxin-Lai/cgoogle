<template>
  <config-saver
    :visible="isShow"
    :type="activeTabName"
    :initial-value="{ defaultInput: currentTabConfig.prompt }"
    @cancel="isShow = false"
    @confirm="handleSave"
  />

  <config
    v-if="currentTabConfig"
    :config="currentTabConfig"
    :type="activeTabName"
    @change="handleChange"
    @save="handleSaveConfig"
    @reset="handleResetConfig"
  />

  <TransitionRoot
    :show="workspace != null"
    enter="transition-opacity duration-75"
    enter-from="opacity-0"
    enter-to="opacity-100"
    leave="transition-opacity duration-150"
    leave-from="opacity-100"
    leave-to="opacity-0"
    class="relative"
  >
    <div
      class="header sticky inset-x-0 top-0 z-10 flex h-12 items-center justify-between bg-white px-4"
    >
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
        @click="handleChangeTab(tab)"
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
import { useExampleStore, useGlobalConfigStore, useWorkspaceStore } from '@/stores'
import { useToast } from 'vue-toastification'
import { ref } from 'vue'
import ConfigSaver from './id/ConfigSaver.vue'
import type { ExampleData } from '@/types'
import { cloneDeep, set } from 'lodash-es'
import { logger } from '@/utils'

const isShow = ref(false)
const configStore = useGlobalConfigStore()
const exampleStore = useExampleStore()

const { success } = useToast()
const { toggleConfig, toggleDrawer } = configStore
const { tabs, activeTabName, workspace, currentTabConfig, workspaceId, resetCurrentTagConfig } =
  useWorkspace()

const handleChange = (config: any) => {
  currentTabConfig.value = config
}
const handleSaveConfig = () => {
  isShow.value = true
}
const handleResetConfig = () => {
  resetCurrentTagConfig()
  success('success')
}

const handleSave = async (form: ExampleData) => {
  isShow.value = false
  form = {
    ...form,
    workspaceId: form.isGlobal ? null : workspaceId.value!,
    config: { ...currentTabConfig.value } as any,
  }
  await exampleStore.create({
    data: form,
  })
  success('Saved')
}

const handleChangeTab = (tab: any) => {
  if (tab.name == activeTabName.value) {
    return
  }

  workspace.value = set(workspace.value!, 'data.activeTabName', tab.name)
}
</script>

<style scoped></style>
