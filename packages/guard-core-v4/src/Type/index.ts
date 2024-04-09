import { React } from 'shim-react'

import { AuthenticationClient, CommonMessage, User } from 'authing-js-sdk'

import { GuardModuleType } from '../Guard/module'

import { FacePlugin } from '../_utils/facePlugin/interface'

import { ApplicationConfig, Lang } from './application'

export * from './application'

export type { CommonMessage, User }

export enum GuardMode {
  Modal = 'modal',
  Normal = 'normal'
}

export interface IG2FCProps extends IG2Events {
  appId?: string
  tenantId?: string
  deviceId?: string
  config?: Partial<IG2Config>
  visible?: boolean
  initData?: any
  appendConfig?: GuardAppendConfig
  facePlugin?: FacePlugin
  authClient?: AuthenticationClient
}

export interface GuardAppendConfig {
  internalRequest?: boolean
  singleComponent?: boolean
  unAuthFlow?: boolean
  publicConfig?: ApplicationConfig
  pageConfig?: GuardPageConfig
}

export interface IG2FCViewProps extends IG2FCProps {
  config: IG2Config
}

export interface IG2Config {
  title?: string
  logo?: string
  lang?: string
  langRange?: Lang[]
  host: string
  isHost?: boolean // 判断是否处于托管页面
  mode: GuardMode
  clickCloseable: boolean
  escCloseable: boolean
  userpool?: string
  contentCss?: string
  target?: HTMLElement | string
  style?: React.CSSProperties
  __internalRequest__?: boolean
  __singleComponent__?: boolean
  __unAuthFlow__?: boolean
}

const defaultG2Config: IG2Config = {
  escCloseable: true,
  clickCloseable: true,
  mode: GuardMode.Normal,
  host: 'https://core.authing.cn'
}

export interface IG2Events {
  onLoad?: (authClient: AuthenticationClient) => void
  onLoadError?: (error: any) => void
  onClose?: () => void
  onLangChange?: (lang: Lang) => void
  // __codePaser?: (code: number) => Function
  __changeModule?: (moduleName: GuardModuleType, initData?: any) => void
}

export const getDefaultG2Config = (): IG2Config => defaultG2Config

export const LanguageMap: any = {
  'en-US': 'US',
  en: 'GB',
  'en-GB': 'GB',
  'ja-JP': 'JP',
  'de-DE': 'DE',
  'zh-CN': 'CN'
}

export enum InputMethod {
  EmailCode = 'email-code',
  PhoneCode = 'phone-code'
}

export enum GuardPageSene {
  Global = 'global'
}

export interface GuardPageConfig {
  [GuardPageSene.Global]: {
    showChangeLanguage: boolean
    defaultLanguage: Lang | 'browser'
  }
}

export enum EmailScene {
  // 通知模版
  // - 欢迎邮件 WELCOME
  WELCOME_EMAIL = 'WELCOME_EMAIL',
  // - 首次创建用户通知 FIRST_LOGIN_VERIFY
  FIRST_CREATED_USER = 'FIRST_CREATED_USER',

  // 注册/登录验证码模板 VERIFY_CODE
  // - 注册验证码
  REGISTER_VERIFY_CODE = 'REGISTER_VERIFY_CODE',
  // - 登录验证码
  LOGIN_VERIFY_CODE = 'LOGIN_VERIFY_CODE',
  // - MFA 验证
  MFA_VERIFY_CODE = 'MFA_VERIFY_CODE',
  // - 信息补全验证码
  INFORMATION_COMPLETION_VERIFY_CODE = 'INFORMATION_COMPLETION_VERIFY_CODE',

  // 验证模版 VERIFY_EMAIL
  // - 首次邮箱登录验证
  FIRST_EMAIL_LOGIN_VERIFY = 'FIRST_EMAIL_LOGIN_VERIFY',
  // - 在控制台发起验证
  CONSOLE_CONDUCTED_VERIFY = 'CONSOLE_CONDUCTED_VERIFY',

  // 重置密码模版 RESET_PASSWORD
  // - 重置密码验证码
  RESET_PASSWORD_VERIFY_CODE = 'RESET_PASSWORD_VERIFY_CODE',

  // 邮箱绑定模版 CHANGE_EMAIL
  // - 邮箱绑定验证码
  EMAIL_BIND_VERIFY_CODE = 'EMAIL_BIND_VERIFY_CODE',
  // - 邮箱解绑验证码
  EMAIL_UNBIND_VERIFY_CODE = 'EMAIL_UNBIND_VERIFY_CODE',
  // 自助解锁验证码
  SELF_UNLOCKING_VERIFY_CODE = 'SELF_UNLOCKING_VERIFY_CODE',
  // 验证码模版
  VERIFY_CODE = 'VERIFY_CODE'
}
