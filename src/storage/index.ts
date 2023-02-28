import localforage from 'localforage'
import { merge } from 'lodash-es'
const APP_NAME = 'coogle'

const common = {
  driver: localforage.INDEXEDDB, // Force WebSQL; same as using setDriver()
  name: APP_NAME,
  version: 1.0,
  // size: 4980736, // Size of database, in bytes. WebSQL-only for now.
  description: '',
}

function createStorage(partialConfig: LocalForageOptions) {
  return localforage.createInstance(merge(common, partialConfig))
}

export const HistoryStorage = createStorage({
  name: 'history',
})

export const CustomExampleStorage = createStorage({
  name: 'custom_example',
})
