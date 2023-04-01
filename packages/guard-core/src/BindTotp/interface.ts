import { getDefaultG2Config, IG2Config, IG2Events, IG2FCProps } from '../Type'

import { GuardMFAInitData } from '../MFA/interface'

import { AuthenticationClient, User } from 'authing-js-sdk'

export interface BindTotpConfig extends IG2Config {
  autoRegister: boolean
}

const defaultConfig: BindTotpConfig = {
  ...getDefaultG2Config(),
  autoRegister: false
}

export const getDefaultMFAConfig = (): BindTotpConfig => ({
  ...getDefaultG2Config(),
  ...defaultConfig
})

export interface BindTotpEvents extends IG2Events {
  onLogin?: (user: User, authClient: AuthenticationClient) => void
}

export interface GuardBindTotpInitData extends GuardMFAInitData {}

export interface GuardBindTotpProps extends IG2FCProps, BindTotpEvents {
  config: Partial<BindTotpConfig>
  initData: GuardBindTotpInitData
}

export interface GuardBindTotpViewProps extends GuardBindTotpProps {
  config: BindTotpConfig
  initData: GuardBindTotpInitData
}
