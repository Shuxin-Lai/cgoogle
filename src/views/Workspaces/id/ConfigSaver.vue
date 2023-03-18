<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center"
        style="background: rgba(0, 0, 0, 0.6)"
      >
        <div ref="target" class="w-full max-w-xl rounded-md bg-base-100 p-8 shadow">
          <div class="flex justify-end">
            <font-awesome-icon
              class="cursor-pointer"
              icon="fa-solid fa-xmark"
              @click="handleCancel"
            />
          </div>

          <form class="flex flex-col gap-2" @submit.prevent="handleConfirm">
            <c-form-item>
              <div class="prose mb-2">
                <h4>* Title</h4>
              </div>
              <input v-model="form['title']" class="input-bordered input w-full" />
            </c-form-item>
            <c-form-item>
              <div class="prose mb-2">
                <h4>Description</h4>
              </div>
              <textarea v-model="form['description']" class="input-bordered input w-full" />
            </c-form-item>
            <c-form-item>
              <div class="prose mb-2">
                <h4>Default Value</h4>
              </div>
              <textarea v-model="form['defaultInput']" class="input-bordered input w-full" />
            </c-form-item>

            <c-form-item>
              <div class="flex justify-between">
                <div class="prose mb-2">
                  <h4>Tags</h4>
                </div>

                <div class="tooltip tooltip-left tooltip-primary" data-tip="Add a \n">
                  <kbd
                    class="kbd kbd-sm cursor-pointer"
                    @click.prevent="
                      () => {
                        tag = '\n'
                        handleAddTag()
                      }
                    "
                  >
                    <span class="lowercase">\n</span>
                  </kbd>
                </div>
              </div>
              <div class="flex">
                <input v-model="tag" class="input-bordered input w-full" />
                <button class="btn btn-outline" @click="handleAddTag">Add</button>
              </div>
            </c-form-item>
            <div class="mt-4 flex flex-wrap gap-2">
              <div
                v-for="t in tags"
                :key="t"
                class="badge-ghost badge-outline badge cursor-pointer gap-2"
                @click="handleRemoveTag(t)"
              >
                <font-awesome-icon icon="fa-solid fa-xmark" />
                <span>{{ t == '\n' ? '\\n' : t }}</span>
              </div>
            </div>

            <c-form-item>
              <div class="flex gap-2">
                <input
                  v-model="form['isGlobal']"
                  type="checkbox"
                  class="checkbox-primary checkbox"
                />
                <div class="prose mb-2">
                  <h4>Save as global example?</h4>
                </div>
              </div>
            </c-form-item>

            <div class="mt-8"></div>

            <div class="btns flex justify-end gap-4">
              <button type="submit" class="btn-primary btn">Confirm</button>
              <button class="btn-outline btn" @click.prevent="handleCancel">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import CFormItem from '@/components/workspaces/CFormItem.vue'
import { logger } from '@/utils'
import { useToast } from 'vue-toastification'

const props = defineProps<{
  visible: boolean
  type: string
  initialValue?: object
}>()
const target = ref()
const tag = ref('')
const initialData = {
  placeholder: '',
  defaultInput: '',
  isGlobal: false,
  title: '',
  description: '',
  tags: [] as string[],
}

const { error } = useToast()

const form = ref({ ...initialData, ...(props.initialValue || {}) })
const tags = computed(() => form.value.tags)

const emit = defineEmits(['cancel', 'confirm'])
const handleCancel = () => {
  emit('cancel')
}
const handleConfirm = () => {
  if (!form.value.title) {
    error('Title is required')
    return
  }
  logger.debug('form: ', form.value)
  emit('confirm', {
    ...form.value,
  })
}

const handleAddTag = () => {
  if (!tag.value) {
    return
  }
  form.value.tags = Array.from(new Set([tag.value, ...form.value.tags]))
  tag.value = ''
}

const handleRemoveTag = (t: string) => {
  form.value.tags = form.value.tags.filter((tag) => t != tag)
}

onClickOutside(target, handleCancel)

watch(
  () => props.visible,
  (v) => {
    if (!v) return
    tag.value = ''
    form.value = { ...initialData, ...(props.initialValue || {}) }
  },
)
</script>

<style scoped></style>
