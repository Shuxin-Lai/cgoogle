import type { CreateCompletionRequest, CreateChatCompletionRequest } from 'openai'

export type Promisable<T> = T | Promise<T>
export type Recordable<T = any> = Record<string, T>
export type Nullable<T> = T | null
export type Voidable<T> = T | null | undefined
export type Stat = 'pending' | 'success' | 'error' | 'canceled' | 'init'

export interface Item<T> {
  createdTime: string
  updatedTime: string
  id: number
  data: T
}

export interface WorkspaceDataMeta {
  tabs: {
    title?: string
    name: string
    isActive: boolean
  }[]
}

export interface WorkspaceData {
  meta: WorkspaceDataMeta
  config: Config
  name: string
}
export type WorkspaceItem = Item<WorkspaceData>

export interface ExampleData {
  workspaceId?: number
  type: ConfigType
  config: Config[ConfigType]
  isBuiltin: boolean
}

export type ExampleItem = Item<ExampleData>

export interface HistoryData {
  workspaceId: number
  type: ConfigType
  config: Config[ConfigType]
  response: CreateChatCompletionRequest | CreateCompletionRequest
  stat: Stat
  error?: Error
  clientId: number
}

export type HistoryItem = Item<HistoryData>

export type ConfigType = 'writer' | 'chat' | 'code'
export interface Config {
  writer: CreateCompletionRequest
  chat: CreateChatCompletionRequest
  code: CreateCompletionRequest
}
