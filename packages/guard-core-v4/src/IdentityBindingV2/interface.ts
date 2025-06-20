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

export interface GuardIdentityBindingProps
  extends IG2FCProps,
    IdentityBindingEvents {
  config?: Partial<IdentityBindingConfig>
}
type BindMethods = Array<
  | 'email-password'
  | 'username-password'
  | 'phone-password'
  | 'phone-code'
  | 'email-code'
>
export interface GuardIdentityBindingInitData {
  methods: BindMethods
  source?: GuardModuleType
}

export interface GuardIdentityBindingViewProps
  extends GuardIdentityBindingProps,
    IG2FCViewProps {
  config: IdentityBindingConfig
  initData: GuardIdentityBindingInitData
}

type AuthResult = 1 | 2 | 3
type AuthType = 'phone' | 'email' | 'username'
type AuthMethod = 'code' | 'password'

interface AuthConfig {
  type: AuthType
  methods: AuthMethod[]
}

export interface GuardIdentityAccountVerifcationInitData extends AuthConfig {
  source?: GuardModuleType
}
const authConfig: Record<
  AuthResult,
  { type: AuthType; methodMap: Record<string, AuthMethod> }
> = {
  1: {
    type: 'phone',
    methodMap: {
      'phone-code': 'code',
      'phone-password': 'password'
    }
  },
  2: {
    type: 'email',
    methodMap: {
      'email-code': 'code',
      'email-password': 'password'
    }
  },
  3: {
    type: 'username',
    methodMap: {
      'username-password': 'password'
    }
  }
}
export function optimizeAuthMethodsTypeSafe(
  type: AuthResult,
  bindMethods: BindMethods
): AuthConfig {
  const config = authConfig[type]
  const methods = bindMethods
    .filter(method => method in config.methodMap)
    .map(method => config.methodMap[method]) as AuthMethod[]

  return {
    type: config.type,
    methods
  }
}
