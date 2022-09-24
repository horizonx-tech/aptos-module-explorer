import { useReducer } from 'react'

export const useToggle = (initialValue = false) =>
  useReducer((value) => !value, initialValue)
