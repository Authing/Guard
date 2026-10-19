import { React } from 'shim-react'

import axios from 'axios'

const { useEffect, useState } = React

const useImage = (
  src: string | undefined,
  options: {
    onLoad?: () => void
    onError?: () => void
  }
) => {
  const [baseUrl, setBaseUrl] = useState<string>()

  const { onLoad, onError } = options

  /**
   * 预加载图片，转 base64。触发 onLoad，仅此而已
   */
  useEffect(() => {
    if (!src) {
      return
    }
    let active = true
    let fileReader: FileReader | undefined
    const source = axios.CancelToken.source()
    setBaseUrl(undefined)

    const preFetchImage = async () => {
      try {
        const { data: blob } = await axios.get(src, {
          responseType: 'blob',
          cancelToken: source.token
        })
        if (!active) {
          return
        }
        fileReader = new FileReader()
        fileReader.onload = (e: ProgressEvent<FileReader>) => {
          if (active) {
            setBaseUrl(e.target?.result as string)
            onLoad?.()
          }
        }
        fileReader.onerror = () => active && onError?.()
        fileReader.readAsDataURL(blob)
      } catch (error) {
        if (active) {
          onError?.()
        }
      }
    }

    preFetchImage()
    return () => {
      active = false
      source.cancel()
      if (fileReader?.readyState === FileReader.LOADING) {
        fileReader.abort()
      }
    }
  }, [src])

  return [baseUrl]
}

export { useImage }
