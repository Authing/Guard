import {
  Guard,
  GuardMode,
  GuardEvents,
  GuardEventsKebabToCamelType,
  GuardEventsCamelToKebabMapping,
  GuardModuleType,
  Lang,
  User,
  UserConfig,
  GuardScenes,
  LoginMethods,
  RegisterMethods,
  GuardEventsHandler,
  GuardEventsHandlerKebab,
  GuardEventsCamelToKebabMap,
  GuardConfig
} from '@authing/react-ui-components'

import '@authing/react-ui-components/lib/index.min.css'

import { GuardLocalConfig } from '@authing/react-ui-components/components/Guard/config'

import { AuthenticationClientOptions } from 'authing-js-sdk'

export {
  Guard as ReactAuthingGuard,
  GuardMode,
  GuardScenes,
  LoginMethods,
  RegisterMethods,
  GuardEventsCamelToKebabMap,
  GuardEventsCamelToKebabMapping
}

export type {
  GuardConfig,
  GuardLocalConfig,
  GuardEvents,
  User,
  Lang,
  UserConfig,
  GuardEventsHandler,
  GuardEventsHandlerKebab,
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

export interface GuardOptions {
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
