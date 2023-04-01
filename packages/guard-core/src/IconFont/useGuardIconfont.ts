import { React } from 'shim-react'

import { getGuardWindow } from '../Guard/core/useAppendConfig'

import { GenerateSvg } from './iconfont'

import Axios from 'axios'

const { useCallback, useEffect, useState } = React

export const useGuardIconfont = (cdnBase?: string, setError?: any) => {
  const [loaded, setLoaded] = useState<boolean>(false)

  const initIconfont = useCallback(async () => {
    if (!cdnBase) return

    try {
      const res = await Axios(`${cdnBase}/svg-string/guard-1`)

      const body = res.data

      const guardWindow = getGuardWindow()

      if (!guardWindow) return
      GenerateSvg(guardWindow.document, body)

      setLoaded(true)
    } catch (error) {
      setError?.(error)
    }
  }, [cdnBase, setError])

  useEffect(() => {
    initIconfont()
  }, [initIconfont])

  return loaded
}
