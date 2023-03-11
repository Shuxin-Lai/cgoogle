import type { ExampleItem } from '@/types'
import { dayjs } from '@/utils'
import _exampleList from './example.json'

export const builtinExampleList = _exampleList.map((e, i): ExampleItem => {
  const { title, tags, type, prompt, config, description } = e
  return {
    id: -1000 - i,
    createdTime: dayjs().toString(),
    updatedTime: dayjs().toString(),
    data: {
      config: { ...config, n: 1 } as any,
      placeholder: prompt,
      description,
      tags: ['Builtin', ...tags],
      title,
      isBuiltin: true,
      type: type as any,
    },
  }
})
