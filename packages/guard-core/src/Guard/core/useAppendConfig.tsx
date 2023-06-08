import { React } from 'shim-react'

import { setPublicConfig } from '../../_utils'

import { GuardAppendConfig } from '../../Type'

import { initAppendConfig } from '../../_utils/appendConfig'

import { setPageConfig } from '../../_utils/config'

import { getGuardDocument } from '../../_utils/guardDocument'

const { useEffect } = React

export const getGuardWindow = () => {
  if (typeof window === 'undefined') {
    return undefined
  }

  const guardDocument = getGuardDocument()

  const guardWindow = guardDocument?.defaultView

  if (guardWindow) {
    return guardWindow
  }

  return window
}

export const useGuardWindow = getGuardWindow

export const useInitGuardAppendConfig = (
  setForceUpdate: any,
  appId?: string,
  appendConfig?: GuardAppendConfig
) => {
  useEffect(() => {
    if (!appId) return
    setForceUpdate(Date.now())

    initAppendConfig(appendConfig)

    if (appendConfig?.publicConfig) {
      setPublicConfig(appId, appendConfig.publicConfig)
    }

    if (appendConfig?.pageConfig) {
      setPageConfig(appId, appendConfig.pageConfig)
    }
  }, [appId, appendConfig, setForceUpdate])
}
