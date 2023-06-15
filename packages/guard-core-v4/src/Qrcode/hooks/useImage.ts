import { React } from 'shim-react'

import axios from 'axios'

const { useCallback, useEffect, useState } = React

const useImage = (
  src: string | undefined,
  options: {
    onLoad?: () => void
  }
) => {
  const [baseUrl, setBaseUrl] = useState<string>()

  const { onLoad } = options

  /**
   * 预加载图片，转 base64。触发 onLoad，仅此而已
   */
  const preFetchImage = useCallback(async () => {
    const { data: blob } = await axios.get(src!, {
      responseType: 'blob'
    })
    const fileReader = new FileReader()

    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      const base64 = e.target?.result as string
      setBaseUrl(base64)
      onLoad && onLoad()
    }
    fileReader.readAsDataURL(blob)
  }, [src, onLoad])

  // 每次 render 都会请求 不应该
  useEffect(() => {
    if (src) {
      preFetchImage()
    }
  }, [src])

  return [baseUrl]
}

export { useImage }
