import { sleep } from '@/utils'
import type { CreateCompletionResponse, CreateCompletionRequest } from 'openai'
import { vtHttp } from './_http'

export async function createCompletion(data: CreateCompletionRequest) {
  const payload = { ...data }
  if (!data.stop || (Array.isArray(data.stop) && data.stop.length == 0)) {
    payload.stop = undefined
  }
  return {
    stat: 'success',
    type: 'writer',
    message: 'success',
    data: [
      {
        text: 'World();',
      },
    ],
  }
  return vtHttp
    .post<CreateCompletionResponse>('/openai/create', payload, {
      autoThrowWhenError: false,
    })
    .then((res) => {
      if (res.stat == 'success') {
        const result: { text: string }[] = []
        const choices = res.data?.choices || []
        choices.forEach((c) => {
          let text = c.text || ''
          text = text.trim()
          if (text) {
            result.push({ text })
          }
        })

        return {
          ...res,
          data: result,
        }
      }
      return res
    })
  // await sleep(200)
}
