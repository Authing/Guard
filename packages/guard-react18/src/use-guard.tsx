import { useContext } from 'react'

import { GuardContext } from './guard-context'

export const useGuard = () => useContext(GuardContext)
