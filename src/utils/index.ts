export * from './day-utils'
export * from './logger'

export function copyToClipboard(text: string) {
  const dummy = document.createElement('textarea')
  document.body.appendChild(dummy)
  dummy.value = text
  dummy.select()
  document.execCommand('copy')
  document.body.removeChild(dummy)
}

export const shallowMerge = Object.assign

export const sleep = (timeout = 16) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(timeout)
    }, timeout)
  })
}
