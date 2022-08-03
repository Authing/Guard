import { Guard } from '@authing/guard'
import { logWarn } from 'components/utils/log'
import { useContext } from 'react'
import GuardContext from '../context/GuardContext'

const useAuthing = () => {
  const guard = useContext(GuardContext)

  if (!guard) {
    // 当前不存在 Guard 实例
    logWarn(
      'useAuthing 必须在 ReactGuard 中使用，请检查是否提供 <ReactGuard></ReactGuard> '
    )

    // 返回空对象防止 .xxx Error
    return {} as Guard
  }

  return guard
}

export { useAuthing }
