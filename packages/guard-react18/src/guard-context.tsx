
import { createContext } from 'react'

import { Guard } from '@authing/guard-shim-react18'

const initialContext = {} as Guard

export const GuardContext = createContext(initialContext)