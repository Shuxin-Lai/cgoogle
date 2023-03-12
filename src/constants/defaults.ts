import type { ConfigType, WorkspaceData } from '@/types'
import { cloneDeep } from 'lodash-es'

const D_WRITER_CONFIG = {
  prompt: '',
  model: 'text-davinci-003',
}

const D_CHAT_CONFIG = {
  model: '',
  messages: [],
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
