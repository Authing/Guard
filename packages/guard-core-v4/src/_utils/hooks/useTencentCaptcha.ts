import { React } from 'shim-react'

const { useCallback, useEffect, useRef } = React

const TENCENT_CAPTCHA_SCRIPT_SRC =
  'https://turing.captcha.qcloud.com/TJCaptcha.js'

export const TENCENT_CAPTCHA_CANCELLED = 'tencent_captcha_cancelled'

export interface TencentCaptchaResult {
  ticket: string
  randstr: string
}

interface UseTencentCaptchaOptions {
  enabled?: boolean
  appId?: string
  form?: any
  userLanguage?: string
}

export const useTencentCaptcha = ({
  enabled = false,
  appId,
  form,
  userLanguage = 'zh-cn'
}: UseTencentCaptchaOptions) => {
  const scriptLoadingRef = useRef<Promise<void> | null>(null)

  const loadTencentCaptchaScript = useCallback(() => {
    if ((window as any).TencentCaptcha) {
      return Promise.resolve()
    }

    if (scriptLoadingRef.current) {
      return scriptLoadingRef.current
    }

    scriptLoadingRef.current = new Promise((resolve, reject) => {
      const existingScript = document.querySelector(
        `script[src="${TENCENT_CAPTCHA_SCRIPT_SRC}"]`
      ) as HTMLScriptElement | null

      const handleLoad = () => resolve()
      const handleError = () => {
        scriptLoadingRef.current = null
        reject(new Error('tencent_captcha_script_load_error'))
      }

      if (existingScript) {
        existingScript.addEventListener('load', handleLoad, { once: true })
        existingScript.addEventListener('error', handleError, { once: true })
        return
      }

      const script = document.createElement('script')
      script.src = TENCENT_CAPTCHA_SCRIPT_SRC
      script.async = true
      script.onload = handleLoad
      script.onerror = handleError
      document.body.appendChild(script)
    })

    return scriptLoadingRef.current
  }, [])

  const getTencentCaptchaFallbackValue =
    useCallback((): TencentCaptchaResult => {
      const currentAppId = appId ?? ''

      return {
        ticket: `trerror_1001_${currentAppId}_${Math.floor(Date.now() / 1000)}`,
        randstr: `@${Math.random().toString(36).slice(2)}`
      }
    }, [appId])

  const runTencentCaptcha =
    useCallback(async (): Promise<TencentCaptchaResult> => {
      if (!appId) {
        throw new Error('missing_tencent_app_id')
      }

      try {
        await loadTencentCaptchaScript()

        return await new Promise<TencentCaptchaResult>((resolve, reject) => {
          try {
            const TencentCaptcha = (window as any).TencentCaptcha
            const captcha = new TencentCaptcha(
              appId,
              (res: any) => {
                if (res?.ret === 0 && res?.ticket && res?.randstr) {
                  resolve({
                    ticket: res.ticket,
                    randstr: res.randstr
                  })
                  return
                }

                if (res?.ret === 2) {
                  reject(new Error(TENCENT_CAPTCHA_CANCELLED))
                  return
                }

                reject(
                  new Error(
                    res?.errorMessage || 'tencent_captcha_verify_failed'
                  )
                )
              },
              {
                userLanguage
              }
            )

            captcha.show()
          } catch (error) {
            reject(error)
          }
        })
      } catch (error: any) {
        if (
          error?.message === TENCENT_CAPTCHA_CANCELLED ||
          error?.message === 'missing_tencent_app_id'
        ) {
          throw error
        }

        return getTencentCaptchaFallbackValue()
      }
    }, [
      appId,
      getTencentCaptchaFallbackValue,
      loadTencentCaptchaScript,
      userLanguage
    ])

  const setTencentCaptchaFields = useCallback(async () => {
    const result = await runTencentCaptcha()
    form?.setFieldsValue(result)
    return result
  }, [form, runTencentCaptcha])

  const resetTencentCaptchaFields = useCallback(() => {
    form?.setFieldsValue({
      ticket: undefined,
      randstr: undefined
    })
  }, [form])

  useEffect(() => {
    if (enabled) {
      loadTencentCaptchaScript().catch(() => undefined)
    }
  }, [enabled, loadTencentCaptchaScript])

  return {
    loadTencentCaptchaScript,
    runTencentCaptcha,
    setTencentCaptchaFields,
    resetTencentCaptchaFields
  }
}
