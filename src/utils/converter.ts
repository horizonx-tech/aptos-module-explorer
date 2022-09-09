const NUMBER_TYPE_REGEX = /u(8|16|32|64|128)/

export const convert = (value: any, type: string) => {
  if (type === 'bool') return value === 'true'
  if (NUMBER_TYPE_REGEX.test(type)) return Number.isNaN(+value) ? value : +value
  return value
}
