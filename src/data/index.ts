import type { ExampleItem } from '@/types'
import { merge } from 'lodash-es'
import _exampleList from './example.json'

export const exampleList = _exampleList.map((e): ExampleItem => {
  return merge(e, { config: { n: 1 } })
})
