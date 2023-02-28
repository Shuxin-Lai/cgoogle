import type { VtHttpResponse } from '@/apis'
import type { CreateCompletionRequest, CreateCompletionResponse } from 'openai'

export type Promisable<T> = T | Promise<T>
export type Recordable<T = any> = Record<string, T>
export type Nullable<T> = T | null
export type Voidable<T> = T | null | undefined

export interface HistoryItem {
  clientId: number
  config: CreateCompletionRequest
  stat: VtHttpResponse<any>['stat']
  result?: CreateCompletionResponse
  error?: any
}

export interface ExampleItem {
  id: string
  description?: string
  title: string
  tags: string[]
  config: CreateCompletionRequest

  prompt: string
  response?: string
}
