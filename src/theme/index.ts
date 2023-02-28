export const colors = [
  'primary',
  'secondary',
  'accent',
  'neutral',
  'info',
  'success',
  'warning',
  'error',
  'outline',
  'ghost',
]

export const getRandomColor = (hint?: number) => {
  const seed = hint == null ? Date.now() : hint
  console.log('color: ', colors[seed % colors.length])
  return colors[seed % colors.length]
}
