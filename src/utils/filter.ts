import { Types } from "aptos"

export const notFalsy = <T>(arg: T | undefined): arg is T => !!arg

export const isResource = (struct: Types.MoveStruct) =>
  struct.abilities.includes('key')

export const isEventHandle = (field: Types.MoveStructField) =>
  field.type.startsWith('0x1::event::EventHandle')
