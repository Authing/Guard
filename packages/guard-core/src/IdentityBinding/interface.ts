import { IG2Config, IG2Events, IG2FCProps, IG2FCViewProps } from '../Type'

import { AuthenticationClient, User } from 'authing-js-sdk'

import { GuardModuleType } from '../Guard'

import { Agreement } from '../Type/application'

export interface IdentityBindingConfig extends IG2Config {
  autoRegister?: boolean
  publicKey?: string
  agreementEnabled?: boolean
  agreements?: Agreement[]
}

export interface IdentityBindingEvents extends IG2Events {
  onBinding?: (user: User, authClient: AuthenticationClient) => void
  onBindingError?: (errorMessages: any) => void
  onLogin?: (user: User, authClient: AuthenticationClient) => void
  onLoginError?: (errorMessages: any) => void
}

export interface GuardIdentityBindingProps extends IG2FCProps, IdentityBindingEvents {
  config?: Partial<IdentityBindingConfig>
}

export interface GuardIdentityBindingInitData {
  methods: Array<'email' | 'username' | 'phone' | 'phone-code' | 'email-code'>
  source?: GuardModuleType
}

export interface GuardIdentityBindingViewProps extends GuardIdentityBindingProps, IG2FCViewProps {
  config: IdentityBindingConfig
  initData: GuardIdentityBindingInitData
}
