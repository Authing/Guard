import { React } from 'shim-react'

import { getGuardWindow } from '../Guard/core/useAppendConfig'

import { GenerateSvg } from './iconfont'

import Axios from 'axios'

const { useCallback, useEffect, useState } = React

export const useGuardIconfont = (cdnBase?: string, setError?: any) => {
  const [loaded, setLoaded] = useState<boolean>(false)

  const initIconfont = useCallback(() => {
    if (!cdnBase) return

    Axios(`${cdnBase}/svg-string/guard?v=1`)
      .then(res => {
        const body = res.data as unknown as string

        const guardWindow = getGuardWindow()

        if (!guardWindow) return
        GenerateSvg(guardWindow.document, body)

        setLoaded(true)
      })
      .catch(error => {
        setError?.(error)
        throw new Error('error', error)
      })
      .finally(() => {})
  }, [cdnBase, setError])

  useEffect(() => {
    initIconfont()
  }, [initIconfont])

  return loaded
}
