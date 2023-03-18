import type { ConfigType, WorkspaceData } from '@/types'
import { cloneDeep } from 'lodash-es'
import type { CreateChatCompletionRequest, CreateCompletionRequest } from 'openai'

const D_WRITER_CONFIG: CreateCompletionRequest = {
  prompt: '',
  model: 'text-davinci-003',
  n: 1,
}

const D_CHAT_CONFIG: CreateChatCompletionRequest & { max_history: number } = {
  model: 'gpt-3.5-turbo',
  messages: [],
  n: 1,
  top_p: 0.7,
  max_history: 1,
  max_tokens: 600,
}

const D_CODE_CONFIG = {
  model: '',
}

const D_CONFIG = {
  writer: D_WRITER_CONFIG,
  chat: D_CHAT_CONFIG,
  code: D_CODE_CONFIG,
}

export const getDefaultConfig = (
  type?: ConfigType,
): WorkspaceData['config'] | WorkspaceData['config'][ConfigType] => {
  if (type != null) {
    return cloneDeep(D_CONFIG[type])
  }

  return cloneDeep(D_CONFIG)
}

export const getInitialWorkspace = (name: string) => {
  return {
    name,
    meta: {
      tabs: [
        {
          name: 'writer',
          isActive: true,
        },
        {
          name: 'chat',
          isActive: false,
        },
        {
          name: 'code',
          isActive: false,
        },
      ],
    },
    // todo
    config: getDefaultConfig() as any,
  }
}
