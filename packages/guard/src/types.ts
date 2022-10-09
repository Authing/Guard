import {
  Guard,
  GuardMode,
  GuardEvents,
  GuardEventsKebabToCamelType,
  GuardEventsCamelToKebabMapping,
  GuardModuleType,
  Lang,
  User,
  LoginMethods,
  RegisterMethods,
  GuardProps,
  GuardLocalConfig
} from '@authing/react-ui-components'

import '@authing/react-ui-components/lib/index.min.css'

import { AuthenticationClientOptions } from 'authing-js-sdk'

export {
  Guard as ReactAuthingGuard,
  GuardMode,
  LoginMethods,
  RegisterMethods,
  GuardEventsCamelToKebabMapping
}

export type {
  GuardLocalConfig,
  GuardEvents,
  User,
  Lang,
  GuardEventsKebabToCamelType
}

export type GuardEventListeners = {
  [key in keyof GuardEventsKebabToCamelType]: Exclude<
    Required<GuardEventsKebabToCamelType>[key],
    undefined
  >[]
}

export type CodeMethod = 'S256' | 'plain'

export type Align = 'none' | 'left' | 'center' | 'right'

export interface GuardOptions extends GuardProps {
  appId: string
  host?: string
  redirectUri?: string
  mode?: 'normal' | 'modal'
  defaultScene?: GuardModuleType
  tenantId?: string
  lang?: Lang
  isSSO?: boolean
  scope?: string // OIDC scope
  state?: string // OIDC 状态
  config?: Partial<GuardLocalConfig> // 兼容之前的 config，新用户可不传
  authClientOptions?: AuthenticationClientOptions
  align?: Align
}

export interface StartWithRedirectOptions {
  codeChallengeDigestMethod?: CodeMethod
  codeChallengeMethod?: CodeMethod
  scope?: string
  redirectUri?: string
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

export * from '@authing/react-ui-components'
