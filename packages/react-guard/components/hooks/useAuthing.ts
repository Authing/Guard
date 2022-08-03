import { useContext } from 'react'
import GuardContext from '../context/GuardContext'

const useAuthing = () => {
  const guard = useContext(GuardContext)

  if (!guard) {
    logWarn(`组件外层是否包裹 ReactGuard 组件？`)
    return undefined
  }

  return guard
}

export {
  useAuthing
}