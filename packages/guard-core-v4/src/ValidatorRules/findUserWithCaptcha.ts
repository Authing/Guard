import { GuardHttp } from '../_utils/guardHttp'
import { ApplicationConfig } from '../Type/application'
import { AuthingGuardResponse } from '../_utils/http'

export const findUserWithCaptcha = (
  get: GuardHttp['get'],
  config: ApplicationConfig,
  key: string,
  type: string,
  challenge: (
    request: (captchaCode: string) => Promise<AuthingGuardResponse<boolean>>
  ) => Promise<AuthingGuardResponse<boolean>>
) => {
  const request = (captchaCode?: string) =>
    get<boolean>(
      '/api/v2/users/find',
      {
        userPoolId: config.userPoolId,
        key,
        type,
        ...(captchaCode === undefined ? {} : { captchaCode })
      },
      { validateStatus: () => true, withCredentials: true }
    )

  return config.enableUserExistenceCheckCaptcha &&
    (type === 'phone' || type === 'email')
    ? challenge(request)
    : request()
}
