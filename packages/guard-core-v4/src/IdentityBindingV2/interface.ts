import { IG2Config, IG2Events, IG2FCProps, IG2FCViewProps } from '../Type'

import { AuthenticationClient, User } from 'authing-js-sdk'

import { GuardModuleType } from '../Guard'

import { Agreement } from '../Type/application'
// ============================================================================
// 基础类型定义
// ============================================================================

/**
 * 认证结果类型
 */
export type AuthResult = 1 | 2 | 3

/**
 * 认证类型
 */
export type AuthType = 'phone' | 'email' | 'username'

/**
 * 认证方法
 */
export type AuthMethod = 'code' | 'password'

/**
 * 流程类型
 */
export type FlowType = 'create' | 'bind'

/**
 * 绑定方法的完整类型定义
 */
export type BindMethod =
  | `${Extract<AuthType, 'email' | 'username' | 'phone'>}-password`
  | `${Extract<AuthType, 'phone' | 'email'>}-code`

/**
 * 绑定方法数组类型，确保只能包含有效的绑定方法
 */
export type BindMethods = ReadonlyArray<BindMethod>

// ============================================================================
// 错误处理相关类型
// ============================================================================

/**
 * 统一错误消息类型
 */
export interface ErrorMessage {
  code: string
  message: string
}

/**
 * 错误处理器类型
 */
export type ErrorHandler = (error: ErrorMessage | Error | any) => void

// ============================================================================
// 核心配置接口
// ============================================================================

/**
 * 身份绑定配置
 * 继承基础配置并添加特定选项
 */
export interface IdentityBindingConfig extends IG2Config {
  /** 是否自动注册 */
  readonly autoRegister?: boolean
  /** 公钥 */
  readonly publicKey?: string
  /** 是否启用协议 */
  readonly agreementEnabled?: boolean
  /** 协议列表 */
  readonly agreements?: ReadonlyArray<Agreement>
}

/**
 * 身份绑定事件处理器
 * 使用更严格的错误类型
 */
export interface IdentityBindingEvents extends IG2Events {
  /** 绑定成功回调 */
  onBinding?: (
    user: User,
    authClient: AuthenticationClient
  ) => void | Promise<void>
  /** 绑定失败回调 */
  onBindingError?: ErrorHandler
  /** 登录成功回调 */
  onLogin?: (
    user: User,
    authClient: AuthenticationClient
  ) => void | Promise<void>
  /** 登录失败回调 */
  onLoginError?: ErrorHandler
}

// ============================================================================
// 组件属性接口
// ============================================================================

/**
 * Guard身份绑定组件属性
 */
export interface GuardIdentityBindingProps
  extends IG2FCProps,
    IdentityBindingEvents {
  /** 配置选项，使用Partial允许部分配置 */
  config?: Partial<IdentityBindingConfig>
}

/**
 * Guard身份绑定初始化数据
 */
export interface GuardIdentityBindingInitData {
  /** 支持的绑定方法 */
  readonly methods: BindMethods
  /** 来源模块类型 */
  readonly source?: GuardModuleType
  /** 流程类型 */
  readonly flowType?: FlowType
}

/**
 * Guard身份绑定视图组件属性
 * 继承基础属性并要求完整配置
 */
export interface GuardIdentityBindingViewProps
  extends GuardIdentityBindingProps,
    IG2FCViewProps {
  /** 完整配置，不再是可选 */
  config: IdentityBindingConfig
  /** 初始化数据 */
  initData: GuardIdentityBindingInitData
}

// ============================================================================
// 认证配置相关类型
// ============================================================================

/**
 * 认证配置接口
 */
export interface AuthConfig {
  /** 认证类型 */
  readonly type: AuthType
  /** 支持的认证方法 */
  readonly methods: ReadonlyArray<AuthMethod>
}

/**
 * 账户验证初始化数据
 * 修复了原接口名称的拼写错误
 */
export interface GuardIdentityAccountVerificationInitData extends AuthConfig {
  /** 账户信息 */
  readonly account: string
  /** 来源模块类型 */
  readonly source?: GuardModuleType
  /** 手机国家代码 */
  readonly phoneCountryCode?: string
  /** 流程类型 */
  readonly flowType?: FlowType
}

// ============================================================================
// 认证方法映射配置
// ============================================================================

/**
 * 认证方法映射类型
 * 使用更严格的类型约束
 */
type AuthMethodMap = {
  readonly [K in BindMethod]: AuthMethod
}

/**
 * 认证配置映射类型
 * 确保每个AuthResult都有对应的配置
 */
type AuthConfigMap = {
  readonly [K in AuthResult]: {
    readonly type: AuthType
    readonly methodMap: Partial<AuthMethodMap>
  }
}

/**
 * 认证配置常量
 * 使用更严格的类型定义和const断言
 */
export const AUTH_CONFIG: AuthConfigMap = {
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
} as const

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 优化的认证方法转换函数
 * 添加了更严格的类型约束和错误处理
 *
 * @param authResult - 认证结果类型
 * @param bindMethods - 绑定方法数组
 * @returns 认证配置对象
 * @throws {Error} 当认证结果无效时抛出错误
 */
export function optimizeAuthMethodsTypeSafe(
  authResult: AuthResult,
  bindMethods: BindMethods
): AuthConfig {
  const config = AUTH_CONFIG[authResult]

  if (!config) {
    throw new Error(`Invalid auth result: ${authResult}`)
  }

  const methods = bindMethods
    .filter(
      (method): method is keyof typeof config.methodMap =>
        method in config.methodMap
    )
    .map(method => config.methodMap[method])
    .filter((method): method is AuthMethod => method !== undefined)

  return {
    type: config.type,
    methods
  }
}

/**
 * @deprecated 使用 GuardIdentityAccountVerificationInitData 替代
 * 保留用于向后兼容
 */
export type GuardIdentityAccountVerifcationInitData =
  GuardIdentityAccountVerificationInitData

export interface GuardIdentityBindingResultInitData {
  readonly actions: Array<{
    title: string
    callback: () => void
  }>
  readonly title?: string
  readonly desc?: string
}
