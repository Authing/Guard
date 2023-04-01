import { AuthenticationClient } from 'authing-js-sdk'

import { React } from 'shim-react'

import { useGlobalAuthClient } from '../AuthClientProvider'

const { useEffect, useMemo } = React

export interface UseInitAppidProps {
  propsAppid?: string
  propsAuthClient?: AuthenticationClient
  setError?: any
}

export const useInitAppId = (
  propsAppid?: string,
  propsAuthClient?: AuthenticationClient,
  setError?: any
) => {
  const globalAuthClient = useGlobalAuthClient()

  const appId = useMemo(() => {
    if (propsAppid) {
      return propsAppid
    } else if (propsAuthClient && propsAuthClient.options.appId) {
      return propsAuthClient.options.appId
    } else if (globalAuthClient && globalAuthClient.options.appId) {
      return globalAuthClient.options.appId
    }

    return undefined
  }, [globalAuthClient, propsAppid, propsAuthClient])

  useEffect(() => {
    if (appId) return

    setError?.(new Error('appId is required'))
  }, [appId, setError])

  return appId
}
