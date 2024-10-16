import { React } from 'shim-react'

import { getGuardWindow } from '../Guard/core/useAppendConfig'

import { GenerateSvg } from './iconfont'

const { useCallback, useEffect, useState } = React

export const useGuardIconfont = (cdnBase?: string, setError?: any) => {
  const [loaded, setLoaded] = useState<boolean>(false)

  const initIconfont = useCallback(async () => {
    if (!cdnBase) return
    try {
      // const res = await Promise.race([Axios(`${cdnBase}/svg-string/guard?v=1`)])

      const response = await fetch(`${cdnBase}/svg-string/guard?v=1`)
      const body = await response.text()
      const guardWindow = getGuardWindow()

      if (!guardWindow) return
      GenerateSvg(guardWindow.document, body)

      setLoaded(true)
    } catch (error: any) {
      setError?.(error)
    }
  }, [cdnBase, setError])

  useEffect(() => {
    initIconfont()
  }, [initIconfont])

  return loaded
}
