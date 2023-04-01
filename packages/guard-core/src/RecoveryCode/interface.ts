import { getDefaultG2Config, IG2Config, IG2Events } from '../Type'

import { AuthenticationClient, User } from 'authing-js-sdk'

export interface RecoveryCodeConfig extends IG2Config {}

const defaultConfig: RecoveryCodeConfig = {
  ...getDefaultG2Config()
}

export const getDefaultRecoveryCodeConfig = (): RecoveryCodeConfig => ({
  ...getDefaultG2Config(),
  ...defaultConfig
})

export interface RecoveryCodeEvents extends IG2Events {
  onLogin?: (user: User, authClient: AuthenticationClient) => void
}
