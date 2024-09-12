import { React } from 'shim-react'

import { transformSortMethod } from '../compute'

import { GuardLocalConfig } from '../../Guard/config'

import { AuthingResponse } from '../http'

import { GuardHttp } from '../guardHttp'

import { corsVerification } from '../corsVerification'

import { Logger } from '../logger'

import { GuardPageConfig } from '../../Type'

import {
  ApplicationConfig,
  LoginMethods,
  RegisterMethods
} from '../../Type/application'

import { getPhoneInLoginPageContext } from '..'

import Axios from 'axios'

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

let macAddress = ''
export const setMacAddress = (address: string) => {
  macAddress = address
}
export const getMacAddressHeader = () => {
  return window.btoa(encodeURIComponent(macAddress))
}

const requestPublicConfig = async (
  appId: string,
  httpClient: GuardHttp
): Promise<ApplicationConfig> => {
  let res: AuthingResponse<ApplicationConfig>

  const { get } = httpClient

  try {
    res = await get<ApplicationConfig>(
      `/api/v2/applications/${appId}/public-config`
    )
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
    res = await get<GuardPageConfig>(
      `/api/v2/applications/${appId}/components-public-config/guard`
    )
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

const requestMacAddress = async (httpClient: GuardHttp) => {
  const address = await new Promise<string>(async resolve => {
    try {
      // 一秒钟还没获取完成，算超时
      setTimeout(() => {
        resolve('无法获取 mac 地址 - 获取超时')
      }, 1000)

      const res = await Axios.create().get<{
        machine_code: string
      }>('http://127.0.0.1:49999/getclientinfo')

      resolve(res.data.machine_code)
    } catch (e: any) {
      resolve(`无法获取 mac 地址-${e.message}`)
    }
  })

  setMacAddress(address)
  httpClient.setMacAddress(address)
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
    config.autoRegister ??
    publicConfig.ssoPageComponentDisplay.autoRegisterThenLoginHintInfo

  const registerMethods =
    publicConfig.passwordTabConfig.validRegisterMethods?.concat(
      publicConfig.verifyCodeTabConfig?.validRegisterMethods?.map(item =>
        transformSortMethod(item)
      ) || []
    )

  const phone = getPhoneInLoginPageContext()
  const defaultLoginMethod = phone && LoginMethods.PhoneCode

  const mergedPublicConfig: GuardLocalConfig = {
    ...config,
    title: config.title ?? publicConfig.name,
    logo: !!config.logo ? config.logo : publicConfig.logo,
    loginMethods:
      config?.loginMethods ??
      (publicConfig.loginTabs?.list as LoginMethods[]) ??
      [],
    passwordLoginMethods:
      config?.passwordLoginMethods ??
      publicConfig.passwordTabConfig.validLoginMethods ??
      [],
    // 默认登录方式
    defaultLoginMethod:
      defaultLoginMethod ||
      config.defaultLoginMethod ||
      (publicConfig.loginTabs.default as LoginMethods),
    // 禁止重制密码
    disableResetPwd: !!(
      config.disableResetPwd ??
      !publicConfig.ssoPageComponentDisplay?.forgetPasswordBtn
    ),
    // 是否自动注册
    autoRegister,
    registerMethods:
      config.registerMethods ??
      (autoRegister
        ? registerMethods
        : (publicConfig.registerTabs?.list as RegisterMethods[])),
    defaultRegisterMethod:
      config.defaultRegisterMethod ??
      (publicConfig.registerTabs.default as RegisterMethods),
    // 禁止注册
    disableRegister: !!(
      config.disableRegister ??
      !publicConfig.ssoPageComponentDisplay.registerBtn
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
            await requestGuardPageConfig(appId, httpClient),
            await requestMacAddress(httpClient)
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

  const assembledRequestHost = (
    configHost: string,
    publicConfigHost: string
  ) => {
    const configUrl = new URL(configHost)

    if (configUrl.hostname === 'core.authing.cn') {
      return configUrl.protocol + '//' + publicConfigHost
    }

    return configHost
  }

  return useMemo(() => {
    if (publicConfig && config && pageConfig) {
      return {
        finallyConfig: {
          ...mergedPublicConfig(config, publicConfig),
          host: assembledRequestHost(config.host, publicConfig.requestHostname)
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
