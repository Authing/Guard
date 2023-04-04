import { React, ReactNode } from 'shim-react'

import { GuardPageConfig, Lang } from '../Type'

import {  GuardModuleType } from '../Guard/module'

import { GuardEvents, GuardLocalConfig } from '../Guard'

import { BackFillMultipleState, StoreInstance } from '../Guard/core/hooks/useMultipleAccounts'

import { ModuleState } from '../Guard/GuardModule/stateMachine'

import { ApplicationConfig } from '../Type/application'

import { GuardHttp } from './guardHttp'

import { MultipleTenant } from './tenant'

const { useContext, useMemo } = React

export interface IGuardContext {
  finallyConfig: GuardLocalConfig

  defaultMergedConfig: GuardLocalConfig

  publicConfig: ApplicationConfig

  httpClient: GuardHttp

  appId: string

  tenantId?: string

  initData: any

  currentModule: ModuleState

  events: Partial<GuardEvents>

  changeModule?: (moduleName: GuardModuleType, initData?: any) => Promise<void>

  backModule?: () => void

  isAuthFlow: boolean

  contextLoaded: boolean

  guardPageConfig: Partial<GuardPageConfig>

  multipleInstance: {
    /**
     * 多账号相关
     */
    isMultipleAccount: boolean
    /**
     * when： 多账号页面跳转进入登录页面
     * 携带的回填数据信息
     */
    multipleAccountData?: BackFillMultipleState
    /**
     * 多账号 store 实例
     */
    instance?: StoreInstance
    /**
     * 切换多账号 isMultipleAccount 状态
     */
    referMultipleState?: (type: 'login' | 'multiple') => void
    /**
     * 清空回填数据
     */
    clearBackFillData?: () => void
  }

  phoneRegex: RegExp | null
  defaultLanguageConfig: Lang
  /** 租户信息获取和操作处理相关 */
  tenantInstance?: MultipleTenant

  /** 判断是否是国外的用户池 */
  isForeignUserpool: boolean
}

const DefaultGuardX: IGuardContext = {
  finallyConfig: {} as GuardLocalConfig,

  defaultMergedConfig: {} as GuardLocalConfig,

  publicConfig: {} as ApplicationConfig,

  httpClient: {} as GuardHttp,

  appId: '',

  initData: {},

  currentModule: {} as ModuleState,

  events: {} as Partial<GuardEvents>,

  isAuthFlow: false,

  contextLoaded: false,

  guardPageConfig: {} as Partial<GuardPageConfig>,

  /**
   * 多账号 状态
   */
  multipleInstance: {
    isMultipleAccount: false,

    instance: undefined,

    referMultipleState: undefined,

    multipleAccountData: undefined,

    clearBackFillData: undefined
  },

  phoneRegex: null,
  defaultLanguageConfig: 'zh-CN',

  tenantInstance: undefined,

  isForeignUserpool: false
}

const GuardXContext = React.createContext<IGuardContext>(DefaultGuardX)

export const createGuardXContext = () => {
  const Provider = GuardXContext.Provider
  const Consumer = GuardXContext.Consumer

  const guardXProvider: React.FC<{
    value: Partial<IGuardContext>
    children: ReactNode
  }> = ({ value, children }) => {
    return (
      <Provider
        value={{
          ...DefaultGuardX,
          ...value
        }}
      >
        {children}
      </Provider>
    )
  }

  return {
    Provider: guardXProvider,
    Consumer
  }
}

export const useGuardXContext = () => {
  return useMemo(() => {
    const Provider = GuardXContext.Provider
    const Consumer = GuardXContext.Consumer

    const guardXProvider: React.FC<{
      value: Partial<IGuardContext>
      children: ReactNode
    }> = ({ value, children }) => {
      return (
        <Provider
          value={{
            ...DefaultGuardX,
            ...value
          }}
        >
          {children}
        </Provider>
      )
    }

    return {
      Provider: guardXProvider,
      Consumer
    }
  }, [])
}

export interface IGuardContextProvider {
  spin: boolean
  spinChange: (spin: boolean) => void
}

const GuardButtonContext = React.createContext<IGuardContextProvider>({
  spin: false,
  spinChange: () => {}
})

export const useGuardButtonContext = () => {
  const Provider = GuardButtonContext.Provider

  const GuardButtonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [spin, setSpin] = React.useState(false)

    return (
      <Provider
        value={{
          spin: spin,
          spinChange: (spin: boolean) => {
            setSpin(spin)
          }
        }}
      >
        {children}
      </Provider>
    )
  }

  return {
    GuardButtonProvider
  }
}

export const useGuardButtonState = () => useContext(GuardButtonContext)

export const useGuardPublicConfig = () => useContext(GuardXContext).publicConfig

export const useGuardHttpClient = () => useContext(GuardXContext).httpClient

export const useGuardDefaultMergedConfig = () => useContext(GuardXContext).defaultMergedConfig

export const useGuardAppId = () => useContext(GuardXContext).appId

export const useGuardTenantId = () => useContext(GuardXContext).tenantId

export function useGuardInitData<T>(): T {
  const { initData } = useContext(GuardXContext)
  return initData as T
}

export const useGuardCurrentModule = () => useContext(GuardXContext).currentModule

export const useGuardEvents = () => useContext(GuardXContext).events

export const useGuardModule = () => {
  const guardX = useContext(GuardXContext)

  return {
    changeModule: guardX.changeModule,
    backModule: guardX.backModule,
    currentModule: guardX.currentModule
  }
}

export const useGuardFinallyConfig = () => useContext(GuardXContext).finallyConfig

export const useGuardContextLoaded = () => useContext(GuardXContext).contextLoaded

export const useGuardIsAuthFlow = () => useContext(GuardXContext).isAuthFlow

export const useGuardPageConfig = () => useContext(GuardXContext).guardPageConfig

/**
 * 多账号登录 store 实例
 */
export const useGuardMultipleInstance = () => useContext(GuardXContext).multipleInstance

// 手机号正则
export const useGuardPhoneRegex = () => useContext(GuardXContext).phoneRegex
/**
 * 默认语言
 */
export const useGuardDefaultLanguage = () => useContext(GuardXContext).defaultLanguageConfig

/** 用来操作和获取租户相关的内容 */
export const useGuardTenantProvider = () => useContext(GuardXContext).tenantInstance

/** 当前人机验证策略 */
export const useRobotVerify = () => {
  const { customSecurityEnabled, appRobotVerify, userpoolRobotVerify } = useGuardPublicConfig()

  return customSecurityEnabled ? appRobotVerify : userpoolRobotVerify
}

/** 当前用户池是否是国外用户池 */
export const useIsForeignUserpool = () => useContext(GuardXContext).isForeignUserpool
