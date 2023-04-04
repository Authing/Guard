import { GuardProps } from '../Guard'

import { React, ReactNode } from 'shim-react'

import { useInitGuardAuthClient } from '../authClient'

import { GuardEvents, guardEventsFilter } from '../event'

import { insertStyles, regexFromString, removeStyles } from '../../_utils'

import { getDefaultGuardLocalConfig } from '../config'

import { GuardModuleType } from '../module'

import { GuardStateMachine, initGuardStateMachine, ModuleState } from '../GuardModule/stateMachine'

import { SessionData, trackSession } from '../sso'

import { getPublicConfig, useMergeDefaultConfig, useFetchConsoleConfig } from '../../_utils/config'

import { GuardHttp, initGuardHttp } from '../../_utils/guardHttp'

import { initGuardI18n } from '../../_utils/locales'

import { useGuardXContext } from '../../_utils/context'

import { useGuardIconfont } from '../../IconFont/useGuardIconfont'

import { useInitGuardAppendConfig } from './useAppendConfig'

import { useInitAppId } from '../../_utils/initAppId'

import { updateFlowHandle } from '../../_utils/flowHandleStorage'

import { ApplicationConfig } from '../../Type/application'

import { AuthenticationClient } from 'authing-js-sdk'

import { Lang } from '../../Type'

import { i18n } from '../../_utils/locales'

// hooks
import useMultipleAccounts from './hooks/useMultipleAccounts'

import { useMultipleTenant } from '../../_utils/tenant'

import Axios from 'axios'

interface IBaseAction<T = string, P = any> {
  type: T & string
  payload?: Partial<P>
}

const { useCallback, useEffect, useMemo, useReducer, useState } = React

export const RenderContext: React.FC<{
  guardProps: GuardProps
  initState: ModuleState
  children: ReactNode
}> = ({ guardProps, initState, children }) => {
  const { tenantId, config } = guardProps
  // 强制刷新
  const [forceUpdate, setForceUpdate] = useState(Date.now())

  const [events, setEvents] = useState<GuardEvents>()
  const [authClint, setAuthClint] = useState<AuthenticationClient>()
  const [httpClient, setHttpClient] = useState<GuardHttp>()
  const [publicConfig, setPublicConfig] = useState<ApplicationConfig>()
  const [cdnBase, setCdnBase] = useState<string>()
  const [error, setError] = useState()
  const [isAuthFlow, setIsAuthFlow] = useState(true)
  const [i18nInit, setI18nInit] = useState(false)
  const appId = useInitAppId(guardProps.appId, guardProps.authClient, setError)

  const [defaultLanguageConfig, setDefaultLanguageConfig] = useState<Lang>()

  const [isForeignUserpool, setIsForeignUserpool] = useState(false)

  useInitGuardAppendConfig(setForceUpdate, appId, guardProps.appendConfig)

  // 状态机
  const [guardStateMachine, setGuardStateMachine] = useState<GuardStateMachine>()

  const { Provider } = useGuardXContext()

  // modules 定义
  const moduleReducer: (
    state: ModuleState,
    action: IBaseAction<GuardModuleType, ModuleState>
  ) => ModuleState = (state, { type, payload }) => {
    return {
      moduleName: type,
      initData: payload?.initData
    }
  }

  // Modules Reducer
  const [moduleState, changeModule] = useReducer(moduleReducer, initState)

  // Flow Handle init
  useEffect(() => {
    if (initState.initData?.flowHandle) {
      updateFlowHandle(initState.initData.flowHandle)
    }
  }, [initState.initData])

  // Change Module
  const onChangeModule = useCallback(
    async (moduleName: GuardModuleType, initData: any = {}) => {
      if (
        !events?.onBeforeChangeModule ||
        (await events.onBeforeChangeModule(moduleName, initData))
      ) {
        changeModule({
          type: moduleName,
          payload: {
            initData: initData ?? {}
          }
        })
      }
    },
    [events]
  )

  // 合并默认值
  const defaultMergedConfig = useMergeDefaultConfig(getDefaultGuardLocalConfig(), config)

  // HttpClient
  useEffect(() => {
    if (!appId || !defaultMergedConfig) return

    const httpClient = initGuardHttp(defaultMergedConfig.host)
    httpClient.setAppId(appId)
    tenantId && httpClient.setTenantId(tenantId)

    setHttpClient(httpClient)
  }, [appId, defaultMergedConfig, tenantId])

  /**
   *
   */
  const { finallyConfig, guardPageConfig } = useFetchConsoleConfig(
    forceUpdate,
    appId,
    defaultMergedConfig,
    httpClient,
    setError
  )

  const multipleInstance = useMultipleAccounts({
    appId,
    finallyConfig
  })

  const tenantInstance = useMultipleTenant(tenantId!, publicConfig!)
  // // guardPageConfig
  // const guardPageConfig = useGuardPageConfig(
  //   forceUpdate,
  //   error,
  //   appId,
  //   httpClient,
  //   setError
  // )

  const sdkClient = useInitGuardAuthClient({
    config: finallyConfig,
    appId,
    tenantId,
    setError,
    authClient: guardProps.authClient
  })

  // iconfont
  const iconfontLoaded = useGuardIconfont(cdnBase)

  // SSO 登录
  useEffect(() => {
    if (!config?.isSSO || !authClint || !events || !httpClient) return

    trackSession().then(sessionData => {
      // 这个接口没有 code, data, 直接返回了数据
      const typedData = sessionData as unknown as SessionData
      if (typedData.userInfo) {
        events?.onLogin?.(typedData.userInfo, authClint!)
      }
    })
  }, [appId, authClint, config?.isSSO, events, httpClient])

  useEffect(() => {
    if (httpClient && finallyConfig) {
      httpClient?.setBaseUrl(finallyConfig.host)
    }
  }, [finallyConfig, httpClient])

  useEffect(() => {
    if (!appId) return

    const publicConfig = getPublicConfig(appId)

    if (!publicConfig) return

    setPublicConfig(publicConfig)

    setCdnBase(publicConfig.cdnBase)
  }, [appId, finallyConfig])

  // I18n
  useEffect(() => {
    if (guardPageConfig && publicConfig && defaultMergedConfig) {
      const { defaultLanguage } = guardPageConfig.global
      initGuardI18n(
        {
          defaultLanguage: (defaultMergedConfig?.lang as Lang) ?? defaultLanguage
        },
        setI18nInit
      )

      setDefaultLanguageConfig(i18n.language as Lang)
    }
  }, [defaultMergedConfig, guardPageConfig, publicConfig, setI18nInit])

  // AuthClient
  useEffect(() => {
    setAuthClint(sdkClient)
  }, [sdkClient])

  // initEvents
  useEffect(() => {
    if (!defaultMergedConfig) return

    const events = guardEventsFilter(
      {
        ...guardProps
      },
      multipleInstance.instance,
      defaultMergedConfig?.openEventsMapping
    )
    setEvents(events)
  }, [guardProps, multipleInstance, defaultMergedConfig])

  // 状态机相关
  useEffect(() => {
    const guardStateMachine = initGuardStateMachine(onChangeModule, initState)
    setGuardStateMachine(guardStateMachine)

    return () => {
      guardStateMachine.uninstallPopstate()
    }
  }, [initState, onChangeModule])

  // 自定义 CSS 处理
  useEffect(() => {
    if (finallyConfig && finallyConfig.contentCss)
      insertStyles(finallyConfig.contentCss, 'appConfig')

    return () => removeStyles('appConfig')
  }, [finallyConfig])

  // 是否使用 Guard auth flow
  useEffect(() => {
    if (!finallyConfig) return

    setIsAuthFlow(!Boolean(finallyConfig?.__unAuthFlow__))
  }, [finallyConfig])

  // 是否是国外用户池
  useEffect(() => {
    const baseUrl = finallyConfig?.host

    if (appId && baseUrl) {
      try {
        Axios.get<
          any,
          {
            data: {
              code: number
              data: boolean
              message: string
            }
          }
        >(`${baseUrl}/api/v2/application/${appId}/check-app-is-show-code`)
          .then(res => {
            const { code, data } = res?.data || {}
            if (code === 200) {
              setIsForeignUserpool(data)
            }
          })
          .catch(error => {
            console.log('error', error)
          })
      } catch (error) {
        console.log('error', error)
      }
    }
  }, [appId, finallyConfig?.host])

  const moduleEvents = useMemo(() => {
    if (!events && !guardStateMachine) return undefined
    return {
      changeModule: async (moduleName: GuardModuleType, initData?: any) => {
        guardStateMachine?.next(moduleName, initData)
      },
      backModule: () => {
        guardStateMachine?.back()
      }
    }
  }, [events, guardStateMachine])

  const contextLoaded = useMemo(() => {
    const list = [
      appId,
      events,
      defaultMergedConfig,
      finallyConfig,
      httpClient,
      moduleEvents,
      publicConfig,
      authClint,
      guardPageConfig,
      iconfontLoaded,
      // 保证 store 加载完成
      multipleInstance,
      // 保证 i18n 初始化完成
      i18nInit,
      defaultLanguageConfig,
      tenantInstance
    ]

    return !list.includes(undefined) && !list.includes(false)
  }, [
    appId,
    events,
    defaultMergedConfig,
    finallyConfig,
    httpClient,
    moduleEvents,
    publicConfig,
    authClint,
    guardPageConfig,
    iconfontLoaded,
    multipleInstance,
    i18nInit,
    defaultLanguageConfig,
    tenantInstance
  ])

  const phoneRegex = useMemo(() => {
    const str = publicConfig?.regexRules?.find(item => item.key === 'phone')?.userpoolLevel ?? ''
    if (str) {
      try {
        const regex = regexFromString(str)
        return regex
      } catch (error) {}
    }
    return null
  }, [publicConfig?.regexRules])

  // TODO 触发 onLoad 事件
  useEffect(() => {
    if (!contextLoaded || error) return

    events?.onLoad?.(authClint!)
  }, [authClint, contextLoaded, error, events])

  const contextValues = useMemo(() => {
    if (contextLoaded) {
      return {
        contextLoaded,
        isAuthFlow,
        defaultMergedConfig,
        finallyConfig,
        publicConfig,
        httpClient,
        appId,
        tenantId,
        events,
        ...moduleEvents,
        initData: moduleState.initData,
        currentModule: moduleState,
        guardPageConfig,
        // 多账号相关信息 store 实例
        multipleInstance,
        phoneRegex,
        defaultLanguageConfig,
        tenantInstance,
        isForeignUserpool
      }
    }

    return {
      defaultMergedConfig
    }
  }, [
    appId,
    contextLoaded,
    defaultMergedConfig,
    events,
    finallyConfig,
    guardPageConfig,
    httpClient,
    isAuthFlow,
    moduleEvents,
    moduleState,
    publicConfig,
    tenantId,
    multipleInstance,
    phoneRegex,
    defaultLanguageConfig,
    tenantInstance,
    isForeignUserpool
  ])

  const renderContext = useMemo(() => {
    if (!contextValues) return null
    return <Provider value={contextValues}>{children}</Provider>
  }, [Provider, children, contextValues])

  const RenderErrorContext = useCallback(() => {
    events?.onLoadError?.(error)
    return (
      <Provider
        value={{
          contextLoaded: true,
          defaultMergedConfig,
          initData: {
            error: error
          },
          currentModule: {
            moduleName: GuardModuleType.ERROR,
            initData: {
              error
            }
          }
        }}
      >
        {children}
      </Provider>
    )
  }, [Provider, children, defaultMergedConfig, error, events])

  const render = useMemo(() => {
    if (error) return <RenderErrorContext />

    if (contextLoaded || Boolean(defaultMergedConfig)) return renderContext

    return null
  }, [contextLoaded, defaultMergedConfig, error, renderContext, RenderErrorContext])

  return render
}
