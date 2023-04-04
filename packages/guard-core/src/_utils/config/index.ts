import { React } from 'shim-react'

import { assembledRequestHost as utilAssembledRequestHost, transformSortMethod } from '../compute'

import { GuardLocalConfig } from '../../Guard/config'

import { AuthingResponse } from '../http'

import { GuardHttp } from '../guardHttp'

import { corsVerification } from '../corsVerification'

import { Logger } from '../logger'

import { GuardPageConfig } from '../../Type'

import { ApplicationConfig, LoginMethods, RegisterMethods } from '../../Type/application'

const { useCallback, useEffect, useMemo, useState } = React

const publicConfigMap: Record<string, ApplicationConfig> = {}

export const getPublicConfig = (appId: string) => publicConfigMap?.[appId]

export const setPublicConfig = (appId: string, config: ApplicationConfig) => {
  return (publicConfigMap[appId] = config)
}

const pageConfigMap: Record<string, GuardPageConfig> = {}

export const getPageConfig = (appId: string) => pageConfigMap?.[appId]

export const setPageConfig = (appId: string, config: GuardPageConfig) =>
  (pageConfigMap[appId] = config)

const requestPublicConfig = async (
  appId: string,
  httpClient: GuardHttp
): Promise<ApplicationConfig> => {
  let res: AuthingResponse<ApplicationConfig>

  const { get } = httpClient

  try {
    res = await get<ApplicationConfig>(`/api/v2/applications/${appId}/public-config`)
  } catch (error) {
    Logger.error('Please check your config or network')
    throw new Error('Please check your config or network')
  }

  if (res.code !== 200 || !res.data) {
    Logger.error(res?.message ?? 'Please check your config')
    throw new Error(res?.message ?? 'Please check your config')
  }

  corsVerification(res.data.allowedOrigins, res.data.corsWhitelist)

  setPublicConfig(appId, res.data)

  httpClient.setUserpoolId(res.data.userPoolId)

  return getPublicConfig(appId)
}

const requestGuardPageConfig = async (
  appId: string,
  httpClient: GuardHttp
): Promise<GuardPageConfig> => {
  let res: AuthingResponse<GuardPageConfig>

  const { get } = httpClient

  try {
    res = await get<GuardPageConfig>(`/api/v2/applications/${appId}/components-public-config/guard`)
  } catch (error) {
    Logger.error('Please check your config or network')
    throw new Error('Please check your config or network')
  }

  if (res.code !== 200 || !res.data) {
    Logger.error(res?.message ?? 'Please check your config')
    throw new Error(res?.message ?? 'Please check your config')
  }

  setPageConfig(appId, res.data)

  return getPageConfig(appId)
}

export const useMergeDefaultConfig = (
  defaultConfig: GuardLocalConfig,
  config?: Partial<GuardLocalConfig>
): GuardLocalConfig | undefined => {
  const [mergedConfig, setMergedConfig] = useState<GuardLocalConfig>()

  useEffect(() => {
    setMergedConfig({
      ...defaultConfig,
      ...config
    })
  }, [defaultConfig, config])

  return mergedConfig
}

const mergedPublicConfig = (
  config: GuardLocalConfig,
  publicConfig: ApplicationConfig
): GuardLocalConfig => {
  const autoRegister =
    config.autoRegister ?? publicConfig.ssoPageComponentDisplay.autoRegisterThenLoginHintInfo

  const registerMethods = publicConfig.passwordTabConfig.validRegisterMethods?.concat(
    publicConfig.verifyCodeTabConfig?.validRegisterMethods?.map(item =>
      transformSortMethod(item)
    ) || []
  )

  const mergedPublicConfig: GuardLocalConfig = {
    ...config,
    title: config.title ?? publicConfig.name,
    logo: !!config.logo ? config.logo : publicConfig.logo,
    loginMethods: config?.loginMethods ?? (publicConfig.loginTabs?.list as LoginMethods[]) ?? [],
    passwordLoginMethods:
      config?.passwordLoginMethods ?? publicConfig.passwordTabConfig.validLoginMethods ?? [],
    // 默认登录方式
    defaultLoginMethod:
      config.defaultLoginMethod ?? (publicConfig.loginTabs.default as LoginMethods),
    // 禁止重制密码
    disableResetPwd: !!(
      config.disableResetPwd ?? !publicConfig.ssoPageComponentDisplay?.forgetPasswordBtn
    ),
    // 是否自动注册
    autoRegister,
    registerMethods:
      config.registerMethods ??
      (autoRegister ? registerMethods : (publicConfig.registerTabs?.list as RegisterMethods[])),
    defaultRegisterMethod:
      config.defaultRegisterMethod ?? (publicConfig.registerTabs.default as RegisterMethods),
    // 禁止注册
    disableRegister: !!(
      config.disableRegister ?? !publicConfig.ssoPageComponentDisplay.registerBtn
    ),
    // publicKey
    publicKey: config.publicKey ?? publicConfig.publicKey,
    // 注册协议
    agreementEnabled: config.agreementEnabled ?? publicConfig.agreementEnabled,
    agreements: config.agreements ?? publicConfig.agreements,
    contentCss: config.contentCss ?? publicConfig.css
  }

  return mergedPublicConfig
}

// host 拼接
const assembledRequestHost = (config: GuardLocalConfig, publicConfig: ApplicationConfig) => {
  const host = config?.__internalRequest__
    ? config?.host
    : utilAssembledRequestHost(publicConfig.requestHostname, config?.host as string)

  return host
}

/**
 * 请求服务console关于guard的配置
 * @param forceUpdate
 * @param appId
 * @param config
 * @param httpClient
 * @param setError
 */
export const useFetchConsoleConfig = (
  forceUpdate: number,
  appId?: string,
  config?: GuardLocalConfig,
  httpClient?: GuardHttp,
  setError?: any
) => {
  const [publicConfig, setPublicConfig] = useState<ApplicationConfig>()
  const [pageConfig, setPageConfig] = useState<GuardPageConfig>()
  const initPublicConfig = useCallback(async () => {
    if (httpClient && appId) {
      if (!getPublicConfig(appId)) {
        try {
          await Promise.all([
            await requestPublicConfig(appId, httpClient),
            await requestGuardPageConfig(appId, httpClient)
          ])
        } catch (error) {
          setError(error)
        }
      }
      setPublicConfig(getPublicConfig(appId))
      setPageConfig(getPageConfig(appId))
    }
  }, [appId, httpClient, setError])

  useEffect(() => {
    initPublicConfig()
  }, [initPublicConfig, forceUpdate])

  return useMemo(() => {
    if (publicConfig && config && pageConfig) {
      return {
        finallyConfig: {
          ...mergedPublicConfig(config, publicConfig),
          host: assembledRequestHost(config, publicConfig)
        },
        guardPageConfig: pageConfig
      }
    } else {
      return {
        finallyConfig: undefined,
        guardPageConfig: undefined
      }
    }
  }, [config, pageConfig, publicConfig])
}
