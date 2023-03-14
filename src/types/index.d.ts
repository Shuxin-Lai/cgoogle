import type {
  CreateCompletionRequest,
  CreateChatCompletionRequest,
  CreateCompletionResponse,
  CreateChatCompletionResponse,
} from 'openai'

export type Promisable<T> = T | Promise<T>
export type Recordable<T = any> = Record<string, T>
export type Nullable<T> = T | null
export type Voidable<T> = T | null | undefined
export type Stat = 'pending' | 'success' | 'error' | 'canceled' | 'init'

export interface GlobalConfig {
  exampleType: 'simple' | 'full'
  isDrawerOpen: boolean
  isConfigOpen: boolean
}

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
  isEditorOpen?: boolean
  editorText?: string
  editorMode?: string
  activeExampleId?: number
  activeTabName?: string
}
export type WorkspaceItem = Item<WorkspaceData>

export interface ExampleData {
  workspaceId?: Nullable<number>
  type: ConfigType
  config: Config[ConfigType]
  placeholder?: string
  defaultInput?: string
  isBuiltin?: boolean
  isGlobal?: boolean
  title: string
  description?: string
  tags: string[]
}

export type ExampleItem = Item<ExampleData>

export interface HistoryData {
  workspaceId: number
  type: ConfigType
  config: Config[ConfigType]
  response?: { text: string }[]
  stat: Stat
  error?: string
  // clientId: number
}

export type HistoryItem = Item<HistoryData>

export type ConfigType = 'writer' | 'chat' | 'code'
export interface Config {
  writer: CreateCompletionRequest
  chat: CreateChatCompletionRequest
  code: CreateCompletionRequest
}
