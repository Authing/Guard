import { createContext } from 'react'

import { Guard } from '@authing/guard'

const initialContext = {} as Guard

export const GuardContext = createContext(initialContext)
