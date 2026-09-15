import { getCaptchaUrl } from './getCaptchaUrl'

// All visible fields share the browser's one captcha cookie and its image.
// Consumed images stay visible until another protected request needs a fresh one.
export const createCaptchaImage = () => {
  let state = {
    url: '',
    loading: false,
    error: false,
    version: 0,
    owner: undefined as symbol | undefined
  }
  let source = ''
  let createdAt = 0
  let consumed = false
  let abort: AbortController | undefined
  const listeners = new Set<() => void>()
  const publish = (patch: Partial<typeof state>) => {
    state = { ...state, ...patch }
    listeners.forEach(listener => listener())
  }
  const refresh = (host: string, poolId: string, owner?: symbol) => {
    if (state.owner && state.owner !== owner) return
    source = JSON.stringify([host, poolId])
    createdAt = Date.now()
    consumed = false
    abort?.abort()
    if (state.url) URL.revokeObjectURL(state.url)
    const controller = new AbortController()
    abort = controller
    publish({
      url: '',
      loading: true,
      error: false,
      version: state.version + 1
    })
    const timeout = setTimeout(() => controller.abort(), 10000)
    fetch(getCaptchaUrl(host, poolId), {
      credentials: 'include',
      signal: controller.signal
    })
      .then(response => {
        if (!response.ok) throw new Error('Captcha image request failed')
        return response.blob()
      })
      .then(blob => {
        if (abort !== controller || controller.signal.aborted) return
        publish({ url: URL.createObjectURL(blob), loading: false })
      })
      .catch(() => {
        if (abort === controller) publish({ loading: false, error: true })
      })
      .finally(() => clearTimeout(timeout))
  }
  return {
    snapshot: () => state,
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    ensure: (host: string, poolId: string, owner?: symbol) => {
      if (
        (owner !== undefined && consumed) ||
        source !== JSON.stringify([host, poolId]) ||
        Date.now() - createdAt >= 5 * 60 * 1000 ||
        (!state.url && !state.loading && !state.error)
      )
        refresh(host, poolId, owner)
    },
    refresh,
    consume: (owner: symbol) => {
      if (state.owner === owner) consumed = true
    },
    claim: (owner: symbol) => publish({ owner }),
    release: (owner: symbol) => {
      if (state.owner === owner) publish({ owner: undefined })
    }
  }
}

export const captchaImage = createCaptchaImage()
