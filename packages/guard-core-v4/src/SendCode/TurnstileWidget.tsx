import { Button, Tooltip } from 'shim-antd'
import { React } from 'shim-react'
import { useTranslation } from 'react-i18next'
import { loadTurnstile, TurnstileConfig, TurnstileLoadError } from './turnstile'
import './style.less'
import './TurnstileWidget.less'

const { useEffect, useRef, useState } = React

/** Keep pending/error states the same size as the Send button. */
export const TurnstileStatus: React.FC<{
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

export interface TurnstileWidgetProps {
  config: TurnstileConfig
  onToken: (token: string) => void
  onStart: () => void
  onInvalidate: () => void
  compact?: boolean
}

/** Native verification with shared sizing, spacing and retry states. */
export const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({
  config,
  onToken,
  onStart,
  onInvalidate,
  compact = false
}) => {
  const { t, i18n } = useTranslation()
  const container = useRef<HTMLDivElement>(null)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [loading, setLoading] = useState(true)
  const size = compact ? 'compact' : 'flexible'
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
        element.dataset.size = size
        const widgetId = api.render(element, {
          sitekey: config.siteKey,
          action: config.action,
          theme: 'auto',
          appearance: 'always',
          language,
          retry: 'never',
          'refresh-expired': 'manual',
          'refresh-timeout': 'manual',
          size,
          'response-field': false,
          'before-interactive-callback': () => {
            if (active) setLoading(false)
          },
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
  }, [attempt, size, config, language, onToken, onStart, onInvalidate, t])

  const retry = () => {
    onInvalidate()
    setAttempt(value => value + 1)
  }

  return (
    <div
      className={`g2-turnstile-challenge${
        !loading && !error ? ' g2-turnstile-native-ready' : ''
      }${loading && !error ? ' g2-turnstile-pending' : ''}`}
    >
      {compact && (error || loading) && (
        <TurnstileStatus error={error} code={errorCode} onRetry={retry} />
      )}
      <div
        className="g2-turnstile-surface"
        data-size={size}
        aria-hidden={loading || !!error}
      >
        <div className="g2-turnstile-viewport">
          <div ref={container} className="g2-turnstile-widget" />
        </div>
      </div>
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
