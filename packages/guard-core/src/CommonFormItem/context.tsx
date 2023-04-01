import { React } from 'shim-react'

const { createContext } = React

export const FieldContext = createContext({
  // @ts-ignore
  setStatus: (status: 'focus' | 'blur') => {}
})
