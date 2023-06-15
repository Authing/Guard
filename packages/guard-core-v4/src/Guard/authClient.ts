import { AuthenticationClient } from 'authing-js-sdk'

import { Lang } from 'authing-js-sdk/build/main/types'

import { React } from 'shim-react'

import { useGlobalAuthClient } from '../AuthClientProvider/AuthClientProvider'

import { getVersion } from '../_utils'

import { GuardLocalConfig } from './config'

const { useEffect, useMemo, useState } = React

let authClient: AuthenticationClient

const checkAuthClientProps = (
  client: AuthenticationClient,
  props: {
    appId: string
    tenantId?: string
  }
): boolean => {
  const { appId, tenantId } = props

  if (client.options.appId !== appId) {
    throw new Error(
      'AuthClientProvider 与 Guard AppId 初始化不同，请检查初始化时传入的 AppId 是否正确'
    )
  }

  if (tenantId && client.options.tenantId !== tenantId) {
    throw new Error(
      'AuthClientProvider 与 Guard TenantId 初始化不同，请检查初始化时传入的 TenantId 是否正确'
    )
  }

  return true
}

export const initGuardAuthClient = (
  config: GuardLocalConfig,
  appId: string,
  tenantId?: string
) => {
  const host = config.host
  const lang = config.lang

  if (!authClient) {
    try {
      const version = getVersion()
      authClient = new AuthenticationClient({
        appHost: host,
        tenantId: tenantId,
        appId,
        lang: lang as Lang,
        requestFrom: `Guard@${version}`,
        onError: (code, msg: any) => {
          console.error(code, msg)
        }
      })
    } catch (error: any) {
      throw error
    }
  }

  return authClient
}

export const useInitGuardAuthClient = (props: {
  config?: GuardLocalConfig
  appId?: string
  authClient?: AuthenticationClient
  setError?: any
  tenantId?: string
}) => {
  const { config, appId, setError, tenantId } = props
  const globalClient = useGlobalAuthClient()

  const [client, setClient] = useState<AuthenticationClient>()

  useEffect(() => {
    if (!config || !appId) return

    const host = config.host
    const lang = config.lang
    const propsAuthClient = props?.authClient

    // 优先检测 props 中的 authClient 对象
    if (propsAuthClient) {
      try {
        checkAuthClientProps(propsAuthClient, { appId, tenantId })

        setClient(propsAuthClient)

        return
      } catch (error) {
        setError(error)
      }
    }
    // 如果 props 中的 authClient 对象不存在，则检测全局的 authClient 对象
    if (globalClient) {
      try {
        checkAuthClientProps(globalClient, { appId, tenantId })

        setClient(globalClient)

        return
      } catch (error) {
        setError(error)
      }
    }

    // 如果全局的 authClient 对象也不存在，则初始化一个新的 authClient 对象
    try {
      const version = getVersion()
      const authClient = new AuthenticationClient({
        appHost: host,
        tenantId: tenantId,
        appId,
        lang: lang as Lang,
        requestFrom: `Guard@${version}`,
        onError: (code, msg: any) => {
          console.error(code, msg)
        }
      })

      setClient(authClient)
    } catch (error) {
      setError(error)
    }
  }, [appId, config, globalClient, props?.authClient, setError, tenantId])

  useMemo(() => {
    if (!client) return
    authClient = client
  }, [client])

  return client
}

export const getGuardAuthClient = () => {
  if (!authClient) {
    throw new Error('Please initialize GuardAuthClient')
  }

  return authClient
}

export const useGuardAuthClient = () => getGuardAuthClient()
