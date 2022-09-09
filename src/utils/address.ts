export const ellipsizeMid = (str: string, left: number, right: number) =>
  str.length > left + right + 2
    ? `${str.slice(0, left)}...${str.slice(-right)}`
    : str

export const ellipsizeOver = (str: string, maxLength: number) =>
  str.length <= maxLength ? str : `${str.substring(0, maxLength - 3)}...`

export const shortenAddress = (address: string): string => {
  return ellipsizeMid(address, 6, 4)
}

const INNER_ADDRESS_REGEX = /(0x\w{4})\w{56}(\w{4})?(::.*)/
export const shortenInnerAddress = (str: string): string => {
  const replaced = str.replace(INNER_ADDRESS_REGEX, '$1...$2$3')
  return str === replaced ? replaced : shortenInnerAddress(replaced)
}
export const equals = (
  a: string | null | undefined,
  b: string | null | undefined,
) => (a && b ? a.toLowerCase() === b.toLowerCase() : false)
