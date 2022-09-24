export const convert = (value: any, type: string) => {
  if (type === 'bool') return value === 'true'
  return value
}
