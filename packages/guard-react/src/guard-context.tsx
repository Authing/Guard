import { createContext } from 'react'

import { Guard } from '@authing/guard-shim-react'

const initialContext = {} as Guard

export const GuardContext = createContext(initialContext)
