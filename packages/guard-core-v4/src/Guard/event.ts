import { message } from 'shim-antd'

import { User } from 'authing-js-sdk'

import { GuardModuleType } from './module'

import { CompleteInfoEvents } from '../CompleteInfo/interface'

import { ForgetPasswordEvents } from '../ForgetPassword/interface'

import { IdentityBindingEvents } from '../IdentityBinding/interface'

import { IdentityBindingAskEvents } from '../IdentityBindingAsk'

import { LoginEvents } from '../Login/interface'

import { RegisterEvents } from '../Register/interface'

import { TenantPortalEvents } from '../TenantPortalSelect/interface'

import { i18n } from '../_utils/locales'

import { StoreInstance } from './core/hooks/useMultipleAccounts'

interface OnAfterChangeModuleOptions {
  currentView: string
  currentModule: GuardModuleType
  currentTab?: string
  data?: any
}

export interface GuardEvents
  extends LoginEvents,
    RegisterEvents,
    CompleteInfoEvents,
    ForgetPasswordEvents,
    IdentityBindingEvents,
    IdentityBindingAskEvents,
    TenantPortalEvents {
  onBeforeChangeModule?: (
    key: GuardModuleType,
    initData?: any
  ) => boolean | Promise<boolean>
  onAfterChangeModule?: (options: OnAfterChangeModuleOptions) => void
}

/**
 * 包裹用户 Events
 * 这里为必须存在的 Events
 * @param eventName 事件名
 * @param events 事件列表
 * @param callback 事件触发时前置函数
 */
const wrapperEvents = <
  N extends keyof GuardEvents,
  T extends Required<GuardEvents>[N] = Required<GuardEvents>[N]
>(
  eventName: N,
  events: GuardEvents,
  callback: (oldEvent: any, ...props: Parameters<T>) => ReturnType<T>
) => {
  // 对于特殊event进行处理
  const oldEvents = events[eventName]
  // @ts-ignore TODO: 后续类型处理
  events[eventName] = (...props: Parameters<T>) => {
    callback(oldEvents, ...props)
    return props
  }
}

export const guardEventsFilter = (
  props: any,
  multipleInstance?: StoreInstance,
  openEventsMapping?: boolean
) => {
  const events: GuardEvents = {}

  const eventsNameWhiteList = ['__changeModule']

  const eventsName = Object.keys(props).filter(
    name => name.startsWith('on') || eventsNameWhiteList.includes(name)
  )

  eventsName.forEach(eventName => {
    events[eventName as keyof GuardEvents] = props[eventName]
  })

  // 保证必须存在 onLogin 函数
  wrapperEvents<'onLogin'>('onLogin', events, (oldEvents, ...props) => {
    const [user] = props
    multipleInstance?.setUserInfo(user)
    oldEvents && oldEvents(...props)
  })

  return guardEventsHijacking(events, openEventsMapping)
}

const eventsMapping: Partial<GuardEvents> = {
  onLogin: (user: User & { encryptedPassword?: string }, client) => {
    message.success(i18n.t('common.LoginSuccess'))

    if (user) {
      user.token && client.setToken(user.token)
      client.setCurrentUser(user)
    }

    return [user, client]
  },

  onRegister: (...props) => {
    message.success(i18n.t('common.registrationSuccess'))
    return props
  }
}

export const guardEventsHijacking = (
  events: GuardEvents,
  openEventsMapping?: boolean
): GuardEvents => {
  const newEvents: GuardEvents = {}
  Object.keys(eventsMapping).forEach(eventsKey => {
    // @ts-ignore
    newEvents[eventsKey] = (...props) => {
      // 必须执行的
      // @ts-ignore
      openEventsMapping && eventsMapping[eventsKey](...props)
      // @ts-ignore
      events[eventsKey]?.(...props)
    }
  })

  return {
    ...events,
    ...newEvents
  }
}

export const GuardEventsCamelToKebabMapping = {
  onLoad: 'load',
  onLoadError: 'load-error',
  onLogin: 'login',
  onBeforeLogin: 'before-login',
  onLoginError: 'login-error',
  onRegister: 'register',
  onBeforeRegister: 'before-register',
  onRegisterError: 'register-error',
  onEmailSend: 'email-send',
  onEmailSendError: 'email-send-error',
  onPhoneSend: 'phone-send',
  onPhoneSendError: 'phone-send-error',
  onPwdReset: 'pwd-reset',
  onPwdResetError: 'pwd-reset-error',
  onClose: 'close',
  onLoginTabChange: 'login-tab-change',
  onRegisterTabChange: 'register-tab-change',
  onRegisterInfoCompleted: 'register-info-completed',
  onRegisterInfoCompletedError: 'register-info-completed-error',
  onLangChange: 'lang-change',
  onBeforeChangeModule: 'before-change-module',
  onAfterChangeModule: 'after-change-module'
} as const

export interface GuardEventsKebabToCamelType {
  // 加载完成，userPool 配置和应用配置（如果有 appId）加载完成
  load: GuardEvents['onLoad']
  // 加载失败
  'load-error': GuardEvents['onLoadError']
  // 登录前，即表单校验完成，请求接口前
  'before-login': GuardEvents['onBeforeLogin']
  // 用户登录成功
  login: GuardEvents['onLogin']
  // 用户登录失败
  'login-error': GuardEvents['onLoginError']
  // 注册前，即表单校验完成，请求接口前
  'before-register': GuardEvents['onBeforeRegister']
  // 注册成功
  register: GuardEvents['onRegister']
  // 注册失败
  'register-error': GuardEvents['onRegisterError']
  // 邮件发送成功
  'email-send': GuardEvents['onEmailSend']
  // 邮件发送失败
  'email-send-error': GuardEvents['onEmailSendError']
  // 手机验证码发送成功
  'phone-send': GuardEvents['onPhoneSend']
  // 手机验证码发送失败
  'phone-send-error': GuardEvents['onPhoneSendError']
  // 重置密码成功
  'pwd-reset': GuardEvents['onPwdReset']
  // 重置密码失败
  'pwd-reset-error': GuardEvents['onPwdResetError']
  // 表单关闭事件
  close: GuardEvents['onClose']
  // 登录的 tab 切换
  'login-tab-change': GuardEvents['onLoginTabChange']
  // 注册的 tab 切换
  'register-tab-change': GuardEvents['onRegisterTabChange']
  // 注册信息补充完毕
  'register-info-completed': GuardEvents['onRegisterInfoCompleted']
  // 注册信息补充失败
  'register-info-completed-error': GuardEvents['onRegisterInfoCompletedError']
  // 语言切换
  'lang-change': GuardEvents['onLangChange']
  // 切换模块前
  'before-change-module': GuardEvents['onBeforeChangeModule']
  'after-change-module': GuardEvents['onAfterChangeModule']
}
