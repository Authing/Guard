import { Button, Modal, Tooltip, message } from 'shim-antd'
import { React, createPortal } from 'shim-react'
import { useTranslation } from 'react-i18next'
import {
  useGuardHttpClient,
  useGuardAuthenticationClient
} from '../_utils/context'
import {
  loadTurnstile,
  readTurnstileConfig,
  TurnstileChallengeError,
  TurnstileConfig,
  TurnstileLoadError
} from './turnstile'
import './style.less'
import {
  hasTurnstileToken,
  needsTurnstileProof,
  turnstileSubmissionFailed
} from '../_utils/turnstileRequest'

const { useCallback, useEffect, useRef, useState } = React

const SUCCESS_FEEDBACK_MS = 1500
const TurnstileContext = React.createContext<{
  getTurnstileParams: () => Promise<Record<string, string>>
  sendDisabled: boolean
  submissionProtected: boolean
  mountVerification: (slot: HTMLElement) => () => void
} | null>(null)

/** Keep pending/error states the same size as the Send button. */
const TurnstileStatus: React.FC<{
  error?: string
  code?: string
  onRetry?: () => void
}> = ({ error, code, onRetry }) => {
  const { t } = useTranslation()
  return error ? (
    <>
      <span role="alert" className="g2-turnstile-sr-only">
        {error}
      </span>
      <Tooltip title={error}>
        <Button
          className="genauth-g2-turnstile-state-btn g2-turnstile-state-error"
          data-error-code={code}
          onClick={onRetry}
          aria-label={`${error} ${t('login.turnstileRetry')}`}
        >
          {t('login.turnstileRetryShort')}
        </Button>
      </Tooltip>
    </>
  ) : (
    <Button
      className="genauth-g2-turnstile-state-btn"
      disabled={true}
      loading={true}
      role="status"
    >
      {t('login.turnstileChecking')}
    </Button>
  )
}

const TurnstileWidget: React.FC<{
  config: TurnstileConfig
  onToken: (token: string) => void
  onStart: () => void
  onInvalidate: () => void
  compact?: boolean
}> = ({ config, onToken, onStart, onInvalidate, compact = false }) => {
  const { t, i18n } = useTranslation()
  const container = useRef<HTMLDivElement>(null)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [loading, setLoading] = useState(true)
  const [errorCode, setErrorCode] = useState('')
  const locale = i18n?.resolvedLanguage || i18n?.language || 'auto'
  const language = /^en/i.test(locale)
    ? 'en'
    : /^ja/i.test(locale)
    ? 'ja'
    : /^zh[-_]TW/i.test(locale)
    ? 'zh-TW'
    : /^zh/i.test(locale)
    ? 'zh-CN'
    : 'auto'

  useEffect(() => {
    const element = container.current
    if (!element) return
    let active = true
    let removeWidget: (() => void) | undefined
    onStart()
    setError('')
    setLoading(true)
    setErrorCode('')

    loadTurnstile(element.ownerDocument)
      .then(api => {
        if (!active) return
        const widgetId = api.render(element, {
          sitekey: config.siteKey,
          action: config.action,
          theme: 'auto',
          appearance: 'always',
          language,
          retry: 'never',
          'refresh-expired': 'manual',
          'refresh-timeout': 'manual',
          size:
            compact ||
            ((element.ownerDocument.defaultView?.innerWidth || 1024) <= 400 &&
              element.clientWidth < 300)
              ? 'compact'
              : 'flexible',
          'response-field': false,
          callback: token => {
            if (active && token) {
              setError('')
              setLoading(false)
              onToken(token)
            }
          },
          'error-callback': code => {
            if (active) {
              onInvalidate()
              setErrorCode(code || 'CHALLENGE_FAILED')
              setError(
                t(
                  code === '110200'
                    ? 'login.turnstileDomainError'
                    : 'login.turnstileError'
                ) as string
              )
            }
          },
          'expired-callback': () => {
            if (active) {
              onInvalidate()
              setError(t('login.turnstileExpired') as string)
            }
          },
          'timeout-callback': () => {
            if (active) {
              onInvalidate()
              setErrorCode('CHALLENGE_TIMEOUT')
              setError(t('login.turnstileError') as string)
            }
          }
        })
        if (!widgetId) throw new Error('Turnstile did not render a widget')
        if (active) setLoading(false)
        removeWidget = () => api.remove(widgetId)
        if (!active) removeWidget()
      })
      .catch(cause => {
        if (active) {
          onInvalidate()
          const code =
            cause instanceof TurnstileLoadError
              ? cause.code
              : 'WIDGET_RENDER_FAILED'
          setErrorCode(code)
          setError(
            t(
              code === 'SCRIPT_LOAD_FAILED'
                ? 'login.turnstileNetworkError'
                : code === 'SCRIPT_LOAD_TIMEOUT'
                ? 'login.turnstileLoadTimeout'
                : 'login.turnstileError'
            ) as string
          )
        }
      })

    return () => {
      active = false
      removeWidget?.()
    }
  }, [attempt, compact, config, language, onToken, onStart, onInvalidate, t])

  const retry = () => {
    onInvalidate()
    setAttempt(value => value + 1)
  }

  return (
    <div
      className={`g2-turnstile-challenge${
        !loading && !error ? ' g2-turnstile-native-ready' : ''
      }`}
    >
      {compact && (error || loading) && (
        <TurnstileStatus error={error} code={errorCode} onRetry={retry} />
      )}
      {!compact && loading && !error && (
        <span role="status" className="g2-turnstile-loading">
          {t('login.turnstileTitle')}…
        </span>
      )}
      <div ref={container} className="g2-turnstile-widget" />
      {!compact && error && (
        <p role="alert" className="g2-turnstile-error">
          {error}
        </p>
      )}
      {!compact && error && (
        <Button type="link" onClick={retry}>
          {t('login.turnstileRetry')}
        </Button>
      )}
    </div>
  )
}

/** Send-code views render immediately; password-login recovery uses a modal. */
const useStandaloneTurnstile = ({
  mode = 'inline',
  placement = 'inline',
  active = true
}: {
  mode?: 'inline' | 'modal'
  placement?: 'inline' | 'send-code' | 'page'
  active?: boolean
} = {}) => {
  const { t } = useTranslation()
  const http = useGuardHttpClient()
  const mounted = useRef(true)
  const busy = useRef(false)
  const tokenRef = useRef('')
  const expiresAt = useRef(0)
  const generation = useRef(0)
  const claimed = useRef(false)
  const submittedToken = useRef('')
  const configRef = useRef<TurnstileConfig>()
  const pending = useRef<{
    resolve: (token: string) => void
    reject: (error: Error) => void
  }>()
  const [config, setConfig] = useState<TurnstileConfig>()
  const [token, setToken] = useState('')
  const [feedback, setFeedback] = useState<'checking' | 'ready'>('checking')
  const feedbackTimer = useRef<ReturnType<typeof setTimeout>>()
  const [loading, setLoading] = useState(mode === 'inline')
  const [configError, setConfigError] = useState(false)
  const [verificationError, setVerificationError] = useState('')
  const [challengeAttempt, setChallengeAttempt] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const loadInFlight = useRef<Promise<TurnstileConfig>>()

  const invalidate = useCallback(() => {
    clearTimeout(feedbackTimer.current)
    feedbackTimer.current = undefined
    generation.current++
    expiresAt.current = 0
    tokenRef.current = ''
    if (mounted.current) {
      setToken('')
      setFeedback('checking')
    }
  }, [])

  const startChallenge = useCallback(() => {
    invalidate()
    claimed.current = false
    submittedToken.current = ''
  }, [invalidate])

  const retryAfterFailure = useCallback(
    (token: string) => {
      if (
        !mounted.current ||
        !claimed.current ||
        submittedToken.current !== token
      )
        return
      submittedToken.current = ''
      invalidate()
      setVerificationError('')
      setChallengeAttempt(value => value + 1)
    },
    [invalidate]
  )

  const refreshConfig = useCallback(() => {
    if (loadInFlight.current) return loadInFlight.current
    const request = (async () => {
      try {
        const response = await http.get<TurnstileConfig>(
          '/api/v2/security/turnstile/config'
        )
        if (!mounted.current) throw new TurnstileChallengeError('Cancelled')
        const next = readTurnstileConfig(response)
        const previous = configRef.current
        if (!previous || JSON.stringify(previous) !== JSON.stringify(next)) {
          invalidate()
          configRef.current = next
          setConfig(next)
        }
        setConfigError(false)
        return next
      } catch (error) {
        if (mounted.current) {
          invalidate()
          setConfigError(true)
        }
        throw error
      } finally {
        if (mounted.current) setLoading(false)
      }
    })()
    loadInFlight.current = request
    request.then(
      () => {
        loadInFlight.current = undefined
      },
      () => {
        loadInFlight.current = undefined
      }
    )
    return request
  }, [http, invalidate])

  useEffect(() => {
    if (!active) {
      mounted.current = false
      return
    }
    mounted.current = true
    if (mode === 'inline') {
      void refreshConfig().catch(() => {})
      return () => {
        mounted.current = false
        generation.current++
        tokenRef.current = ''
        clearTimeout(feedbackTimer.current)
      }
    }
    return () => {
      mounted.current = false
      clearTimeout(feedbackTimer.current)
      pending.current?.reject(new TurnstileChallengeError('Cancelled'))
      pending.current = undefined
    }
  }, [active, mode, refreshConfig])

  const onToken = useCallback(
    async (nextToken: string) => {
      if (
        !mounted.current ||
        claimed.current ||
        typeof nextToken !== 'string' ||
        !nextToken.trim() ||
        nextToken.length > 2048
      )
        return
      if (mode === 'modal') {
        claimed.current = true
        submittedToken.current = nextToken
        pending.current?.resolve(nextToken)
        pending.current = undefined
        setModalOpen(false)
      } else {
        if (tokenRef.current) return
        clearTimeout(feedbackTimer.current)
        // Keep the original callback value. Only login/register submission
        // sends it to the server for Siteverify; Send never consumes it.
        tokenRef.current = nextToken
        expiresAt.current = Date.now() + 300000
        setToken(nextToken)
        setVerificationError('')
        if (placement === 'send-code') {
          setFeedback('checking')
          feedbackTimer.current = setTimeout(() => {
            if (mounted.current && tokenRef.current === nextToken)
              setFeedback('ready')
            feedbackTimer.current = undefined
          }, SUCCESS_FEEDBACK_MS)
        }
      }
    },
    [mode, placement]
  )

  useEffect(() => {
    if (!token) return
    const timer = setTimeout(
      () => {
        invalidate()
        setVerificationError(t('login.turnstileExpired') as string)
      },
      Math.max(0, expiresAt.current - Date.now())
    )
    return () => clearTimeout(timer)
  }, [token, invalidate, t])

  const cancel = useCallback(() => {
    pending.current?.reject(new TurnstileChallengeError('Cancelled'))
    pending.current = undefined
    setModalOpen(false)
  }, [])

  const getTurnstileParams = useCallback(async (): Promise<
    Record<string, string>
  > => {
    if (busy.current || !mounted.current)
      throw new TurnstileChallengeError('Cancelled')
    busy.current = true
    try {
      const current =
        mode === 'inline' ? configRef.current : await refreshConfig()
      if (!current) throw new TurnstileChallengeError('Verification required')
      if (!current.enabled) return {}
      if (mode === 'inline') {
        const proof = tokenRef.current
        if (
          !proof ||
          Date.now() >= expiresAt.current ||
          (placement === 'send-code' && feedback !== 'ready')
        ) {
          message.error(t('login.turnstileDescription'))
          throw new TurnstileChallengeError('Verification required')
        }
        // A raw token can be validated once. Reserve it synchronously so
        // double clicks/concurrent transports cannot submit the same value.
        claimed.current = true
        submittedToken.current = proof
        tokenRef.current = ''
        expiresAt.current = 0
        clearTimeout(feedbackTimer.current)
        setToken('')
        return { turnstileToken: proof }
      }
      const proof = await new Promise<string>((resolve, reject) => {
        pending.current = { resolve, reject }
        setModalOpen(true)
      })
      if (!mounted.current) throw new TurnstileChallengeError('Cancelled')
      return { turnstileToken: proof }
    } catch (error) {
      if (error instanceof TurnstileChallengeError) throw error
      const tips = t('login.turnstileConfigError') as string
      message.error(tips)
      throw new TurnstileChallengeError(tips)
    } finally {
      busy.current = false
    }
  }, [refreshConfig, mode, placement, feedback, invalidate, t])

  const sendDisabled =
    mode === 'inline' &&
    (loading ||
      configError ||
      !!verificationError ||
      !config ||
      (config.enabled &&
        (!token || (placement === 'send-code' && feedback !== 'ready'))))
  const retryConfig = () => {
    invalidate()
    setVerificationError('')
    setChallengeAttempt(value => value + 1)
    setLoading(true)
    void refreshConfig().catch(() => {})
  }
  const inlineClassName = `g2-turnstile-inline${
    placement === 'send-code' ? ' g2-turnstile-send-slot' : ''
  }`
  const turnstileView =
    mode === 'inline' ? (
      configError ? (
        <div className={inlineClassName}>
          {placement === 'send-code' ? (
            <TurnstileStatus
              error={
                verificationError || (t('login.turnstileConfigError') as string)
              }
              code="CONFIG_LOAD_FAILED"
              onRetry={retryConfig}
            />
          ) : (
            <div role="alert">
              <p>{verificationError || t('login.turnstileConfigError')}</p>
              <Button type="link" onClick={retryConfig}>
                {t('login.turnstileRetry')}
              </Button>
            </div>
          )}
        </div>
      ) : loading ? (
        <div className={inlineClassName}>
          {placement === 'send-code' ? (
            <TurnstileStatus />
          ) : (
            <span role="status">{t('login.turnstileTitle')}…</span>
          )}
        </div>
      ) : config?.enabled ? (
        <div
          className={inlineClassName}
          hidden={
            placement !== 'page' &&
            !!token &&
            (placement !== 'send-code' || feedback === 'ready')
          }
        >
          <TurnstileWidget
            key={challengeAttempt}
            config={config}
            onToken={onToken}
            onStart={startChallenge}
            onInvalidate={invalidate}
            compact={placement === 'send-code'}
          />
          {verificationError && (
            <div role="alert" className="g2-turnstile-error">
              <p>{verificationError}</p>
              <Button type="link" onClick={retryConfig}>
                {t('login.turnstileRetry')}
              </Button>
            </div>
          )}
        </div>
      ) : null
    ) : config && modalOpen ? (
      <Modal
        open={true}
        title={t('login.turnstileTitle')}
        footer={null}
        width={360}
        onCancel={cancel}
        maskClosable={false}
        getContainer={false}
        destroyOnClose={true}
        className="g2-turnstile-modal"
      >
        <TurnstileWidget
          config={config}
          onToken={onToken}
          onStart={startChallenge}
          onInvalidate={invalidate}
        />
      </Modal>
    ) : null

  return {
    getTurnstileParams,
    turnstileView,
    sendDisabled,
    retryAfterFailure
  }
}

/** Authentication forms share one widget until its raw token is submitted. */
export const useTurnstile = (options?: {
  mode?: 'inline' | 'modal'
  placement?: 'inline' | 'send-code' | 'page'
}) => {
  const shared = React.useContext(TurnstileContext)
  const local = useStandaloneTurnstile({ ...options, active: !shared })
  return shared
    ? { ...shared, turnstileView: null, shared: true }
    : { ...local, shared: false }
}

/** One native widget across normal login/register forms; other modules do not gate submission. */
export const TurnstileProvider: React.FC<{ protectSubmission?: boolean }> = ({
  children,
  protectSubmission = true
}) => {
  const [hasFormSlot, setHasFormSlot] = React.useState(false)
  const protectedView = React.useRef(protectSubmission)
  protectedView.current = protectSubmission
  const started = React.useRef(false)
  if (protectSubmission && hasFormSlot) started.current = true
  const [host] = React.useState(() => {
    if (typeof document === 'undefined') return null
    const element = document.createElement('div')
    element.className = 'g2-turnstile-page-verification'
    element.hidden = true
    return element
  })
  const root = React.useRef<HTMLDivElement>(null)
  const slots = React.useRef<HTMLElement[]>([])
  const position = React.useCallback(() => {
    if (!host || !root.current) return
    const slot = slots.current.find(
      item =>
        item.isConnected &&
        item.getBoundingClientRect().width > 0 &&
        !item.closest('[hidden], [aria-hidden="true"]') &&
        item.ownerDocument.defaultView?.getComputedStyle(item).visibility !==
          'hidden'
    )
    // Keep the iframe in one DOM parent. Reparenting an iframe would reload it
    // even when React keeps the widget mounted across login/register/MFA forms.
    if (host.parentElement !== root.current) root.current.appendChild(host)
    const visible = protectedView.current && !!slot
    if (host.hidden !== !visible) host.hidden = !visible
    setHasFormSlot(visible)
    for (const item of slots.current) {
      if ((!visible || item !== slot) && item.style.height)
        item.style.height = ''
    }
    // Account selection, QR login and other screens have no submit anchor.
    // Hide the retained widget instead of adding it below the whole card.
    if (!visible || !slot) return
    const box = slot.getBoundingClientRect()
    const parent = root.current.getBoundingClientRect()
    host.style.position = 'absolute'
    host.style.left = `${box.left - parent.left}px`
    host.style.top = `${box.top - parent.top}px`
    host.style.width = `${box.width}px`
    const height = host.getBoundingClientRect().height
    const reserved = height ? `${height + 16}px` : '0px'
    if (slot.style.height !== reserved) slot.style.height = reserved
  }, [host])
  const mountVerification = React.useCallback(
    (slot: HTMLElement) => {
      slots.current.push(slot)
      position()
      return () => {
        slots.current = slots.current.filter(item => item !== slot)
        slot.style.height = ''
        position()
      }
    },
    [position]
  )
  React.useLayoutEffect(() => {
    position()
    const observer =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(position)
    if (root.current) observer?.observe(root.current)
    if (host) observer?.observe(host)
    // Validation messages can move the submit field without resizing its width.
    const changes =
      typeof MutationObserver === 'undefined'
        ? null
        : new MutationObserver(position)
    if (root.current)
      changes?.observe(root.current, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['class', 'hidden', 'aria-hidden']
      })
    window.addEventListener('resize', position)
    return () => {
      observer?.disconnect()
      changes?.disconnect()
      window.removeEventListener('resize', position)
      host?.remove()
    }
  }, [host, position])
  const state = useStandaloneTurnstile({
    placement: 'page',
    active: started.current
  })
  React.useLayoutEffect(() => {
    position()
  }, [host, protectSubmission, position])
  const http = useGuardHttpClient()
  const client = useGuardAuthenticationClient()
  const reader = React.useRef(state.getTurnstileParams)
  const failureHandler = React.useRef(state.retryAfterFailure)
  reader.current = state.getTurnstileParams
  failureHandler.current = state.retryAfterFailure
  React.useEffect(() => {
    // Never fan out one raw token to multiple independent requests. The form
    // remains disabled until ready; API calls made early reject immediately.
    const read = () => reader.current()
    const onFailure = (token: string) => failureHandler.current(token)
    const detach = http.setTurnstileProofReader(read, onFailure)
    const ids: Array<{ axios: any; request: number; response?: number }> = []
    // SDK methods such as registerByPhoneCode use their own GraphQL transport.
    // Intercept only this client's API origin, and keep its identity headers.
    const apiOrigin = client
      ? new URL(client.graphqlClient.endpoint).origin
      : ''
    for (const transport of [client?.httpClient, client?.graphqlClient]) {
      const axios = transport?.axios
      if (!axios?.interceptors?.request) continue
      const submissions = new WeakMap<object, string>()
      const id = axios.interceptors.request.use(async (config: any) => {
        const url = new URL(config.url || '', apiOrigin)
        const method = (config.method || 'get').toLowerCase()
        if (url.origin !== apiOrigin || method !== 'post') return config
        const body =
          typeof config.data === 'string'
            ? JSON.parse(config.data)
            : config.data
        if (!needsTurnstileProof(url.pathname, body)) return config
        const next = hasTurnstileToken(url.pathname, body)
          ? config
          : { ...config, data: { ...body, ...(await read()) } }
        const data =
          typeof next.data === 'string' ? JSON.parse(next.data) : next.data
        const token = data?.turnstileToken || data?.extensions?.turnstileToken
        if (typeof token === 'string') submissions.set(next, token)
        return next
      })
      const responseId = axios.interceptors.response?.use(
        (response: any) => {
          const token = response.config && submissions.get(response.config)
          if (token && turnstileSubmissionFailed(response.data))
            onFailure(token)
          return response
        },
        (error: any) => {
          const token = error.config && submissions.get(error.config)
          if (token) onFailure(token)
          return Promise.reject(error)
        }
      )
      ids.push({ axios, request: id, response: responseId })
    }
    return () => {
      detach()
      for (const { axios, request, response } of ids) {
        axios.interceptors.request.eject(request)
        if (response !== undefined) axios.interceptors.response.eject(response)
      }
    }
  }, [client, http])
  return (
    <TurnstileContext.Provider
      value={{
        ...state,
        submissionProtected: protectSubmission,
        mountVerification
      }}
    >
      <div ref={root} className="g2-turnstile-page-root">
        {children}
        {host && createPortal(state.turnstileView, host)}
      </div>
    </TurnstileContext.Provider>
  )
}

/** Reserve the native widget's place above the active form's primary action. */
export const TurnstileField: React.FC = () => {
  const shared = React.useContext(TurnstileContext)
  const slot = React.useRef<HTMLDivElement>(null)
  const mount = shared?.mountVerification
  React.useLayoutEffect(() => {
    if (slot.current && mount && shared?.submissionProtected)
      return mount(slot.current)
  }, [mount, shared?.submissionProtected])
  return shared?.submissionProtected ? (
    <div ref={slot} className="g2-turnstile-form-slot" />
  ) : null
}

export const useTurnstileSubmitDisabled = () => {
  const shared = React.useContext(TurnstileContext)
  return shared?.submissionProtected ? shared.sendDisabled : false
}
