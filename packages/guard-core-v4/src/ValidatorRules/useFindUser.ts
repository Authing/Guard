import { useGuardHttpClient, useGuardPublicConfig } from '../_utils/context'
import { useCaptchaRequest } from '../_utils/useCaptchaRequest'
import { findUserWithCaptcha } from './findUserWithCaptcha'

export const useFindUser = (enabled = false, type = '') => {
  const { get } = useGuardHttpClient()
  const publicConfig = useGuardPublicConfig()
  const { runWithCaptcha, captchaField } = useCaptchaRequest(
    Boolean(
      enabled &&
        publicConfig.enableUserExistenceCheckCaptcha &&
        (type === 'phone' || type === 'email')
    )
  )

  const findUser = (key: string, type: string) =>
    findUserWithCaptcha(get, publicConfig, key, type, runWithCaptcha)

  return { findUser, captchaField }
}
