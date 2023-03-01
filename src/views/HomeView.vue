<template>
  <teleport to="body">
    <Dialog :open="isOpen" class="absolute z-50">
      <div class="fixed inset-0 bg-black/30" />
      <div class="fixed inset-0 flex items-center justify-center">
        <DialogPanel ref="target" class="mx-48 w-full rounded">
          <div class="max-h-screen overflow-auto py-12">
            <div class="bg-white p-8">
              <template v-if="list.length">
                <div class="mb-4 border-b pb-4">
                  <example-list :is-custom="true" :list="list" @click="handleClickExample" />
                </div>
              </template>

              <example-list @click="handleClickExample" />
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  </teleport>

  <div class="flex pb-8">
    <div
      class="left min-h-screen flex-1 border-r pt-4 pr-8"
      :style="'max-width: calc(100% - 24rem);'"
    >
      <div class="prompt-input">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Prompt</span>
          </label>
          <div class="relative">
            <textarea
              v-model="complementConfig['prompt']"
              ref="inputRef"
              id="prompt-input"
              class="textarea-bordered textarea w-full"
              rows="5"
              :placeholder="placeholder"
            ></textarea>
            <div class="icons absolute bottom-4 right-4 flex cursor-pointer gap-2">
              <div class="fill" @click="handleFill">
                <svg
                  t="1677590278425"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="6299"
                  width="20"
                  height="20"
                >
                  <path
                    d="M951.590853 487.890906c-26.565029-42.027186-63.46545-78.221526-109.667725-107.590414-65.573461-41.669028-130.532939-57.397245-151.306054-61.633732l-232.413304-232.403071c-7.992021-7.992021-20.957311-7.992021-28.939099 0l-14.530948 14.530948c-87.083357 1.401929-161.160493 14.633279-214.965933 38.476313-29.757744 13.180184-53.048193 29.491685-69.226664 48.484248-17.744129 20.834514-26.738991 44.401256-26.738991 70.055542 0 37.319977 14.807241 70.157873 44.002167 97.592712 2.097778 1.964748 4.267187 3.90903 6.508227 5.812379l-87.380116 87.380116c-59.566654 59.556421-59.566654 156.483984 0 216.071104l228.002854 228.002854c29.77821 29.77821 68.888973 44.657082 108.009969 44.657082 39.131229 0 78.262458-14.899338 108.050901-44.687782l235.196697-235.217163c7.992021-7.992021 7.992021-20.947078 0-28.939099s-20.947078-7.992021-28.939099 0l-235.196697 235.20693c-43.61331 43.623543-114.569362 43.633776-158.182672 0.030699l-228.002854-228.002854c-43.603077-43.61331-43.603077-114.569362 0-158.172439l92.650143-92.650143c17.856693 10.161431 38.455847 19.176758 61.664432 26.974351 76.185146 25.613354 164.803463 33.308617 226.140437 35.242665 6.978948 12.474103 20.312628 20.906146 35.631522 20.906146 22.543436 0 40.809451-18.276249 40.809451-40.829917 0-22.533202-18.266016-40.788985-40.809451-40.788985-14.878872 0-27.874861 7.940856-35.007305 19.811208-109.186771-3.335978-179.805132-21.735024-213.727733-33.134655-16.567327-5.566786-31.4155-11.686157-44.524053-18.358113l213.164914-213.175147 11.870352-11.870352 3.295046 3.295046 382.870014 382.859781-25.439392 25.439392c-5.976108 5.976108-8.718569 15.001669-5.300726 22.727631 3.27458 7.439436 9.660011 12.19781 17.662265 12.19781l0.429789 0c2.517333 0.63445 13.865799 4.482081 25.981744 24.303522 13.845333 22.655999 30.341029 69.462025 30.341029 163.759691 0 31.630395 4.461615 59.402925 12.893658 80.329537 13.865799 34.393321 34.198893 39.530318 45.086871 39.530318 29.061896 0 45.025473-32.295544 53.293787-59.382459 11.205203-36.685527 16.894785-88.423889 16.894785-153.782455C1001.74309 602.122577 984.868771 540.529777 951.590853 487.890906zM183.343725 332.184635c-25.674753-21.008476-38.609343-45.864584-38.609343-74.373894 0-61.265342 89.150436-104.807021 227.255841-114.272603L183.343725 332.184635zM948.346973 803.294342c-6.569626 25.848715-13.630439 35.508725-16.782222 38.742373-5.91471-6.385431-17.058514-30.443359-17.058514-77.781504 0-88.99694-13.896498-153.813155-41.300638-192.637392-6.610558-9.363252-13.354146-16.311501-19.739577-21.468964l19.85214-19.85214c3.837398-3.837398 5.996574-9.046027 5.996574-14.46955 0-5.423523-2.159176-10.632151-5.996574-14.46955l-120.965026-120.965026c21.264303 8.55484 45.076638 20.015869 68.735477 35.171034 40.788985 26.125007 73.197092 58.031695 96.313579 94.850252 28.806069 45.844118 43.408649 99.854219 43.408649 160.536276C960.810842 725.430974 956.502723 771.193227 948.346973 803.294342z"
                    p-id="6300"
                  ></path>
                </svg>
              </div>
              <div class="clear" @click="handleClean">
                <svg
                  t="1677590028203"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="5303"
                  width="20"
                  height="20"
                >
                  <path
                    d="M556.8 512L832 236.8c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0L512 467.2l-275.2-277.333333c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l275.2 277.333333-277.333333 275.2c-12.8 12.8-12.8 32 0 44.8 6.4 6.4 14.933333 8.533333 23.466666 8.533333s17.066667-2.133333 23.466667-8.533333L512 556.8 787.2 832c6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466666-8.533333c12.8-12.8 12.8-32 0-44.8L556.8 512z"
                    fill="#666666"
                    p-id="5304"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="submit mt-4 flex justify-end gap-4">
        <button class="btn-outline btn-sm btn" @click="isOpen = true">Examples</button>
        <button
          :class="{ loading: isPaused, disabled: isPaused }"
          class="btn-primary btn-sm btn"
          @click="handleSubmit"
        >
          Submit
        </button>
      </div>

      <template v-if="historyList.length == 0">
        <div class="mt-2 flex justify-between">
          <div class="prose">
            <h3 class="prose-h3">Examples</h3>
          </div>
          <button class="btn-ghost btn" @click="toggleExampleType">
            <svg
              v-if="!isList"
              t="1677589638615"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="3285"
              width="20"
              height="20"
            >
              <path
                d="M179.712 501.28896l264.47872 0c11.32544 0 20.48-9.15456 20.48-20.48L464.67072 216.33024c0-11.32544-9.15456-20.48-20.48-20.48L179.712 195.85024c-11.32544 0-20.48 9.15456-20.48 20.48l0 264.47872C159.232 492.11392 168.40704 501.28896 179.712 501.28896zM200.192 236.81024l223.51872 0 0 223.51872L200.192 460.32896 200.192 236.81024z"
                p-id="3286"
              ></path>
              <path
                d="M529.63328 501.28896l264.47872 0c11.32544 0 20.48-9.15456 20.48-20.48L814.592 216.33024c0-11.32544-9.15456-20.48-20.48-20.48L529.63328 195.85024c-11.32544 0-20.48 9.15456-20.48 20.48l0 264.47872C509.15328 492.11392 518.32832 501.28896 529.63328 501.28896zM550.11328 236.81024l223.51872 0 0 223.51872L550.11328 460.32896 550.11328 236.81024z"
                p-id="3287"
              ></path>
              <path
                d="M179.712 851.21024l264.47872 0c11.32544 0 20.48-9.15456 20.48-20.48L464.67072 566.23104c0-11.32544-9.15456-20.48-20.48-20.48L179.712 545.75104c-11.32544 0-20.48 9.15456-20.48 20.48l0 264.47872C159.232 842.0352 168.40704 851.21024 179.712 851.21024zM200.192 586.71104l223.51872 0 0 223.51872L200.192 810.22976 200.192 586.71104z"
                p-id="3288"
              ></path>
              <path
                d="M509.15328 830.73024c0 11.32544 9.15456 20.48 20.48 20.48l264.47872 0c11.32544 0 20.48-9.15456 20.48-20.48L814.592 566.23104c0-11.32544-9.15456-20.48-20.48-20.48L529.63328 545.75104c-11.32544 0-20.48 9.15456-20.48 20.48L509.15328 830.73024zM550.11328 586.71104l223.51872 0 0 223.51872L550.11328 810.22976 550.11328 586.71104z"
                p-id="3289"
              ></path>
            </svg>

            <svg
              v-else
              t="1677589611678"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2294"
              width="20"
              height="20"
            >
              <path
                d="M912 192H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM912 476H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM912 760H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"
                p-id="2295"
              ></path>
              <path d="M160 228m-56 0a56 56 0 1 0 112 0 56 56 0 1 0-112 0Z" p-id="2296"></path>
              <path d="M160 512m-56 0a56 56 0 1 0 112 0 56 56 0 1 0-112 0Z" p-id="2297"></path>
              <path d="M160 796m-56 0a56 56 0 1 0 112 0 56 56 0 1 0-112 0Z" p-id="2298"></path>
            </svg>
          </button>
        </div>
        <template v-if="list.length">
          <div class="mb-4 border-b pb-4">
            <example-list :is-custom="true" :list="list" @click="handleClickExample" />
          </div>
        </template>

        <example-list @click="handleClickExample" />
      </template>
      <template v-else>
        <div class="mt-4 flex justify-between">
          <div class="prose">
            <h3 class="prose-h3">History</h3>
          </div>
          <div>
            <button class="btn-ghost btn" @click="handleClearHistory">clear</button>
          </div>
        </div>
        <history />
      </template>
    </div>

    <div class="right w-96 pt-4 pl-6">
      <div class="sticky top-0">
        <div class="grid-cols-4">
          <config-form />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createCompletion } from '@/apis'
import ConfigForm from '@/components/HomeView/ConfigForm.vue'
import { useHttp } from '@/hooks'
import {
  useAppConfigStore,
  useConfigStore,
  useCustomExampleStore,
  useDialogStore,
  useHistoryStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import ExampleList from '@/components/Examples.vue'
import History from '@/components/History.vue'
import { ref } from 'vue'
import type { ExampleItem } from '@/types'
import { Dialog, DialogPanel } from '@headlessui/vue'
import { onClickOutside } from '@vueuse/core'
const { isExampleOpen: isOpen } = storeToRefs(useDialogStore())

const target = ref(null)
onClickOutside(target, (event) => {
  isOpen.value = false
})

const configStore = useConfigStore()
const { complementConfig } = storeToRefs(configStore)
const { list } = storeToRefs(useCustomExampleStore())

const { isPending, run } = useHttp()

const appConfigStore = useAppConfigStore()
const { toggleExampleType } = appConfigStore
const { isList } = storeToRefs(appConfigStore)

const store = useHistoryStore()
const { add: addHistoryItem, update: updateHistoryItem, clear } = store
const { historyList } = storeToRefs(store)
const placeholder = ref('I want to...')
const currentExample = ref<ExampleItem | null>()
const inputRef = ref<HTMLInputElement>()
const isPaused = ref(false)

const handleClickExample = (e: ExampleItem) => {
  isOpen.value = false
  currentExample.value = e
  placeholder.value = e.prompt
  inputRef.value?.focus()
}

const handleSubmit = async () => {
  const prompt = complementConfig.value.prompt || ''
  if (!String(prompt).trim()) {
    return
  }

  const HistoryItem = addHistoryItem(complementConfig.value)
  try {
    isPaused.value = true
    setTimeout(() => {
      isPaused.value = false
    }, 1000)
    const result = await run(createCompletion(HistoryItem.config))
    updateHistoryItem(HistoryItem.clientId, {
      result: result.data!,
      stat: result.stat,
      error: result.error,
    })
  } catch (err) {
    updateHistoryItem(HistoryItem.clientId, {
      stat: 'error',
      error: err,
    })
  }
}

const handleClean = () => {
  complementConfig.value['prompt'] = ''
  inputRef.value?.focus()
}
const handleFill = () => {
  if (currentExample.value) {
    complementConfig.value['prompt'] = currentExample.value!.prompt
  }
  inputRef.value?.focus()
}
const handleClearHistory = () => {
  if (window.confirm()) {
    clear()
  }
}
</script>

<style scoped></style>
