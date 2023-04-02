import { Rule } from 'shim-antd/lib/form'

import qs from 'qs'

import { i18n } from './locales'

import { User } from 'authing-js-sdk'

import { GuardProps } from '../Guard'

import isEqual from 'lodash/isEqual'

import omit from 'lodash/omit'

import { getGuardWindow } from '../Guard/core/useAppendConfig'

import UAParser from 'ua-parser-js'

import {
  ApplicationConfig,
  ComplateFiledsPlace,
  LoginMethods,
  RegisterMethods,
  RegisterSortMethods,
  TabFieldsI18nItem
} from '../Type/application'

import { LngTextMapping } from '../ChangeLanguage'

import { Lang } from '../Type'

export * from './popupCenter'

export * from './clipboard'

export * from './locales'

export * from './config'

export * from './facePlugin'

export * from './hooks'

export * from './logger'

export * from './responseManagement'

export * from './appendConfig'

export * from './clipboard'

export * from './context'

export * from './corsVerification'

export * from './countryList'

export * from './errorFace'

export * from './flowHandleStorage'

export * from './getCaptchaUrl'

export * from './GuardErrorCode'

export * from './guardHttp'

export * from './initAppId'

export * from './popupCenter'

export * from './tenant'

export * from './useErrorText'

export const VALIDATE_PATTERN = {
  // https://emailregex.com/
  // eslint-disable-next-line no-control-regex
  email:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  // https://cloud.tencent.com/developer/article/1751120
  // email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
  //   以下的来自 authing-user-portal 项目
  phone: /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,
  ip: /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/,
  host: /^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+.?$/,
  username: /.?/
} as const

export const validate = (type: keyof typeof VALIDATE_PATTERN, val: string) => {
  return VALIDATE_PATTERN[type].test(val)
}

export const getRequiredRules = (msg: string): Rule[] => {
  return [
    {
      required: true,
      message: msg
    }
  ]
}

export const fieldRequiredRule = (
  fieldRequiredRule: string,
  fieldRequiredRuleMessage?: string
): Rule[] => {
  return [
    {
      required: true,
      validateTrigger: ['onChange'],
      message:
        fieldRequiredRuleMessage ||
        i18n.t('common.isMissing', {
          name: fieldRequiredRule
        }) as string,
      whitespace: true
    }
  ]
}

export function getDeviceName() {
  const guardWindow = getGuardWindow()

  if (!guardWindow) return

  const userAgent = guardWindow.navigator.userAgent
  const platform = guardWindow.navigator.platform
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K']
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE']
  const iosPlatforms = ['iPhone', 'iPad', 'iPod']

  let os = null

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS'
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS'
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows'
  } else if (/Android/.test(userAgent)) {
    os = 'Android'
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux'
  }

  return os
}

export type STYLE_RECORD_KEY = 'appConfig' | 'userConfig'

/**
 * 传对象 {'background-color': 'red'}
 * 传字符串 "CSS 样式"
 */
const insertedRecord: Record<STYLE_RECORD_KEY, any> = {
  appConfig: null,
  userConfig: null
}
export const insertStyles = (styles: string | any, recordKey?: STYLE_RECORD_KEY) => {
  const guardWindow = getGuardWindow()

  if (!guardWindow) return

  const document = guardWindow.document

  let styleElt, styleSheet
  if ((document as any).createStyleSheet) {
    // IE
    styleSheet = (document as any).createStyleSheet()
  } else {
    const head = document.getElementsByTagName('head')[0]
    styleElt = document.createElement('style')
    head.appendChild(styleElt)
    styleSheet = document.styleSheets[document.styleSheets.length - 1]
  }
  if (typeof styles === 'string') {
    if (styleElt) styleElt.innerHTML = styles
    else styleSheet.cssText = styles // IE
  } else {
    let i = 0
    for (const selector in styles) {
      if (styleSheet.insertRule) {
        const rule = selector + ' {' + styles[selector] + '}'
        styleSheet.insertRule(rule, i++)
      } else {
        styleSheet.addRule(selector, styles[selector], i++)
      }
    }
  }

  if (recordKey) {
    insertedRecord[recordKey] = styleElt || styleSheet
  }
}

export const removeStyles = (recordKey: STYLE_RECORD_KEY) => {
  if (!insertedRecord[recordKey]) {
    return
  }

  const styleElt = insertedRecord[recordKey]
  styleElt.parentNode?.removeChild(styleElt)

  insertedRecord[recordKey] = null
}

export const getClassnames = (classnames: (string | boolean | undefined)[]) => {
  return classnames.filter(Boolean).join(' ')
}

/**
 * https://www.itranslater.com/qa/details/2115518846294557696
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: any) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * https://www.itranslater.com/qa/details/2115518846294557696
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function deepMerge<T extends object = any>(target: T, ...sources: any[]): T {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        // @ts-ignore
        if (!target[key]) {
          Object.assign(target, { [key]: {} })
        }
        // @ts-ignore
        deepMerge(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return deepMerge(target, ...sources)
}

/**
 *  在托管页下上传query中指定的用户自定义字段进行补全
 * @param params 指定上传的用户自定义字段
 */
export const getUserRegisterParams = (params?: string[]) => {
  const query = qs.parse(window.location.search, {
    ignoreQueryPrefix: true
  })
  return Object.keys(query)
    .map(key => ({
      key,
      value: query[key]
    }))
    .filter(item => item.value)
    .filter(item => (params ? params.includes(item.key) : true))
}

// 微信内置浏览器
export const isWeChatBrowser = () => {
  if (typeof navigator === 'undefined') {
    return null
  }
  return /MicroMessenger/i.test(navigator?.userAgent) && !/wxwork/i.test(navigator.userAgent)
}

export const isLarkBrowser = () => {
  if (typeof navigator === 'undefined') {
    return null
  }
  return /Lark/i.test(navigator.userAgent)
}

export const isQtWebEngine = () => {
  if (typeof navigator === 'undefined') {
    return null
  }
  return /QtWebEngine/i.test(navigator.userAgent)
}

export const isXiaomiBrowser = () => {
  if (typeof navigator === 'undefined') {
    return null
  }
  return /MiuiBrowser/i.test(navigator.userAgent)
}
export const isDingtalkBrowser = () => {
  if (typeof navigator === 'undefined') {
    return null
  }
  return /dingtalk/i.test(navigator.userAgent)
}
export const isQQBrowser = () => {
  if (typeof navigator === 'undefined') {
    return null
  }
  return /MQQBrowser/i.test(navigator.userAgent)
}
// qq 内置浏览器
export const isQQBuiltInBrowser = () => {
  if (typeof navigator === 'undefined') {
    return null
  }
  return / QQ/i.test(navigator.userAgent)
}
// 企业微信内置浏览器
export const isWeWorkBuiltInBrowser = () => {
  if (typeof navigator === 'undefined') {
    return null
  }
  return /MicroMessenger/i.test(navigator.userAgent) && /wxwork/i.test(navigator.userAgent)
}
// 特殊浏览器 后续可能会增加

export const isEdgeBrowser = () => {
  const parser = UAParser()

  return parser.browser.name === 'Edge'
}

export const isWeiboBrowser = () => {
  if (typeof navigator === 'undefined') {
    return null
  }
  return /Weibo/i.test(navigator.userAgent)
}

export const isAlipayBrowser = () => {
  if (typeof navigator === 'undefined') {
    return null
  }
  return /Alipay/i.test(navigator.userAgent)
}

export const isBaiduBrowser = () => {
  if (typeof navigator === 'undefined') {
    return null
  }
  return /Baidu/i.test(navigator.userAgent)
}

export const isWeComeBrowser = () => /wxwork/i.test(navigator.userAgent)

export const isMobile = () => {
  return window.navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  )
}

/* 利用浏览器的 UA 判断是否为不支持弹窗的特殊浏览器 */
export const isSpecialBrowser = () => {
  // 1. 首先筛选出一定是特殊浏览器的 UA
  if (
    isWeChatBrowser() ||
    isWeComeBrowser() ||
    isLarkBrowser() ||
    isDingtalkBrowser() ||
    isQtWebEngine() ||
    isXiaomiBrowser() ||
    isQQBrowser() ||
    isMobile()
  ) {
    return true
  }

  // 2. 利用 ua-parser-js 进一步判断，筛选出很可能不是特殊浏览器的 UA
  // 由于一些特殊浏览器也可能会被误判为非特殊，所以需要首先经过第 1 步筛选
  const parser = UAParser()
  const nonSpecialBrowsers = ['Chrome', 'Firefox', 'Safari', 'Opera', 'IE', 'Edge']
  if (nonSpecialBrowsers.includes(parser.browser.name ?? '')) {
    return false
  }

  // 3. 可能有一些 UA 没有任何特征，这种情况下一律默认为特殊浏览器
  return true
}

export const assembledAppHost = (identifier: string, host: string) => {
  const hostUrl = new URL(host)

  const splitHost = hostUrl.hostname.split('.')

  const port = hostUrl.port

  splitHost.shift()

  // eslint-disable-next-line prettier/prettier
  return `${hostUrl.protocol}//${identifier}.${splitHost.join('.')}${
    port && `:${port}`
  }`
}

// 拼接请求链接
export const assembledRequestHost = (requestHostname: string, configHost: string) => {
  const identifier = requestHostname.split('.')[0]

  const hostUrl = new URL(configHost)
  const splitHost = hostUrl.hostname.split('.')

  splitHost.shift()

  // 看看是否有端口号
  const port = hostUrl.port

  return `${hostUrl.protocol}//${identifier}.${splitHost.join('.')}${port && `:${port}`}`
}

export enum PasswordStrength {
  NoCheck,
  Low,
  Middle,
  High,
  AUTO
}

export const PASSWORD_STRENGTH_TEXT_MAP: Record<
  PasswordStrength,
  {
    placeholder: () => string
    validateMessage: () => string
  }
> = {
  [PasswordStrength.NoCheck]: {
    placeholder: () => i18n.t('login.inputPwd'),
    validateMessage: () => i18n.t('login.inputPwd')
  },
  [PasswordStrength.Low]: {
    placeholder: () => i18n.t('login.setPwdLimit1'),
    validateMessage: () => i18n.t('login.setPwdLimitMsg1')
  },
  [PasswordStrength.Middle]: {
    placeholder: () => i18n.t('login.login.setPwdLimit2'),
    validateMessage: () => i18n.t('login.setPwdLimitMsg2')
  },
  [PasswordStrength.High]: {
    placeholder: () => i18n.t('login.login.setPwdLimit3'),
    validateMessage: () => i18n.t('login.setPwdLimitMsg3')
  },
  [PasswordStrength.AUTO]: {
    placeholder: () => i18n.t('login.inputPwd'),
    validateMessage: () => i18n.t('login.inputPwd')
  }
}

const SYMBOL_TYPE_PATTERNS = [
  /\d+/,
  /[a-zA-Z]/,
  /[`~!@#$%^&*()_\-+=<>?:"{}|,.\\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/
  // /[-!$%^&*()_+|~=`{}[\]:";'<>?,@./]/,
]

export const getSymbolTypeLength = (pwd: string) => {
  return SYMBOL_TYPE_PATTERNS.map(pattern => pattern.test(pwd)).filter(item => item).length
}

export const getPasswordValidate = (
  strength: PasswordStrength = PasswordStrength.NoCheck,
  customPasswordStrength: any = {},
  fieldRequiredRuleMessage?: string
): Rule[] => {
  const required = [
    ...fieldRequiredRule(i18n.t('common.password'), fieldRequiredRuleMessage)
    // {
    //   validateTrigger: 'onBlur',
    //   validator(_: any, value: any) {
    //     if ((value ?? '').indexOf(' ') !== -1) {
    //       return Promise.reject(i18n.t('common.checkPasswordHasSpace'))
    //     }
    //     return Promise.resolve()
    //   },
    // },
  ]
  const getCustomPassword = () => {
    if (i18n.language === 'zh-CN' && customPasswordStrength?.zhMessageOpen) {
      return customPasswordStrength?.zhMessage
    }
    if (i18n.language === 'en-US' && customPasswordStrength?.enMessageOpen) {
      return customPasswordStrength?.enMessage
    }
    if (i18n.language === 'ja-JP' && customPasswordStrength?.jaMessageOpen) {
      return customPasswordStrength?.jaMessage
    }
    if (i18n.language === 'ja-JP' && customPasswordStrength?.jpMessageOpen) {
      return customPasswordStrength?.jpMessage
    }
    if (i18n.language === 'zh-TW' && customPasswordStrength?.twMessageOpen) {
      return customPasswordStrength?.twMessage
    }
    return customPasswordStrength?.message
  }
  const validateMap: Record<PasswordStrength, Rule[]> = {
    [PasswordStrength.NoCheck]: [...required],
    [PasswordStrength.Low]: [
      ...required,
      {
        validateTrigger: 'onBlur',
        validator(r, v) {
          if (v && v.length < 6) {
            return Promise.reject(
              PASSWORD_STRENGTH_TEXT_MAP[PasswordStrength.Low].validateMessage()
            )
          }
          return Promise.resolve()
        }
      }
    ],
    [PasswordStrength.Middle]: [
      ...required,
      {
        validateTrigger: 'onBlur',
        validator(r, v) {
          if (v && (v.length < 6 || getSymbolTypeLength(v) < 2)) {
            return Promise.reject(
              PASSWORD_STRENGTH_TEXT_MAP[PasswordStrength.Middle].validateMessage()
            )
          }
          return Promise.resolve()
        }
      }
    ],
    [PasswordStrength.High]: [
      ...required,
      {
        validateTrigger: 'onBlur',
        validator(r, v) {
          if (v && (v.length < 6 || getSymbolTypeLength(v) < 3)) {
            return Promise.reject(
              PASSWORD_STRENGTH_TEXT_MAP[PasswordStrength.High].validateMessage()
            )
          }
          return Promise.resolve(true)
        }
      }
    ],
    [PasswordStrength.AUTO]: [
      ...required,
      {
        validateTrigger: 'onBlur',
        pattern: customPasswordStrength?.regex,
        message: getCustomPassword()
      }
    ]
  }

  return validateMap[strength]
}

export const getPasswordValidateRules = (
  strength: PasswordStrength = PasswordStrength.NoCheck,
  customPasswordStrength: any = {},
  customValidateTrigger?: string,
  fieldRequiredRuleMessage?: string
): Rule[] => {
  const required = [...fieldRequiredRule(i18n.t('common.password'), fieldRequiredRuleMessage)]
  const getCustomPassword = () => {
    if (i18n.language === 'zh-CN' && customPasswordStrength?.zhMessageOpen) {
      return customPasswordStrength?.zhMessage
    }
    if (i18n.language === 'en-US' && customPasswordStrength?.enMessageOpen) {
      return customPasswordStrength?.enMessage
    }
    if (i18n.language === 'ja-JP' && customPasswordStrength?.jaMessageOpen) {
      return customPasswordStrength?.jaMessage
    }
    if (i18n.language === 'ja-JP' && customPasswordStrength?.jpMessageOpen) {
      return customPasswordStrength?.jpMessage
    }
    if (i18n.language === 'zh-TW' && customPasswordStrength?.twMessageOpen) {
      return customPasswordStrength?.twMessage
    }
    return customPasswordStrength?.message
  }
  const validateMap: Record<PasswordStrength, Rule[]> = {
    [PasswordStrength.NoCheck]: [...required],
    [PasswordStrength.Low]: [
      ...required,
      {
        validateTrigger: customValidateTrigger,
        validator(r, v) {
          if (v && v.length < 6) {
            return Promise.reject(
              PASSWORD_STRENGTH_TEXT_MAP[PasswordStrength.Low].validateMessage()
            )
          }
          return Promise.resolve()
        }
      }
    ],
    [PasswordStrength.Middle]: [
      ...required,
      {
        validateTrigger: customValidateTrigger,
        validator(r, v) {
          if (v && (v.length < 6 || getSymbolTypeLength(v) < 2)) {
            return Promise.reject(
              PASSWORD_STRENGTH_TEXT_MAP[PasswordStrength.Middle].validateMessage()
            )
          }
          return Promise.resolve()
        }
      }
    ],
    [PasswordStrength.High]: [
      ...required,
      {
        validateTrigger: customValidateTrigger,
        validator(r, v) {
          if (v && (v.length < 6 || getSymbolTypeLength(v) < 3)) {
            return Promise.reject(
              PASSWORD_STRENGTH_TEXT_MAP[PasswordStrength.High].validateMessage()
            )
          }
          return Promise.resolve(true)
        }
      }
    ],
    [PasswordStrength.AUTO]: [
      ...required,
      {
        validateTrigger: customValidateTrigger,
        pattern: customPasswordStrength?.regex,
        message: getCustomPassword()
      }
    ]
  }

  return validateMap[strength]
}

export const sleep = (delay: number) => new Promise(resolve => setTimeout(resolve, delay))

export const shoudGoToComplete = (
  user: User,
  contextType: ComplateFiledsPlace,
  config: ApplicationConfig | undefined,
  autoRegister?: boolean //是否登录注册合并
) => {
  // console.log('需要补全吗？', user, contextType, config)
  // 先判断开关，再对比字段。
  let needGo = false
  // 判断新版本
  if (
    config?.complateFiledsPlace?.length &&
    config.complateFiledsPlace.includes(contextType) &&
    config?.extendsFields &&
    config?.extendsFields?.length > 0
  ) {
    needGo = true
  }

  //autoRegister 开启注册登录合并后 就不区分登录注册场景 只要 complateFiledsPlace 有值即可

  if (
    autoRegister &&
    config?.complateFiledsPlace?.length &&
    config?.extendsFields &&
    config?.extendsFields?.length > 0
  ) {
    needGo = true
  }
  // 兼容老版本
  if (
    !config?.complateFiledsPlace?.length &&
    config?.extendsFieldsEnabled &&
    config?.extendsFields &&
    config?.extendsFields?.length > 0
  ) {
    needGo = true
  }
  // 对比字段
  const allFieldsToComp = config?.extendsFields
  if (needGo && contextType === 'register' && allFieldsToComp && allFieldsToComp.length > 0) {
    if (
      user.email &&
      allFieldsToComp?.length === 1 &&
      allFieldsToComp[0]?.type === 'internal' &&
      allFieldsToComp[0]?.name === 'email'
    ) {
      return false
    }
    if (
      user.phone &&
      allFieldsToComp?.length === 1 &&
      allFieldsToComp[0]?.type === 'internal' &&
      allFieldsToComp[0]?.name === 'phone'
    ) {
      return false
    }
    if (
      allFieldsToComp
        .filter(item => item.type === 'user')
        .map(i => i.name)
        //@ts-ignore
        .map(i => user[i])
        .filter(i => Boolean(i)).length === 0
    )
      return false

    return true
  }
  if (needGo && contextType === 'login' && allFieldsToComp && allFieldsToComp.length > 0) {
    // console.log('判断补全')
    // TODO 自动注册登录
    needGo = false
    const userFields = allFieldsToComp.filter(item => item.type === 'internal')
    const udvs = allFieldsToComp.filter(item => item.type !== 'internal')
    for (const f of userFields) {
      const currKey = f.name
      // gender 特例
      if (currKey === 'gender' && user['gender'] === 'U') {
        needGo = true
        break
      }
      //@ts-ignore
      if (!user[currKey] || user[currKey] === '') {
        needGo = true
        break
      }
    }
    if (!needGo) {
      const { customData } = user
      if (customData) {
        for (const f of udvs) {
          if (!customData[f.name] || customData[f.name] === '') {
            needGo = true
            break
          }
        }
      }
    }
  }
  return needGo
}

export const transformMethod = (method: RegisterMethods | string) => {
  switch (method) {
  case RegisterMethods.Phone:
  case RegisterMethods.EmailCode:
  case RegisterSortMethods.EmailCode:
    return RegisterSortMethods.Phone
  case RegisterMethods.Email:
    return RegisterSortMethods.Email
  default:
    return method
  }
}

export const transformSortMethod = (method: RegisterSortMethods | string) => {
  switch (method) {
  case RegisterSortMethods.Email:
    return RegisterMethods.Email
  case RegisterSortMethods.EmailCode:
    return RegisterMethods.EmailCode
  case RegisterSortMethods.Phone:
    return RegisterMethods.Phone
  default:
    return method
  }
}

export const mailDesensitization = (mail: string) => {
  const mailArr = mail.split('@')
  const mailName = mailArr[0].substr(0, 1) + '***'
  return mailName + '@' + mailArr[1]
}

export const phoneDesensitization = (phone: string) => {
  return phone.replace(/(\d{3})\d*(\d{4})/, '$1****$2')
}

export const getHundreds = (num: number) => {
  return Math.floor(num / 100)
}

export const GuardPropsFilter = (pre: GuardProps, current: GuardProps) => {
  const preAttribute = Object.keys(pre).filter(name => name.startsWith('on'))

  const currentAttribute = Object.keys(current).filter(name => name.startsWith('on'))

  return isEqual(omit(pre, preAttribute), omit(current, currentAttribute))
}

export const getDocumentNode = (node: Node & ParentNode): Document => {
  if (node.nodeName === '#document') {
    return node as Document
  }

  return getDocumentNode(node.parentNode as Node & ParentNode)
}

// 1. 手机号验证码注册
//  - 手机号验证码登录
//  - 手机号密码登录
//  - 非手机号的密码登录
// 2. 邮箱验证码注册
//  - 邮箱验证码登录
//  - 邮箱密码登录
//  - 非邮箱的密码登录
// 3. 邮箱密码注册
//  - 邮箱密码登录
//  - 邮箱验证码登录
//  - 非邮箱的密码登录

export const getLoginTypePipe = (
  publicConfig: ApplicationConfig,
  registerMethod: RegisterMethods
) => {
  const loginTabs = publicConfig?.loginTabs.list // 支持的登录方式
  const verifyCodeTabMethods = publicConfig?.verifyCodeTabConfig?.enabledLoginMethods ?? [] // 支持的验证码登录方式
  const passwordTabMethods = publicConfig?.passwordTabConfig?.enabledLoginMethods ?? [] // 支持的密码登录方式
  // 通过手机验证码注册成功
  if (registerMethod === RegisterMethods.Phone) {
    if (loginTabs.includes(LoginMethods.PhoneCode) && verifyCodeTabMethods.includes('phone-code')) {
      // situation 1  手机号验证码登录
      return {
        specifyDefaultLoginMethod: LoginMethods.PhoneCode,
        lockMethod: 'phone-code'
      }
    } else if (
      loginTabs.includes(LoginMethods.Password) &&
      passwordTabMethods.includes('phone-password')
    ) {
      // situation 2 手机号密码登录
      return { specifyDefaultLoginMethod: LoginMethods.Password }
    } else {
      return undefined
    }
  }
  // 通过邮箱验证码注册成功
  if (registerMethod === RegisterMethods.EmailCode) {
    if (loginTabs.includes(LoginMethods.PhoneCode) && verifyCodeTabMethods.includes('email-code')) {
      // situation 1  邮箱验证码登录
      return {
        specifyDefaultLoginMethod: LoginMethods.PhoneCode,
        lockMethod: 'email-code'
      }
    } else if (
      loginTabs.includes(LoginMethods.Password) &&
      passwordTabMethods.includes('email-password')
    ) {
      // situation 2 邮箱密码登录
      return { specifyDefaultLoginMethod: LoginMethods.Password }
    } else {
      return undefined
    }
  }
  // 通过邮箱密码注册成功
  if (registerMethod === RegisterMethods.Email) {
    if (
      loginTabs.includes(LoginMethods.Password) &&
      passwordTabMethods.includes('email-password')
    ) {
      // situation 1  邮箱密码登录
      return { specifyDefaultLoginMethod: LoginMethods.Password }
    } else if (
      loginTabs.includes(LoginMethods.PhoneCode) &&
      verifyCodeTabMethods.includes('email-code')
    ) {
      // situation 2 邮箱验证码登录
      return {
        specifyDefaultLoginMethod: LoginMethods.PhoneCode,
        lockMethod: 'email-code'
      }
    } else {
      return undefined
    }
  }
}

// 对用户输入的数据进行校验判断是否是手机号或者邮箱
export const getPasswordIdentify = (identity: string): string => {
  return validate('phone', identity) || validate('email', identity) ? identity : ''
}

export const getCurrentLng = () => {
  if (Object.keys(LngTextMapping).includes(i18n.language)) {
    return i18n.language as Lang
  } else {
    return i18n?.languages?.[i18n?.languages?.length - 1] as Lang
  }
}

export const regexFromString = (string: string) => {
  const match = /^\/(.*)\/([a-z]*)$/.exec(string)
  if (match) {
    return new RegExp(match[1], match[2])
  }
  return null
}
export const getI18nLabel = (
  method: string | RegisterSortMethods,
  i18nFields: Map<string, TabFieldsI18nItem>,
  defaultLanguageConfig: Lang
) => {
  const lang = getCurrentLng()
  const key = method.split('-')[0]
  if (i18nFields.get(key)) {
    return (
      (i18nFields.get(key) as TabFieldsI18nItem)?.i18n?.[lang] ??
      (i18nFields.get(key) as TabFieldsI18nItem)?.i18n?.[defaultLanguageConfig] ??
      (i18nFields.get(key) as TabFieldsI18nItem).label
    )
  }
  return ''
}

export const getSortLabels = (
  methods: string[],
  i18nConfig: Map<string, TabFieldsI18nItem>,
  defaultLanguageConfig: Lang
) => {
  const labels: string[] = []
  methods.forEach(v => {
    const label = getI18nLabel(v, i18nConfig, defaultLanguageConfig)
    if (label) {
      labels.push(label)
    }
  })

  return labels.join(' / ')
}

// tab 排序
export const getSortTabs = (tabs: string[], tab?: string) => {
  const position = tabs.findIndex(item => item === tab)

  if (position > 0) {
    const item = tabs.splice(position, 1)
    tabs.unshift(item[0])
  }

  return tabs
}

export const isDisabled = (values: Record<string, any>) => {
  let disabled = false
  for (const [, value] of Object.entries(values)) {
    if (value === undefined || value === '') {
      disabled = true
      break
    }
  }
  return disabled
}
