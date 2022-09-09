import { MoveStruct, MoveStructField } from 'aptos/dist/generated'

export const notFalsy = <T>(arg: T | undefined): arg is T => !!arg

export const isResource = (struct: MoveStruct) =>
  struct.abilities.includes('key')

export const isEventHandle = (field: MoveStructField) =>
  field.type.startsWith('0x1::event::EventHandle')
