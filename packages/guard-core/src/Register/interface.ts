import { AuthenticationClient, User } from 'authing-js-sdk'

import { IG2FCProps, IG2Config, getDefaultG2Config, IG2Events } from '../Type'

import { Agreement, RegisterMethods } from '../Type/application'

export interface RegisterConfig extends IG2Config {
  disableRegister?: boolean
  registerMethods?: string[]
  defaultRegisterMethod?: string
  publicKey?: string
  agreementEnabled?: boolean
  agreements?: Agreement[]
  registerContext?: any
}

const defaultConfig: RegisterConfig = {
  ...getDefaultG2Config()
}

export interface RegisterEvents extends IG2Events {
  onBeforeRegister?: (
    // TODO 类型定义补充
    registerInfo: any,
    authClient: AuthenticationClient
  ) => boolean | Promise<boolean>
  onRegister?: (user: User, authClient: AuthenticationClient) => void
  onRegisterError?: (error: any) => void
  onRegisterTabChange?: (activeTab: RegisterMethods) => void
}

export interface GuardRegisterProps extends IG2FCProps, RegisterEvents {
  config?: Partial<RegisterConfig>
}

export interface GuardRegisterViewProps extends GuardRegisterProps {
  config: RegisterConfig
}

const getDefaultConfig = (): RegisterConfig => ({
  ...getDefaultG2Config(),
  ...defaultConfig
})

export const getDefaultRegisterConfig = getDefaultConfig
