export const TURNSTILE_SCRIPT_URL =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

export interface TurnstileConfig {
  enabled: boolean
  siteKey: string
  action: 'send_code'
  scriptUrl: string
}

export interface TurnstileApi {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string
      action: string
      theme: 'auto'
      size: 'flexible' | 'compact'
      appearance: 'always' | 'interaction-only'
      language: string
      retry: 'never'
      'refresh-expired': 'manual'
      'refresh-timeout': 'manual'
      'response-field': false
      callback: (token: string) => void
      'error-callback': (code?: string) => void
      'expired-callback': () => void
      'timeout-callback': () => void
    }
  ) => string | undefined
  remove: (widgetId: string) => void
}

type TurnstileWindow = Window & { turnstile?: TurnstileApi }

const scriptLoads = new WeakMap<Document, Promise<TurnstileApi>>()

export class TurnstileLoadError extends Error {
  constructor(
    public code:
      | 'SCRIPT_LOAD_FAILED'
      | 'SCRIPT_LOAD_TIMEOUT'
      | 'API_UNAVAILABLE'
  ) {
    super('Unable to load Cloudflare Turnstile')
    Object.setPrototypeOf(this, TurnstileLoadError.prototype)
  }
}

/** Share the script across widgets and Guard instances in the same document. */
export const loadTurnstile = (document: Document): Promise<TurnstileApi> => {
  const cached = scriptLoads.get(document)
  if (cached) return cached

  const promise = new Promise<TurnstileApi>((resolve, reject) => {
    const window = document.defaultView as TurnstileWindow | null
    if (!window) {
      reject(new Error('Turnstile requires a browser window'))
      return
    }

    let script = document.querySelector<HTMLScriptElement>(
      'script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]'
    )
    const owned = !script
    let settled = false

    const cleanup = () => {
      clearTimeout(timer)
      script?.removeEventListener('load', onLoad)
      script?.removeEventListener('error', onError)
    }

    const fail = (code: TurnstileLoadError['code']) => {
      if (settled) return
      settled = true
      cleanup()
      if (owned) script?.remove()
      reject(new TurnstileLoadError(code))
    }

    const onLoad = () => {
      const api = window.turnstile
      if (settled) return
      if (typeof api?.render !== 'function') {
        fail('API_UNAVAILABLE')
        return
      }
      // The load event runs after script evaluation. ready() rejects scripts
      // loaded with async/defer, so use the available render API directly.
      settled = true
      cleanup()
      resolve(api)
    }
    const onError = () => fail('SCRIPT_LOAD_FAILED')
    const timer = setTimeout(() => fail('SCRIPT_LOAD_TIMEOUT'), 15000)

    if (window.turnstile) {
      onLoad()
      return
    }

    if (!script) {
      script = document.createElement('script')
      script.src = TURNSTILE_SCRIPT_URL
      script.async = true
      script.defer = true
    }
    script.addEventListener('load', onLoad)
    script.addEventListener('error', onError)
    if (owned) document.head.appendChild(script)
  })

  scriptLoads.set(document, promise)
  promise.catch(() => {
    if (scriptLoads.get(document) === promise) scriptLoads.delete(document)
  })
  return promise
}

/** Never interpret a failed or malformed configuration request as disabled. */
export const readTurnstileConfig = (response: {
  code?: number
  data?: TurnstileConfig
}): TurnstileConfig => {
  const config = response.data
  if (response.code !== 200 || typeof config?.enabled !== 'boolean') {
    throw new Error('Unable to load human verification configuration')
  }
  if (
    config.enabled &&
    (!config.siteKey?.trim() ||
      config.action !== 'send_code' ||
      config.scriptUrl !== TURNSTILE_SCRIPT_URL)
  ) {
    throw new Error('Invalid human verification configuration')
  }
  return config
}

export class TurnstileChallengeError extends Error {
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, TurnstileChallengeError.prototype)
  }
}
