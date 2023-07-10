# 常用 TS 类型定义及相关数据结构
## IGuardMode

Guard 展示形态：普通形态 / 模态框形态

``` ts
export type IGuardMode = 'normal' | 'modal'
```

## IGuardModuleType

Guard 所有 module，可结合 [changeView](./essentials/change-view.md) 自由切换 Guard 界面。

``` ts
// **************************************
// 枚举转字符串字面量，以兼容所有构建工具及编译场景，相当于：
// export type IGuardModuleType = 'error' | 'login' | 'register' | 'mfa' | ......
// 下同
// **************************************
export type IGuardModuleType = `${GuardModuleType}`

export enum GuardModuleType {
  ERROR = 'error', //错误页
  LOGIN = 'login', //登录页
  REGISTER = 'register', //注册页
  MFA = 'mfa', // 二次 mfa 认证页
  FORGET_PWD = 'forgetPassword', // 忘记密码页
  FORCED_PASSWORD_RESET = 'forcedPasswordReset', // 登陆安全策略 密码轮换页
  NOTICE_PASSWORD_RESET = 'noticePasswordReset', //提示修改密码页
  FIRST_LOGIN_PASSWORD = 'firstLoginPassword', //首次登录修改密码页
  UNSAFE_PASSWORD_RESET = 'unsafePasswordReset', // 密码强度不符合要求修改密码页
  DOWNLOAD_AT = 'downloadAT', //下载 Authenticator 页
  BIND_TOTP = 'bindTotp', // 绑定 TOTP页
  ANY_QUESTIONS = 'anyQuestions', // 问题反馈页
  LOGIN_COMPLETE_INFO = 'loginCompleteInfo', // 登录信息补全
  REGISTER_PASSWORD = 'registerPassword', // 验证码注册拉起密码补全页
  REGISTER_COMPLETE_INFO = 'registerCompleteInfo', //注册信息补全页
  RECOVERY_CODE = 'recoveryCode', // MFA 恢复码展示页
  SUBMIT_SUCCESS = 'submitSuccess', // 提交成功展示页
  IDENTITY_BINDING_ASK = 'identityBindingAsk', // 身份源绑定 问询页
  IDENTITY_BINDING = 'identityBinding', // 身份源绑定页
  IDENTITY_BINDING_NO_ASK = 'identityBindingNoAsk', // 身份源绑定页不问询
  SELF_UNLOCK = 'selfUnlock', // 自助解锁页
  FLOW_SELECT_ACCOUNT = 'flowSelectAccount', // 选择登录账号
  /** 多租户门户选择页 */
  TENANT_PORTAL = 'tenant-portal',
  New_SUBMIT_SUCCESS = 'newSubmitSuccess', // 提交成功展示页
  RESET_ACCOUNT_NAME = 'resetAccountName' // 重置账号
}
```

## IGuardTabType

Guard 所有 tab，可结合 [changeView](./essentials/change-view.md) 自由切换 Guard 界面。通常只有登录和注册界面下才有 tab。

``` ts
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
```
## Lang

``` ts
export type Lang = 'zh-CN' | 'en-US' | 'zh-TW' | 'ja-JP'
```

## IGuardConfig

``` ts
export interface IGuardConfig {
  // 自定义 Guard 标题
  title?: string,

  // 自定义 Guard 展示 LOGO
  logo?: string

  // mode = 'modal' 时，是否可关闭模态框
  clickCloseable?: boolean

  // 多语言范围
  langRange: Lang[]

  // 社会化身份源
  socialConnectionList?: ISocialConnectionProvider[]

  // 默认登录方式
  loginMethod?: ILoginMethod

  // 所有可用的登录方式
  loginMethodList: ILoginMethod[]

  // 默认注册方式
  registerMethod?: IRegisterMethod

  // 所有可用注册方式
  registerMethodList?: IRegisterMethod[]

  // 自定义 CSS 样式，如果指定了，会在 DOM 的 head 中插入一个 <style type="text/css"></style> 节点。如 body {background:#6699
  contentCSS?: string
}
```

## ISocialConnectionProvider

社会化身份源

``` ts
export type ISocialConnectionProvider = `${SocialConnectionProvider}`

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
```

## ILoginMethod

Guard 提供的可用的登录方式

``` ts
export type ILoginMethod = `${LoginMethods}`

export enum LoginMethods {
  LDAP = 'ldap',
  AppQr = 'app-qrcode',
  Password = 'password',
  PhoneCode = 'phone-code',
  WxMinQr = 'wechat-miniprogram-qrcode', // 对应社会化登录的 wechat:miniprogram:qrconnect(小程序扫码登录)
  AD = 'ad', // 对应企业身份源的 Windows AD 登录
  WechatMpQrcode = 'wechatmp-qrcode', // 微信扫码关注登录
  AuthingOtpPush = 'authing-otp-push' // App 扫码登录
}
```

## IRegisterMethod

Guard 提供的可用的注册方式

``` ts
export type IRegisterMethod = `${RegisterMethods}`

export enum RegisterMethods {
  Email = 'email',
  Phone = 'phone',
  EmailCode = 'emailCode'
}
```

## NomalLoginParams

```typescript
interface NomalLoginParams {
  type: "ldap" /**LDAP 登录 */
    | "ad" /**AD 登录 */
    | "password"/**密码登录，如手机号 + 密码，邮箱 + 密码 */;
  data: {
    identity: string; // 账号
    password: string; // 密码
    captchaCode?: string; // 图形验证码
  };
}
```

## VerifyCodeLoginParams

```typescript
interface VerifyCodeLoginParams {
  type: "email-code" /**邮箱验证码登录 */
    | "phone-code" /**手机验证码登录 */;
  data: {
    identity: string; // 账号
    code: string; // 验证码
    phoneCountryCode?: string; // 开启国际化短信后携带的区号信息
  };
}
```

## ScanLoginParams

```typescript
interface ScanLoginParams {
  type: "app-qrcode" /**APP 扫码登录登录 */
    | "wechat-miniprogram-qrcode" /**微信小程序扫码登录 */
    | "wechatmp-qrcode" /**微信公众号扫码登录登录 */;
  data: User; // 用户信息
}
```

## RegisterParams

```typescript
interface RegisterParams {
  type: "phone" /**手机验证码注册 */
    | "email" /**邮箱密码注册 */
    | "emailCode" /**邮箱验证码注册 */;
  data: {
    identity: string; // 账号
    password?: string; // 密码
    code?: string; // 验证码
  };
}
```

## User

详情请见：[用户字段释义](https://docs.authing.cn/v2/guides/user/user-profile.html)。

## OnAfterChangeModuleOptions

``` typescript
interface OnAfterChangeModuleOptions {
  currentView: string
  currentModule: IGuardModuleType
  currentTab?: IGuardTabType
  data?: any
}
```

## ILoginError
``` ts
interface ILoginError {
  code: number
  data: any
  message: string
}
```

## IEmailScene

Guard 内部邮箱验证码发送的场景值，根据场景值发送控制台配置完成的邮件模版

``` ts
export type IEmailScene = `${EmailScene}`

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
  SELF_UNLOCKING_VERIFY_CODE = 'SELF_UNLOCKING_VERIFY_CODE'
}
```

## ISceneType

Guard 内部短信验证码发送的场景值

```ts
export type ISceneType = `${SceneType}`

export declare enum SceneType {
  SCENE_TYPE_LOGIN = "login",
  SCENE_TYPE_REGISTER = "register",
  SCENE_TYPE_RESET = "reset",
  SCENE_TYPE_BIND = "bind",
  SCENE_TYPE_UNBIND = "unbind",
  SCENE_TYPE_MFA_BIND = "mfa-bind",
  SCENE_TYPE_MFA_VERIFY = "mfa-verify",
  SCENE_TYPE_MFA_UNBIND = "mfa-unbind",
  SCENE_TYPE_COMPLETE_PHONE = "complete-phone"
}
```

## NomalLoginParams

```typescript
interface NomalLoginParams {
  type: "ldap" /**LDAP 登录 */
    | "ad" /**AD 登录 */
    | "password"/**密码登录，如手机号 + 密码，邮箱 + 密码 */;
  data: {
    identity: string; // 账号
    password: string; // 密码
    captchaCode?: string; // 图形验证码
  };
}
```

## VerifyCodeLoginParams

```typescript
interface VerifyCodeLoginParams {
  type: "email-code" /**邮箱验证码登录 */
    | "phone-code" /**手机验证码登录 */;
  data: {
    identity: string; // 账号
    code: string; // 验证码
    phoneCountryCode?: string; // 开启国际化短信后携带的区号信息
  };
}
```

## IChangeViewOptions
```ts
export interface IChangeViewOptions {
  module: IGuardModuleType
  tab?: IGuardTabType
}
```

## LogoutParams

``` ts
export interface LogoutParams {
  // 退出后的重定向地址，默认使用控制台 -> 应用 -> 自建应用 -> 应用配置 -> 认证配置 -> 登出回调 URL 中的第一个
  redirectUri?: string
  // 只退出当前设备，不影响其他设备登录状态
  quitCurrentDevice?: boolean
}
```

## Guard
```ts
class Guard {
  async getAuthClient(): Promise<AuthenticationClient>

  /**
   * 启动嵌入模式
   * @param el String
   * @returns Promise
   */
  async start(el?: string): Promise<User>

  changeLang(lang: Lang): void

  changeContentCSS(contentCSS: string): void

  /**
   * 启动跳转模式
   */
  async startWithRedirect(options: StartWithRedirectOptions = {}): void

  async handleRedirectCallback(): void

  /**
   * 获取当前用户信息
   */
  async trackSession(): Promise<User | null>

  async logout(params: LogoutParams = {}): void

  show(): void

  hide(): void

  unmount(): void

  async changeView(currentView: string | IChangeViewOptions): void

  checkAllAgreements(): void

  unCheckAllAgreements(): void
}
```
