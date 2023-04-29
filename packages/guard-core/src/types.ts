import {
  Lang,
  LoginMethods,
  OIDCConnectionMode,
  SocialConnectionProvider,
  Protocol,
  RegisterMethods,
  GuardMode,
  InputMethod,
  GuardPageSene,
  EmailScene,
  SceneType,
  PasswordLoginMethods
} from './Type'

import { LoginWay } from './Guard/core/hooks/useMultipleAccounts'

import { CodeAction, ApiCode } from './_utils/responseManagement/interface'

import {
  GuardEventsKebabToCamelType,
  GuardProps,
  GuardLocalConfig,
  GuardModuleType
} from './Guard'

import { CSSProperties } from 'shim-react'

export * from './_utils'

export * from './AuthClientProvider'

export * from './Guard/core/hooks/useGuardView'

export * from './Guard'

export * from './Type'

export type ICodeAction = `${CodeAction}`

export type IApiCode = `${ApiCode}`

export type IGuardModuleType = `${GuardModuleType}`

export type ILoginMethod = `${LoginMethods}`

export type IOIDCConnectionMode = `${OIDCConnectionMode}`

export type ISocialConnectionProvider = `${SocialConnectionProvider}`

export type IProtocol = `${Protocol}`

export type IRegisterMethod = `${RegisterMethods}`

export type IGuardMode = `${GuardMode}`

export type IInputMethod = `${InputMethod}`

export type IGuardPageSene = `${GuardPageSene}`

export type IEmailScene = `${EmailScene}`

export type ISceneType = `${SceneType}`

export type GuardEventListeners = {
  [key in keyof GuardEventsKebabToCamelType]: Exclude<
    Required<GuardEventsKebabToCamelType>[key],
    undefined
  >[]
}

export type CodeChallengeMethod = 'S256' | 'plain'

export interface IGuardConfig extends GuardLocalConfig {
  // replace socialConnections
  socialConnectionList?: ISocialConnectionProvider[]

  // replace defaultLoginMethod
  loginMethod?: ILoginMethod

  // replace loginMethods
  loginMethodList: ILoginMethod[]

  // replace defaultRegisterMethod
  registerMethod?: IRegisterMethod

  // replace registerMethods
  registerMethodList?: IRegisterMethod[]

  // replace contentCss
  contentCSS?: string
}

export interface GuardOptions extends GuardProps {
  appId: string
  host?: string
  redirectUri?: string
  mode?: IGuardMode
  defaultScene?: IGuardModuleType
  tenantId?: string
  lang?: Lang
  isSSO?: boolean
  config?: Partial<IGuardConfig> // 兼容 4.x 的 config
  style?: CSSProperties
}

export interface StartWithRedirectOptions {
  codeChallengeMethod?: CodeChallengeMethod
  scope?: string
  state?: string
  responseType?:
    | 'code'
    | 'code id_token token'
    | 'code id_token'
    | 'code token'
    | 'id_token token'
    | 'id_token'
    | 'none'
  responseMode?: 'query' | 'fragment' | 'form_post'
  nonce?: string
}

export interface LogoutParams {
  redirectUri?: string
  quitCurrentDevice?: boolean
}

export type IGuardTabType =
  | 'phone-code'
  | 'phone-password'
  | 'password'
  | 'email-password'
  | 'username-password'
  | 'authing-otp-push'
  | 'ad'
  | 'ldap'
  | 'app-qrcode'

export interface IChangeViewOptions {
  module: IGuardModuleType
  tab?: IGuardTabType
}
