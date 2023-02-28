import type { CreateCompletionResponse, CreateCompletionRequest } from 'openai'
import { vtHttp } from './_http'

export function createCompletion(data: CreateCompletionRequest) {
  const payload = { ...data }
  if (!data.stop || (Array.isArray(data.stop) && data.stop.length == 0)) {
    payload.stop = undefined
  }
  return vtHttp.post<CreateCompletionResponse>('/openai/create', payload, {
    autoThrowWhenError: false,
  })
}
