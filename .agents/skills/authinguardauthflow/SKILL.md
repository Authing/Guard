# Authing Guard 认证流程 Skill

本 Skill 基于 Authing Guard 核心认证架构，用于指导其他项目快速实现标准化的登录后链路验证流程。

---

## 一、核心架构概述

### 1.1 整体流程图

```
用户操作 → 业务请求 → HTTP拦截器 → 错误码判断 → 响应处理
                                    ↓
                    ┌───────────────┼───────────────┐
                    ↓               ↓               ↓
               切换模块        渲染错误消息      流程结束
               (changeModule)  (renderMessage)   (flowEnd)
                    ↓               ↓               ↓
               MFA验证          提示用户        回调成功
               身份绑定
               信息补全
               ...
```

### 1.2 核心组件

| 组件 | 职责 |
|------|------|
| **状态机 (StateMachine)** | 管理模块切换历史，支持回退 |
| **模块系统 (ModuleType)** | 定义所有业务模块枚举 |
| **HTTP客户端 (GuardHttp)** | 封装请求，注入公共头，拦截响应 |
| **错误码映射 (CodeMap)** | 定义错误码到行为的映射 |
| **事件系统 (Events)** | 处理登录/错误/模块切换等回调 |

---

## 二、模块系统设计

### 2.1 标准模块枚举

```typescript
enum GuardModuleType {
  // 基础模块
  ERROR = 'error',                    // 错误页
  LOGIN = 'login',                    // 登录页
  REGISTER = 'register',              // 注册页

  // 安全验证模块
  MFA = 'mfa',                        // 二次认证
  BIND_TOTP = 'bindTotp',            // 绑定 TOTP
  DOWNLOAD_AT = 'downloadAT',        // 下载 Authenticator
  RECOVERY_CODE = 'recoveryCode',    // MFA 恢复码

  // 密码相关
  FORGET_PWD = 'forgetPassword',      // 忘记密码
  FIRST_LOGIN_PASSWORD = 'firstLoginPassword',   // 首次登录改密
  FORCED_PASSWORD_RESET = 'forcedPasswordReset', // 强制改密
  UNSAFE_PASSWORD_RESET = 'unsafePasswordReset', // 不安全密码改密

  // 信息补全
  LOGIN_COMPLETE_INFO = 'loginCompleteInfo',     // 登录信息补全
  REGISTER_COMPLETE_INFO = 'registerCompleteInfo', // 注册信息补全

  // 身份源绑定
  IDENTITY_BINDING = 'identityBinding',          // 身份源绑定
  IDENTITY_BINDING_ASK = 'identityBindingAsk',   // 身份源绑定问询

  // 其他
  SELF_UNLOCK = 'selfUnlock',        // 自助解锁
  SUBMIT_SUCCESS = 'submitSuccess',   // 提交成功
  TENANT_PORTAL = 'tenant-portal',    // 租户选择
}
```

### 2.2 模块动作接口

```typescript
interface GuardModuleAction {
  action: 'changeModule' | 'message' | 'flowEnd'
  module?: GuardModuleType      // 目标模块
  message?: string              // 提示消息
  initData?: any                // 传递给模块的数据
}
```

---

## 三、错误码映射机制

### 3.1 错误码分类

```typescript
enum ErrorCode {
  // MFA 相关
  OTP_MFA_CODE = 1635,          // TOTP MFA 验证
  APP_MFA_CODE = 1636,          // APP MFA 验证

  // 验证相关
  INPUT_CAPTCHACODE = 2000,     // 需要图形验证码
  PASSWORD_ERROR = 2333,        // 密码错误

  // 账号状态
  ACCOUNT_LOCK = 2005,          // 账号锁定
  MULTIPLE_ERROR_LOCK = 2057,  // 多次错误锁定

  // 身份绑定
  IDENTITY_BINDING = 1640,     // 需要身份源绑定
  IDENTITY_BINDING_ASK = 1641, // 身份源绑定问询

  // 信息补全
  COMPLETE_INFO = 1642,         // 需要补全信息

  // 其他
  SELECT_ACCOUNT_2_LOGIN = 2930, // 选择登录账号
  RESET_ACCOUNT_NAME = 1108,     // 用户名重复
}
```

### 3.2 错误码映射表

```typescript
const codeMap: Record<number, GuardModuleAction> = {
  // MFA 验证 -> 跳转 MFA 模块
  [ErrorCode.OTP_MFA_CODE]: {
    action: 'changeModule',
    module: GuardModuleType.MFA,
    initData: { current: MFAType.TOTP }
  },

  // 需要身份绑定 -> 跳转绑定模块
  [ErrorCode.IDENTITY_BINDING]: {
    action: 'changeModule',
    module: GuardModuleType.IDENTITY_BINDING
  },

  // 需要信息补全 -> 跳转补全模块
  [ErrorCode.COMPLETE_INFO]: {
    action: 'changeModule',
    module: GuardModuleType.LOGIN_COMPLETE_INFO
  },

  // 密码错误 -> 显示消息
  [ErrorCode.PASSWORD_ERROR]: {
    action: 'message'
  },

  // 账号锁定 -> 特殊处理
  [ErrorCode.ACCOUNT_LOCK]: {
    action: 'accountLock'
  }
}
```

### 3.3 API 状态码到动作的映射

```typescript
enum CodeAction {
  CHANGE_MODULE = 'changeModule',   // 切换模块
  RENDER_MESSAGE = 'renderMessage', // 渲染消息
  FLOW_END = 'flowEnd'              // 流程结束
}

// 根据状态码百位数判断
function getActionCode(statusCode: number): CodeAction {
  const hundreds = Math.floor(statusCode / 100)

  if (hundreds === 3) {
    return CodeAction.CHANGE_MODULE  // 3xx 切换模块
  } else if (hundreds === 4 || hundreds === 6) {
    return CodeAction.RENDER_MESSAGE // 4xx/6xx 显示消息
  }
  return null
}
```

---

## 四、HTTP 请求封装

### 4.1 请求客户端类

```typescript
class GuardHttp {
  private headers: Record<string, string> = {
    'x-authing-userpool-id': '',
    'x-authing-app-id': '',
    'x-authing-sdk-version': SDK_VERSION,
    'x-authing-request-from': `Guard@${SDK_VERSION}`
  }

  // 设置公共请求头
  setUserpoolId(id: string) { this.headers['x-authing-userpool-id'] = id }
  setAppId(id: string) { this.headers['x-authing-app-id'] = id }
  setTenantId(id: string) { this.headers['x-authing-app-tenant-id'] = id }
  setDeviceId(id: string) { this.headers['x-authing-device-id'] = id }

  // 统一请求方法
  async get<T>(path: string, query?: any): Promise<AuthingGuardResponse<T>>
  async post<T>(path: string, data?: any): Promise<AuthingGuardResponse<T>>

  // 认证流程专用方法
  async authFlow<T>(action: string, data?: any): Promise<AuthingGuardResponse<T>> {
    const flowHandle = getFlowHandle()  // 获取流程句柄
    return this.post('/interaction/authFlow', { action, data, flowHandle })
  }
}
```

### 4.2 响应拦截器

```typescript
function errorCodeInterceptor(
  res: AuthingResponse,
  callback: (action: CodeAction, res: AuthingResponse) => AuthingGuardResponse
): AuthingGuardResponse {
  // 处理网络错误
  if (res.code === -1) {
    message.error(i18n.t('common.timeout'))
    return res
  }
  if (res.code === -2) {
    message.error(i18n.t('common.fetchError'))
    return res
  }

  // 更新流程句柄
  res.flowHandle && updateFlowHandle(res.flowHandle)

  // 根据状态码判断行为
  const hundreds = Math.floor(res.statusCode / 100)

  if (hundreds === 3) {
    if (res.apiCode === ApiCode.FLOW_END) {
      return callback(CodeAction.FLOW_END, res)
    }
    return callback(CodeAction.CHANGE_MODULE, res)
  } else if (hundreds === 4 || hundreds === 6) {
    return callback(CodeAction.RENDER_MESSAGE, res)
  }

  return res
}
```

---

## 五、状态机实现

### 5.1 状态机类

```typescript
class GuardStateMachine {
  private moduleStateHistory: ModuleState[] = []
  private changeModuleEvent: ChangeModuleEvent

  constructor(changeModuleEvent: ChangeModuleEvent, initData: ModuleState) {
    this.changeModuleEvent = changeModuleEvent
    this.historyPush(initData)

    // 监听浏览器返回
    window.addEventListener('popstate', this.onPopstate)
  }

  // 切换到下一个模块
  next = (nextModule: GuardModuleType, initData?: any) => {
    this.changeModuleEvent(nextModule, initData)
    this.historyPush({ moduleName: nextModule, initData })

    // 浏览器 history 同步
    window.history.pushState(nextModule, '', window.location.href)
  }

  // 返回上一个模块
  back = (initData?: any) => {
    if (this.moduleStateHistory.length <= 1) return
    this.moduleStateHistory.shift()
    const prevModule = this.moduleStateHistory[0]
    this.changeModuleEvent(prevModule.moduleName, { ...initData, ...prevModule.initData })
  }

  // 记录历史（限制最多10条）
  private historyPush = (data: ModuleState) => {
    this.moduleStateHistory.unshift(data)
    if (this.moduleStateHistory.length > 10) {
      this.moduleStateHistory = this.moduleStateHistory.slice(0, 10)
    }
  }
}
```

---

## 六、事件系统

### 6.1 事件接口定义

```typescript
interface GuardEvents {
  // 加载事件
  onLoad?: (client: AuthenticationClient) => void
  onLoadError?: (error: Error) => void

  // 登录事件
  onBeforeLogin?: (loginInfo: any, client: AuthenticationClient) => boolean | Promise<boolean>
  onLogin?: (user: User, client: AuthenticationClient) => void
  onLoginError?: (error: { code: number; data: any; message?: string }) => void

  // 注册事件
  onBeforeRegister?: (registerInfo: any, client: AuthenticationClient) => boolean | Promise<boolean>
  onRegister?: (user: User, client: AuthenticationClient) => void
  onRegisterError?: (error: any) => void

  // 模块切换事件
  onBeforeChangeModule?: (key: GuardModuleType, initData?: any) => boolean | Promise<boolean>
  onAfterChangeModule?: (options: { currentView: string; currentModule: GuardModuleType; data?: any }) => void

  // 其他事件
  onClose?: () => void
  onLangChange?: (lang: Lang) => void
}
```

### 6.2 事件劫持（用于注入默认行为）

```typescript
function guardEventsHijacking(events: GuardEvents): GuardEvents {
  const newEvents: GuardEvents = {}

  // 劫持 onLogin 事件，注入默认行为
  newEvents.onLogin = (user: User, client: AuthenticationClient) => {
    // 默认行为：设置 token、显示成功消息
    message.success(i18n.t('common.LoginSuccess'))
    user.token && client.setToken(user.token)
    client.setCurrentUser(user)

    // 执行用户自定义回调
    events.onLogin?.(user, client)
  }

  return { ...events, ...newEvents }
}
```

---

## 七、流程句柄管理

### 7.1 Flow Handle 存储

```typescript
// 内存存储流程句柄
let flowHandleStorage: string | undefined

export const getFlowHandle = () => flowHandleStorage
export const updateFlowHandle = (handle: string) => { flowHandleStorage = handle }
```

### 7.2 使用流程句柄发起认证流程

```typescript
// 每次请求携带流程句柄
async function submitLoginAction(action: string, data: any) {
  const httpClient = getGuardHttp()
  return httpClient.authFlow(action, data)
}

// 示例：密码登录
await submitLoginAction('PASSWORD_LOGIN', {
  account: 'user@example.com',
  password: encryptedPassword
})
```

---

## 八、实现指南

### 8.1 初始化顺序

```
1. 初始化 HTTP 客户端
   ↓
2. 设置公共请求头（appId, tenantId, deviceId）
   ↓
3. 注册错误码拦截器
   ↓
4. 初始化状态机（默认模块：LOGIN）
   ↓
5. 渲染对应模块组件
```

### 8.2 请求-响应处理流程

```
1. 用户提交表单
   ↓
2. 调用 onBeforeXxx 钩子（可阻止）
   ↓
3. 发起 HTTP 请求（携带 flowHandle）
   ↓
4. 响应拦截器处理：
   ├─ 更新 flowHandle
   ├─ 判断状态码
   └─ 返回 CodeAction
   ↓
5. 根据 CodeAction 执行：
   ├─ CHANGE_MODULE: 切换模块
   ├─ RENDER_MESSAGE: 显示错误
   └─ FLOW_END: 调用 onXxx 成功回调
```

### 8.3 模块切换流程

```
1. 拦截器返回 CHANGE_MODULE
   ↓
2. 根据 apiCode 查找目标模块
   ↓
3. 调用 onBeforeChangeModule 钩子
   ↓
4. 状态机记录历史
   ↓
5. 更新当前模块状态
   ↓
6. 渲染新模块组件
   ↓
7. 调用 onAfterChangeModule 钩子
```

---

## 九、代码模板

### 9.1 初始化 Guard 核心代码

```typescript
function initGuardCore(config: GuardConfig) {
  // 1. 初始化 HTTP 客户端
  const httpClient = initGuardHttp(config.host)
  httpClient.setAppId(config.appId)
  httpClient.setTenantId(config.tenantId)

  // 2. 注册错误码拦截器
  httpClient.initErrorCodeInterceptor((code, res) => {
    if (code === CodeAction.CHANGE_MODULE) {
      const nextModule = ChangeModuleApiCodeMapping[res.apiCode]
      stateMachine.next(nextModule, res.data)
    } else if (code === CodeAction.RENDER_MESSAGE) {
      message.error(res.message)
    } else if (code === CodeAction.FLOW_END) {
      events.onLogin?.(res.data.user, authClient)
    }
    return { ...res, onGuardHandling: code }
  })

  // 3. 初始化状态机
  const stateMachine = initGuardStateMachine(
    (module, initData) => {
      // 更新当前模块状态触发渲染
      setCurrentModule({ moduleName: module, initData })
    },
    { moduleName: GuardModuleType.LOGIN, initData: {} }
  )

  return { httpClient, stateMachine }
}
```

### 9.2 React 组件渲染模板

```tsx
function RenderModule() {
  const { currentModule, changeModule } = useGuardModule()

  const ComponentsMapping: Record<GuardModuleType, React.FC> = {
    [GuardModuleType.LOGIN]: LoginView,
    [GuardModuleType.MFA]: MFAView,
    [GuardModuleType.IDENTITY_BINDING]: IdentityBindingView,
    // ... 其他模块
  }

  const Component = ComponentsMapping[currentModule.moduleName]

  return <Component key={currentModule.moduleName} {...currentModule.initData} />
}
```

---

## 十、注册限制机制

### 10.1 配置来源（优先级从高到低）

```typescript
// _utils/config/index.ts:170-174
disableRegister: !!(
  config.disableRegister ??                          // 1. 用户传入的配置
  !publicConfig.ssoPageComponentDisplay.registerBtn  // 2. Console 后台配置
)
```

当 Console 后台 `registerBtn` 为 false，或用户主动传入 `disableRegister: true` 时，注册入口将被隐藏。

### 10.2 登录方式额外强制限制

即使 Console 后台允许注册，某些登录方式下会强制禁止注册：

```typescript
// Login/index.tsx:152-170 useDisables 钩子
const useDisables = (data: any) => {
  let { disableResetPwd, disableRegister } = data.config
  let { loginWay, autoRegister } = data

  if ([LoginMethods.LDAP, LoginMethods.AuthingOtpPush].includes(loginWay)) {
    disableRegister = true   // LDAP / OTP Push 方式下强制禁止注册
  }
  if (loginWay === LoginMethods.AD) {
    disableRegister = true   // AD 方式下强制禁止注册
  }
  if (autoRegister === true) {
    disableRegister = true   // 登录注册合并模式下禁止独立注册入口
  }

  return { disableResetPwd, disableRegister }
}
```

### 10.3 UI 控制

```tsx
// Login/index.tsx:1261-1274
{!disableRegister && (
  <span className="go-to-register">
    <GuardButton onClick={() => changeModule?.(GuardModuleType.REGISTER, {})}>
      {t('common.registerImmediate')}
    </GuardButton>
  </span>
)}
```

`disableRegister` 为 true 时，**注册按钮不渲染**，用户无法进入注册页。

### 10.4 autoRegister（登录注册合并）

```typescript
// _utils/config/index.ts:122-124
const autoRegister = config.autoRegister ??
  publicConfig.ssoPageComponentDisplay.autoRegisterThenLoginHintInfo
```

当 `autoRegister` 开启时，注册 tab 不再独立显示，而是合并到登录流程中。
此时 `disableRegister` 被强制设为 true，隐藏独立的注册入口。

### 10.5 registerMethods 为空

```typescript
// _utils/config/index.ts:162-166
registerMethods: config.registerMethods ??
  (autoRegister
    ? registerMethods
    : (publicConfig.registerTabs?.list as RegisterMethods[]))
```

如果 Console 后台没有开启任何注册方式，`registerMethods` 为空数组，注册页不会渲染任何 tab。

### 10.6 限制注册完整流程图

```
Console 后台 (registerBtn = false)
        ↓
publicConfig.ssoPageComponentDisplay.registerBtn
        ↓
   disableRegister = true
        ↓
  登录页注册按钮不渲染 → 用户无法进入注册页

额外强制条件：
  ├─ LDAP / OTP Push / AD 登录方式 → disableRegister = true
  └─ autoRegister = true（登录注册合并）→ disableRegister = true

兜底：
  └─ registerMethods 为空 → 注册页无内容可渲染
```

### 10.7 注册后跳转逻辑

注册成功后，`onRegisterSuccess` 回调会自动跳转回登录页：

```typescript
// Register/index.tsx:79-103
onRegisterSuccess: (data, registerInfo, message) => {
  // 1. 触发 onRegister 事件回调
  events?.onRegister?.(data, authClient)

  // 2. 计算登录页回填数据（指定登录方式 + 回填账号）
  const initData = getLoginTypePipe(publicConfig, registerInfo.registerFrom)
  const loginInitData: GuardLoginInitData = {}
  if (initData) {
    loginInitData.specifyDefaultLoginMethod = initData.specifyDefaultLoginMethod
    initData?.lockMethod && (loginInitData._lockMethod = initData.lockMethod)
    loginInitData._firstItemInitialValue = registerInfo.account
  }

  // 3. 跳转回登录页
  changeModule?.(GuardModuleType.LOGIN, loginInitData)
}
```

注册提交后，根据配置可能先跳转到中间模块再回到登录页：

| 条件 | 跳转模块 | 说明 |
|------|----------|------|
| `needPassword` 为 true | `REGISTER_PASSWORD` | 需要补全密码 |
| `enableAccountTypeSelect` 为 true | `REGISTER_ACCOUNT_TYPE_SELECT` | 选择账号类型 |
| `isPhoneChangeComplete/isEmailChangeComplete` 为 true | `REGISTER_COMPLETE_INFO` | 需要补全信息 |
| 以上都不满足 | 直接成功 → 跳转登录页 | 调用 `onRegisterSuccess` |

```
用户提交注册表单
       ↓
 onBeforeRegister 钩子（可阻止）
       ↓
 验证码校验 (preCheckCode)
       ↓
   ┌───┴───┐
   │ 判断  │
   └───┬───┘
       ↓
 ┌─────┼─────────────────┐
 ↓     ↓                 ↓
需要密码?    需要补全信息?    直接注册
 ↓           ↓                 ↓
REGISTER_    REGISTER_      调用 API
PASSWORD     COMPLETE_INFO       ↓
 ↓           ↓              成功 → onRegister → 跳转登录页
 ↓           ↓              失败 → onRegisterError
```

---

## 十一、表单限制机制

### 11.1 格式校验正则（VALIDATE_PATTERN）

```typescript
// _utils/index.ts:31-43
const VALIDATE_PATTERN = {
  email:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  phone: /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,
  ip: /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/,
  host: /^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+.?$/,
  username: /.?/   // 用户名无格式限制
}
```

**注意**：手机号正则可在 Console 后台通过 `publicConfig.regexRules` 自定义覆盖。

### 11.2 密码强度校验（PasswordStrength）

```typescript
// _utils/index.ts:265-272
enum PasswordStrength {
  NoCheck,   // 不校验
  Low,       // 低强度：≥6位
  Middle,    // 中强度：≥6位 + 至少2种字符类型
  High,      // 高强度：≥6位 + 至少3种字符类型
  AUTO,      // 自定义正则
  Custom     // 服务端校验
}
```

| 强度 | 规则 | 校验触发 |
|------|------|----------|
| **NoCheck** | 仅必填 | onBlur |
| **Low** | 必填 + 长度 ≥ 6 | onBlur |
| **Middle** | 必填 + 长度 ≥ 6 + 至少包含2种字符类型（数字/字母/特殊符号） | onBlur |
| **High** | 必填 + 长度 ≥ 6 + 至少包含3种字符类型 | onBlur |
| **AUTO** | 必填 + `customPasswordStrength.regex` 正则匹配 | onBlur |
| **Custom** | 调用 `POST /api/v2/password/user-action/check` 服务端校验 | onBlur |

字符类型判断：

```typescript
// _utils/index.ts:307-318
const SYMBOL_TYPE_PATTERNS = [
  /\d+/,           // 数字
  /[a-zA-Z]/,      // 字母
  /[`~!@#$%^&*()_\-+=<>?:"{}|,.\\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：""【】、；''，。、]/  // 特殊符号
]
```

**Custom 强度的特殊行为**：
- 调用服务端 API 校验，返回 `ruleResults` 数组
- `PasswordFormItem` 组件会将 `ruleResults` 渲染为 `CheckRules` 组件，实时展示每条规则是否通过
- 支持 `initData` 中传入 `passwordStrength` / `customPasswordStrength` 覆盖全局配置（用于改密场景）

### 11.3 字段校验组件体系（ValidatorFormItem）

```typescript
// ValidatorRules/index.ts
CustomFormItem.Password  → PasswordFormItem   // 密码字段
CustomFormItem.Email     → EmailFormItem      // 邮箱字段
CustomFormItem.Phone     → PhoneFormItem      // 手机号字段
CustomFormItem.UserName  → UserNameFormItem   // 用户名字段
CustomFormItem.CustomName → CustomNameFormItem // 自定义字段
```

每个 ValidatorFormItem 支持以下 props：

| Prop | 类型 | 说明 |
|------|------|------|
| `checkRepeat` | `boolean` | 校验是否重复（注册时防重复） |
| `checkExist` | `boolean` | 校验是否存在（登录时验账号） |
| `isCheckPattern` | `boolean` | 是否启用格式正则校验（默认 true） |
| `areaCode` | `string` | 国际化区号（手机号专用） |
| `required` | `boolean` | 是否必填（默认 true） |

**校验执行顺序**：`必填校验 → 格式校验 → 重复/存在性校验`

### 11.4 重复/存在性校验（checkRepeat / checkExist）

```typescript
// ValidatorRules/ValidatorFormItem.tsx + useCheckRepeat.ts
// 调用 API: GET /api/v2/users/find
{
  userPoolId: publicConfig.userPoolId,
  key: value,        // 用户输入值
  type: method       // 'email' | 'phone' | 'username'
}
```

| 场景 | Prop | 已存在时行为 | 不存在时行为 |
|------|------|-------------|-------------|
| 注册（防重复） | `checkRepeat=true` | 拒绝（提示"已注册"） | 通过 |
| 登录（验存在） | `checkExist=true` | 通过 | 拒绝（提示"找不到账号"） |

**防抖机制**：`useCheckRepeat` 内部 500ms 防抖，避免频繁请求。

**特殊行为**：当 `publicConfig.closeCheckSendUser` 为 true 时，不触发 Form 校验错误，改用 `message.error` 全局提示（避免阻止发送验证码流程）。

### 11.5 各场景表单字段限制汇总

#### 登录-密码登录（LoginWithPassword）

| 字段 | 校验规则 | 组件 |
|------|----------|------|
| 账号（account） | 必填 + 根据密码登录方式自动选择校验 | FormItemAccount |
| → phone-password | 必填 + 手机号格式（不限制 pattern） | CustomFormItem.Phone |
| → email-password | 必填 + 邮箱格式 + 可选 checkExist | CustomFormItem.Email |
| → 其他 | 必填 + 用户名格式 | CustomFormItem.UserName |
| → 混合方式 | 必填（通用账号提示） | Form.Item |
| 密码（password） | 必填 + 密码强度校验 | PasswordFormItem |

#### 登录-验证码登录（LoginWithVerifyCode）

| 字段 | 校验规则 | 组件 |
|------|----------|------|
| 账号（identify） | 必填 + 根据验证码方式选择校验 | FormItemIdentify |
| → phone-code | 必填 + 手机号格式 + 可选 checkExist | CustomFormItem.Phone |
| → email-code | 必填 + 邮箱格式 + 可选 checkExist | CustomFormItem.Email |
| → 混合方式 | 必填 + 自动识别手机/邮箱格式 | Form.Item |
| 验证码（code） | 必填 | Form.Item |
| 图形验证码（captchaCode） | 条件必填（开启人机验证时） | Form.Item |

#### 登录-LDAP / AD 登录

| 字段 | 校验规则 |
|------|----------|
| 账号 | 必填 |
| 密码 | 必填（无强度校验） |

#### 注册-验证码注册（RegisterWithCode）

| 字段 | 校验规则 | 组件 |
|------|----------|------|
| 账号（identify） | 必填 + 格式校验 + **checkRepeat=true** | FormItemIdentify |
| → phone-code | 必填 + 手机号格式 + 防重复 | CustomFormItem.Phone |
| → email-code | 必填 + 邮箱格式 + 防重复 | CustomFormItem.Email |
| 验证码（code） | 必填 + 长度 = verifyCodeLength | SendCode |
| 图形验证码（captchaCode） | 条件必填 | GraphicVerifyCode |

#### 注册-邮箱密码注册（RegisterWithEmail）

| 字段 | 校验规则 |
|------|----------|
| 邮箱 | 必填 + 邮箱格式 + **checkRepeat=true** |
| 密码 | 必填 + 密码强度校验 |
| 验证码 | 条件必填（`enabledPPRegisterValid` / `enabledMailPwdRegisterValid` 时） |

#### 信息补全（CompleteInfo）

| 字段类型 | 校验规则 | 说明 |
|----------|----------|------|
| USERNAME | 必填（如 required=true） | 内部字段 |
| PHONE | 必填 + 手机号格式 + 验证码 | 内部字段 |
| EMAIL | 必填 + 邮箱格式 + 验证码 | 内部字段 |
| STRING/TEXT | 按服务端 validateRules | 扩展字段 |
| NUMBER | 按 FormValidateRule.IS_NUMBER 校验 | 扩展字段 |
| DATE/DATETIME | 日期选择器 | 扩展字段 |
| SELECT/DROPDOWN | 选项必选 | 扩展字段 |
| BOOLEAN | 无 | 扩展字段 |
| GENDER | 选项必选 | 扩展字段 |

```typescript
// CompleteInfo/interface.ts:62-68
enum FormValidateRule {
  NONE = 'none',       // 无校验
  EMAIL = 'email',     // 邮箱格式
  PHONE = 'phone',     // 手机号格式
  IS_NUMBER = 'isNumber', // 数字
  REG_EXP = 'regExp'   // 自定义正则（content 字段传正则表达式）
}
```

#### 忘记密码（ForgetPassword）

| 字段 | 校验规则 |
|------|----------|
| 账号（邮箱/手机） | 必填 + 格式校验 + **checkExist=true** |
| 验证码 | 必填 |
| 新密码 | 必填 + 密码强度校验 |
| 确认密码 | 必填 +与新密码一致 |

#### MFA 验证

| 字段 | 校验规则 |
|------|----------|
| TOTP 验证码 | 必填 + 长度 = verifyCodeLength |
| SMS/EMAIL 验证码 | 必填 + 长度 = verifyCodeLength |
| FACE | 人脸识别（无表单校验） |

### 11.6 协议校验（Agreements）

```typescript
// 注册/登录时协议校验
if (agreements?.length && !acceptedAgreements) {
  submitButtonRef.current.onError()  // 按钮显示错误态
  return  // 阻止提交
}
```

- `agreementEnabled`：是否开启协议（Console 后台 + config 覆盖）
- `agreements`：协议列表，过滤当前语言 + 场景（注册/登录/两者）
- `acceptedAgreements`：用户是否勾选
- `acceptedAgreementIds`：已勾选协议 ID 列表，提交时携带

### 11.7 人机验证（Captcha）

```typescript
// _utils/context.tsx
useRobotVerify()       // 当前人机验证策略
useSmsCaptchaCheck()   // 短信是否开启人机验证
useEmailCaptchaCheck() // 邮件是否开启人机验证
```

| 场景 | 配置来源 |
|------|----------|
| 短信-登录 | `loginSmsConfig.robot.switch === 'ON'` |
| 短信-注册 | `registerSmsConfig.robot.switch === 'ON'` |
| 短信-忘记密码 | `forgetPasswordSmsConfig.robot.switch === 'ON'` |
| 邮件-登录 | `loginEmailConfig.robot.switch === 'ON'` |
| 邮件-注册 | `registerEmailConfig.robot.switch === 'ON'` |
| 邮件-忘记密码 | `forgetPasswordEmailConfig.robot.switch === 'ON'` |

开启后，表单会多一个 `captchaCode` 字段（图形验证码），必须先通过图形验证才能发送短信/邮件验证码。

### 11.8 国际化手机号校验

```typescript
// 开启国际化短信时，手机号校验逻辑变化
if (checkInternationalSms) {
  // 不用正则，改用 phone 库校验
  validator: async (_, value) => {
    if (!value || phone(value, { country: areaCode }).isValid)
      return Promise.resolve()
    return Promise.reject(t('common.internationPhoneMessage'))
  }
}
```

- 开启国际化短信：`publicConfig.internationalSmsConfig.enabled`
- 默认区号：`publicConfig.internationalSmsConfig.defaultISOType`（默认 'CN'）
- 非国际化短信时但仅手机号密码登录：`isCheckPattern=false`，pattern 降级为 `/^[0-9]*$/`

---

## 十二、扩展点

### 12.1 自定义错误码处理

```typescript
// 扩展 codeMap
const customCodeMap = {
  ...codeMap,
  [YOUR_CUSTOM_CODE]: {
    action: 'changeModule',
    module: 'yourCustomModule'
  }
}
```

### 12.2 自定义模块

```typescript
// 1. 添加模块类型
GuardModuleType.CUSTOM = 'custom'

// 2. 添加组件映射
ComponentsMapping[GuardModuleType.CUSTOM] = CustomView

// 3. 添加错误码映射
codeMap[1234] = { action: 'changeModule', module: GuardModuleType.CUSTOM }
```

---

## 十三、最佳实践

1. **单一职责**：每个模块只负责一个功能
2. **数据驱动**：通过 initData 传递数据，避免跨模块状态共享
3. **错误隔离**：每个模块处理自己的错误，通过 codeMap 统一分发
4. **流程可追溯**：状态机记录历史，支持回退和调试
5. **事件解耦**：通过事件系统通知外部，不直接调用外部方法

---

## 十四、关键文件索引

| 功能 | 文件路径 |
|------|----------|
| 模块枚举 | `packages/guard-core-v4/src/Guard/module.ts` |
| 状态机 | `packages/guard-core-v4/src/Guard/GuardModule/stateMachine.ts` |
| HTTP封装 | `packages/guard-core-v4/src/_utils/guardHttp.ts` |
| 响应拦截 | `packages/guard-core-v4/src/_utils/responseManagement/index.ts` |
| 错误码定义 | `packages/guard-core-v4/src/_utils/GuardErrorCode.ts` |
| 登录映射 | `packages/guard-core-v4/src/Login/codemap.ts` |
| MFA映射 | `packages/guard-core-v4/src/MFA/codemap.ts` |
| 注册映射 | `packages/guard-core-v4/src/Register/codemap.ts` |
| 事件系统 | `packages/guard-core-v4/src/Guard/event.ts` |
| 上下文 | `packages/guard-core-v4/src/_utils/context.tsx` |
| 模块渲染 | `packages/guard-core-v4/src/Guard/core/renderModule.tsx` |
| 注册页入口 | `packages/guard-core-v4/src/Register/index.tsx` |
| 注册-验证码方式 | `packages/guard-core-v4/src/Register/core/WithCode.tsx` |
| 注册-邮箱密码方式 | `packages/guard-core-v4/src/Register/core/WithEmail.tsx` |
| 配置合并 | `packages/guard-core-v4/src/_utils/config/index.ts` |
| 验证规则入口 | `packages/guard-core-v4/src/ValidatorRules/index.ts` |
| 字段校验组件 | `packages/guard-core-v4/src/ValidatorRules/ValidatorFormItem.tsx` |
| 密码校验组件 | `packages/guard-core-v4/src/ValidatorRules/PasswordFormItem.tsx` |
| 密码规则展示 | `packages/guard-core-v4/src/ValidatorRules/CheckRules.tsx` |
| 重复校验 Hook | `packages/guard-core-v4/src/ValidatorRules/useCheckRepeat.ts` |
| 信息补全校验 | `packages/guard-core-v4/src/CompleteInfo/utils.tsx` |
| 信息补全接口 | `packages/guard-core-v4/src/CompleteInfo/interface.ts` |
| 表单工具函数 | `packages/guard-core-v4/src/_utils/index.ts` |
