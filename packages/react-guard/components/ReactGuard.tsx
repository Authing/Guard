import '@authing/guard/dist/esm/guard.css'
import React from 'react'
import GuardContext from './context/GuardContext'
import { GuardOptions } from '@authing/guard'
import { useGuard } from './hooks/useGuard'

interface Props extends GuardOptions {}
/**
 * React Guard 组件
 */
const ReactGuard: React.FC<Props> = props => {
  const guard = useGuard(props)

  return (
    <GuardContext.Provider value={guard}>
      {props.children}
    </GuardContext.Provider>
  )
}

export { ReactGuard }
