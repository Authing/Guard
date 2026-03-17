const TENCENT_CAPTCHA_SCRIPT_SRC =
  'https://turing.captcha.qcloud.com/TJCaptcha.js'
const TENCENT_CAPTCHA_APP_ID = '199308480'

let scriptLoadingPromise: Promise<void> | null = null

const loadTencentCaptchaScript = async () => {
  if ((window as any).TencentCaptcha) {
    return
  }

  if (scriptLoadingPromise) {
    return scriptLoadingPromise
  }

  scriptLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = TENCENT_CAPTCHA_SCRIPT_SRC
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('load_tencent_captcha_failed'))
    document.body.appendChild(script)
  })

  return scriptLoadingPromise
}

const createFallbackCaptchaResult = () => {
  return {
    ticket: `trerror_1001_${TENCENT_CAPTCHA_APP_ID}_${Math.floor(
      Date.now() / 1000
    )}`,
    randstr: `@${Math.random().toString(36).slice(2)}`
  }
}

export interface TencentCaptchaResult {
  ticket: string
  randstr: string
}

export const openTencentCaptcha =
  async (): Promise<TencentCaptchaResult | null> => {
    try {
      await loadTencentCaptchaScript()
      return await new Promise<TencentCaptchaResult | null>(resolve => {
        try {
          const captcha = new (window as any).TencentCaptcha(
            TENCENT_CAPTCHA_APP_ID,
            (res: any) => {
              if (res?.ret === 0 && res?.ticket && res?.randstr) {
                resolve({
                  ticket: res.ticket,
                  randstr: res.randstr
                })
                return
              }
              resolve(null)
            },
            {
              userLanguage: 'zh-cn'
            }
          )
          captcha.show()
        } catch (error) {
          resolve(createFallbackCaptchaResult())
        }
      })
    } catch (error) {
      return createFallbackCaptchaResult()
    }
  }
