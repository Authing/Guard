import { React } from 'shim-react'
import { useGuardPublicConfig } from '../_utils/context'
import { createSentAccountCheck } from './sentAccountCheck'

export const useSentAccountCheck = (scope: string) => {
  const config = useGuardPublicConfig()
  const enabled =
    !!config.enableUserExistenceCheckCaptcha && !config.closeCheckSendUser
  return React.useMemo(() => {
    const check = createSentAccountCheck()
    return {
      clear: check.clear,
      mark: (value: string) => {
        if (enabled) check.mark(value)
      },
      matches: (value: string) => enabled && check.matches(value)
    }
  }, [config.userPoolId, enabled, scope])
}
