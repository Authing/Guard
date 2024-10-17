export type Lang = 'zh-CN' | 'en-US' | 'zh-TW' | 'ja-JP'

import { MFAType } from '../MFA/interface'
import { PasswordStrength } from '../_utils'

export * from 'authing-js-sdk'

export enum LoginMethods {
  LDAP = 'ldap',
  AppQr = 'app-qrcode',
  Password = 'password',
  PhoneCode = 'phone-code',
  EmailCode = 'email-code', // 这是前端单独加的，后端只会返回 phone-code
  WxMinQr = 'wechat-miniprogram-qrcode', // 对应社会化登录的 wechat:miniprogram:qrconnect(小程序扫码登录)
  AD = 'ad', // 对应企业身份源的 Windows AD 登录
  WechatMpQrcode = 'wechatmp-qrcode', // 微信扫码关注登录
  AuthingOtpPush = 'authing-otp-push', // App 扫码登录
  WechatworkCorpQrconnect = 'wechatwork-corp-qrconnect', // 微信企业扫码关注登录
  DingTalkQrcode = 'dingtalk-qrcode', //钉钉扫码
  Passkey = 'passkey', // passkey
  ZJZWFWQrcode = 'zjzwfw-qrcode' // 浙江政务钉
}

export enum OIDCConnectionMode {
  FRONT_CHANNEL = 'FRONT_CHANNEL',
  BACK_CHANNEL = 'BACK_CHANNEL'
}

export enum SocialConnectionProvider {
  ALIPAY = 'alipay',
  GOOGLE = 'google',
  WECHATPC = 'wechat:pc',
  WECHATMP = 'wechat:webpage-authorization',
  WECHAT_MINIPROGRAM = 'wechat:miniprogram:default',
  WECHAT_MINIPROGRAM_QRCODE = 'wechat:miniprogram:qrconnect',
  WECHAT_MINIPROGRAM_APPLAUNCH = 'wechat:miniprogram:app-launch',
  WECHATMOBILE = 'wechat:mobile',
  GITHUB = 'github',
  QQ = 'qq',
  WECHATWORK_ADDRESS_BOOK = 'wechatwork:addressbook',
  WECHATWORK_CORP_QRCONNECT = 'wechatwork:corp:qrconnect',
  WECHATWORK_SERVICEPROVIDER_QRCONNECT = 'wechatwork:service-provider:qrconnect',
  DINGTALK = 'dingtalk',
  WEIBO = 'weibo',
  APPLE = 'apple',
  APPLE_WEB = 'apple:web',
  LARK_PUBLIC = 'lark-public',
  LARK_INTERNAL = 'lark-internal',
  BAIDU = 'baidu',
  LINKEDIN = 'linkedin',
  SLACK = 'slack',
  YIDUN = 'yidun',
  QINGCLOUD = 'qingcloud',
  FACEBOOK = 'facebook'
}

export enum Protocol {
  AD = 'ad',
  CAS = 'cas',
  LDAP = 'ldap',
  OIDC = 'oidc',
  SAML = 'saml',
  OAUTH = 'oauth',
  AZURE_AD = 'azure-ad',
  AD_KERBEROS = 'ad-kerberos'
}

export interface IOAuthConnectionConfig {
  authEndPoint: string
  tokenEndPoint: string
  scope: string
  clientId: string
  clientSecret: string
  authUrlTemplate: string
  codeToTokenScript: string
  tokenToUserInfoScript: string
  tokenToUserInfoScriptFuncId: string
  codeToTokenScriptFuncId: string
  authUrl?: string // 根据模板拼接出来的授权 url
}

export interface IAzureAdConnectionConfig {
  microsoftAzureAdDomain: string
  clientId: string
  syncUserProfileOnLogin: string
  emailVerifiedDefault: boolean
  authorizationUrl: string
  callbackUrl: string
}

export interface ISamlConnectionConfig {
  signInEndPoint: string
  samlRequest?: string

  // saml assertion 验签公钥

  samlIdpCert: string

  // saml request 验签公钥

  samlSpCert: string

  // saml request 签名私钥

  samlSpKey: string

  signOutEndPoint: string

  signSamlRequest: boolean

  signatureAlgorithm: string

  digestAlgorithm: string

  protocolBinding: string
}

export interface ICasConnectionConfig {
  casConnectionLoginUrl: string
}

export interface SocialConnectionItem {
  id: string
  embedded: boolean
  name: string
  name_en: string
  displayName: string
  logo: string
  description: string
  identifier: string
  provider: SocialConnectionProvider
  authorizationUrl: string
  tooltip: Record<Lang, string>
}

export enum RegisterMethods {
  Email = 'email',
  Phone = 'phone',
  EmailCode = 'emailCode'
}

export enum RegisterSortMethods {
  Email = 'email-password',
  Phone = 'phone-code',
  EmailCode = 'email-code'
}

export interface QrCodeItem {
  id: string
  title: string
  isDefault?: boolean
  QRConfig?: {
    corpId: string
    agentId: string
    redirectUrl: string
    identifier: string
    clientId?: string
    authorizationUrl?: string
  }
}

export type QrcodeTabsSettings = Record<LoginMethods, Array<QrCodeItem>>

export interface OidcClientMetadata {
  grant_types: string[]
  client_id: string
  redirect_uris: string[]
  scope: string
  response_types: ResponseType[]
}

export interface OIDCConnectionConfig {
  issuerUrl: string
  authorizationEdpoint: string
  responseType: string
  mode: OIDCConnectionMode
  clientId: string
  clientSecret: string
  scopes: string
  redirectUri: string
}

export interface InternalExtendsField {
  type: 'internal'
  name: string
  label: string
  inputType: string
  required: boolean
  validateRules: any[]
}

export interface UserExtendsField {
  type: 'user'
  id: string
  name: string
  label: string
  inputType: string
  required: boolean
  validateRules: any[]
}

export type ExtendsField = InternalExtendsField | UserExtendsField

// 密码登录注册支持
export interface ApplicationPasswordTabConfig {
  enabledLoginMethods?: PasswordLoginMethods[]
  validRegisterMethods?: string[]
  validLoginMethods?: string[]
}

// 验证码登录注册支持
export interface ApplicationVerifyCodeTabConfig {
  enabledLoginMethods: VerifyLoginMethods[]
  validRegisterMethods?: string[]
  validLoginMethods?: string[]
}

export interface Agreement {
  id: number
  title: string
  required: boolean
  lang: Lang
  availableAt?: number
}

export type PasswordLoginMethods =
  | 'username-password'
  | 'email-password'
  | 'phone-password'

export type VerifyLoginMethods = 'email-code' | 'phone-code'

export type ComplateFiledsPlace = 'register' | 'login'

export interface TabFieldsI18nItem {
  key: string
  label: string
  labelEn: string
  i18n: {
    [propName in Lang]?: string
  }
}

interface LoginTypeI18nProps {
  tab: {
    default: string
    i18n: {
      [propName: string]: string
    }
  }
}

export interface ApplicationConfig {
  id: string
  allowedOrigins: string[]
  corsWhitelist: string[]
  cdnBase: string
  userPoolId: string
  rootUserPoolId: string
  publicKey: string
  internationalSmsConfig?: {
    enabled: boolean
    defaultISOType: string
  }
  // 登录框自定义 css 代码
  css: string
  customLoading?: string
  name: string
  logo: string
  description?: string
  deviceFuncEnabled?: boolean
  redirectUris: string[]
  registerDisabled: boolean
  mergeAdAndAccountPasswordLogin: boolean
  registerTabs: {
    list: string[]
    default: string
    title: { [x: string]: string }
  }
  registerTabsConfig: {
    list: string[]
    default: string
    title: { [x: string]: string }
    registerTypeConfig: {
      emailRegisterType?: RegisterMethods[]
      phoneRegisterType?: RegisterMethods[]
    }
  }
  resetPwdCustomLogo?: string
  qrcodeTabsSettings: QrcodeTabsSettings

  qrCodeSortConfig: {
    loginMethodsSort?: string[]
  }

  loginTabs: {
    list: string[]
    default: string
    defaultV2?: string
    title: { [x: string]: string }
  }
  socialConnections: SocialConnectionItem[]

  complateFiledsPlace: ComplateFiledsPlace[]
  extendsFieldsEnabled: boolean
  extendsFields: ExtendsField[]
  extendsFieldsI18n?: {
    [key: string]: Record<Lang, { enabled: boolean; value: string }>
  }

  identifier: string
  requestHostname: string
  identityProviders: {
    identifier: string
    protocol: Protocol
    displayName: string
    logo: string
    config:
      | ISamlConnectionConfig
      | OIDCConnectionConfig
      | ICasConnectionConfig
      | IAzureAdConnectionConfig
      | IOAuthConnectionConfig
    /** 是否开启内嵌模式 */
    embedded?: boolean
  }[]

  ssoPageComponentDisplay: {
    autoRegisterThenLoginHintInfo: boolean
    forgetPasswordBtn: boolean
    idpBtns: boolean
    loginBtn: boolean
    loginByPhoneCodeTab: boolean
    loginByUserPasswordTab: boolean
    loginMethodNav: boolean
    phoneCodeInput: boolean
    registerBtn: boolean
    registerByEmailTab: boolean
    registerByPhoneTab: boolean
    registerMethodNav: boolean
    socialLoginBtns: boolean
    userPasswordInput: boolean
    wxMpScanTab: boolean
    loginMethodsI18nDisplaySettings: {
      password?: LoginTypeI18nProps
      verifyCode?: LoginTypeI18nProps
      ad?: LoginTypeI18nProps
      ldap?: LoginTypeI18nProps
    }
  }

  protocol: Protocol
  oidcConfig: OidcClientMetadata
  passwordTabConfig: ApplicationPasswordTabConfig
  verifyCodeTabConfig?: ApplicationVerifyCodeTabConfig

  agreementEnabled: boolean
  agreements: Agreement[]
  customPasswordStrength: any
  passwordStrength: PasswordStrength
  verifyCodeLength: number
  websocket: string
  welcomeMessage: any

  skipComplateFileds: boolean

  selfUnlockStrategy: 'captcha' | 'password-captcha'

  defaultLanguageConfig: Lang
  /**
   * 是否开启账号切换
   */
  enableLoginAccountSwitch: boolean
  /**
   * 是否开启注册密码补全
   */
  enableCompletePassword: boolean
  /** 是否开启手机密码注册手机号验证 */
  enabledPPRegisterValid?: boolean
  /** 是否开启邮箱域名匹配登录 */
  enabledMatchEmailDomain?: boolean
  /**
   * 登录注册排序
   */
  tabMethodsSortConfig: {
    loginMethodsSort: string[]
  }
  // i18n
  tabMethodsFields: TabFieldsI18nItem[]

  regexRules?: { key: string; appLevel: string; userpoolLevel: string }[]
  /** 是否为租户控制台应用 */
  isTenantConsole?: boolean

  /** 是否默认为租户应用面板应用 */
  isTenantDefault?: boolean

  /** 租户详情 */
  tenantInfo?: Record<string, any>

  /** mfa 相关 */
  mfa: {
    faceScore: number
  }

  authingOtpPushTabConfig: {
    enabledLoginMethods: Array<string> | null
    validLoginMethods: Array<string> | null
    validRegisterMethods: Array<string> | null
  }
  /** 是否开启自定义安全规则 */
  customSecurityEnabled: boolean
  /** 应用的人机验证策略，始终开启、不开启、设置条件触发 */
  appRobotVerify: 'always_enable' | 'disable' | 'condition_set'
  /** 用户池的人机验证策略，始终开启、不开启、设置条件触发 */
  userpoolRobotVerify: 'always_enable' | 'disable' | 'condition_set'
  /** 加入租户校验企业邮箱 */
  enableVerifyDomainInJoinTenant: boolean

  passkeyEnabled: boolean

  defaultAppId: string // 默认应用

  enableCreateTenant: boolean // 是否允许创建租户

  enableJoinTenant: boolean // 是否允许加入租户

  mfaBindConfigs?: { mfa: MFAType; changeable: boolean }[]
  /** 注册阶段短信安全配置 */
  registerSmsConfig?: {
    robot: {
      switch: 'OFF' | 'ON' | 'CONDON' //ON,COND_ON
    }
  }
  /** 登录阶段短信安全配置 */
  loginSmsConfig?: {
    robot: {
      switch: 'OFF' | 'ON' | 'CONDON' //ON,COND_ON
    }
  }

  /** 特殊浏览器匹配字符串 */
  specialBrowserSymbols?: string[]
}
