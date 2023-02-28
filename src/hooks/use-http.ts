import type { Promisable, Voidable } from '@/types'
import type { VtHttpResponse } from '@/apis'
import { computed, ref } from 'vue'

export const useHttp = <T>() => {
  const stat = ref<VtHttpResponse<any>['stat']>('init')
  const data = ref<Voidable<T>>(null)
  const isPending = computed(() => stat.value == 'pending')
  const isSuccess = computed(() => stat.value == 'success')
  const isError = computed(() => stat.value == 'error')
  const isCanceled = computed(() => stat.value == 'canceled')

  const run = <T>(response: Promisable<VtHttpResponse<T>>) => {
    stat.value = 'pending'
    return Promise.resolve(response).then((v) => {
      stat.value = v.stat
      data.value = v.data as any
      return v
    })
  }

  return {
    data,
    stat,
    isCanceled,
    isError,
    isPending,
    isSuccess,

    run,
  }
}
