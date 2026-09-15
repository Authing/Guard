import { React } from 'shim-react'
import { Button } from 'shim-antd'
import { GraphicVerifyCode } from '../Login/core/withPassword/GraphicVerifyCode'
import { useTranslation } from 'react-i18next'
import { useGuardFinallyConfig, useGuardPublicConfig } from './context'
import { enqueueCaptchaRequest } from './captchaRequestQueue'
import { captchaImage } from './captchaImage'
import './inlineCaptcha.less'

const { useEffect, useRef, useState } = React

type Challenge = { submit: (code: string) => Promise<void>; cancel: () => void }

export const useCaptchaRequest = (eager = false) => {
  const { t } = useTranslation()
  const config = useGuardFinallyConfig()
  const publicConfig = useGuardPublicConfig()
  const [image, setImage] = useState(captchaImage.snapshot)
  const [challenge, setChallenge] = useState<Challenge>()
  const [input, setInput] = useState({ code: '', version: -1 })
  const [loadedVersion, setLoadedVersion] = useState(-1)
  const [decodeErrorVersion, setDecodeErrorVersion] = useState(-1)
  const [busy, setBusy] = useState(false)
  const mounted = useRef(true)
  const submitting = useRef(false)
  const active = useRef<Challenge>()
  const owner = useRef(Symbol('captcha'))
  const latest = useRef({ input, loadedVersion })
  latest.current = { input, loadedVersion }
  const host = config.host!
  const poolId = publicConfig.userPoolId
  const imageError = image.error || decodeErrorVersion === image.version
  const ready = !!image.url && loadedVersion === image.version
  const code = input.code
  const inputIsCurrent = input.version === image.version
  const locked = !!image.owner && image.owner !== owner.current

  useEffect(() => {
    mounted.current = true
    const unsubscribe = captchaImage.subscribe(() =>
      setImage(captchaImage.snapshot())
    )
    setImage(captchaImage.snapshot())
    return () => {
      mounted.current = false
      unsubscribe()
      if (!submitting.current) active.current?.cancel()
    }
  }, [])

  useEffect(() => {
    if (eager) captchaImage.ensure(host, poolId)
  }, [eager, host, poolId])

  const refresh = () => captchaImage.refresh(host, poolId, owner.current)

  const runWithCaptcha = <T,>(request: (captchaCode: string) => Promise<T>) =>
    enqueueCaptchaRequest<T>(() => {
      if (!mounted.current)
        return Promise.reject(new Error(t('common.captchaCancelled') as string))
      return new Promise<T>((resolve, reject) => {
        captchaImage.claim(owner.current)
        // Keep the preloaded image unless a previous request already consumed it.
        captchaImage.ensure(host, poolId, owner.current)
        const finish = (consumed: boolean) => {
          active.current = undefined
          submitting.current = false
          if (consumed) captchaImage.consume(owner.current)
          captchaImage.release(owner.current)
          if (mounted.current) {
            setBusy(false)
            setChallenge(undefined)
          }
        }
        const next: Challenge = {
          cancel: () => {
            if (submitting.current) return
            finish(false)
            reject(new Error(t('common.captchaCancelled') as string))
          },
          submit: async captchaCode => {
            if (submitting.current) return
            submitting.current = true
            setBusy(true)
            try {
              const result = await request(captchaCode)
              finish(true)
              if (mounted.current) resolve(result)
              else reject(new Error(t('common.captchaCancelled') as string))
            } catch (error) {
              finish(true)
              reject(error)
            }
          }
        }
        active.current = next
        const snapshot = captchaImage.snapshot()
        const filled = latest.current
        if (
          snapshot.url &&
          filled.loadedVersion === snapshot.version &&
          filled.input.version === snapshot.version &&
          filled.input.code.trim()
        ) {
          void next.submit(filled.input.code.trim())
        } else {
          setChallenge(next)
        }
      })
    })

  const submit = () => {
    if (
      ready &&
      inputIsCurrent &&
      code.trim() &&
      !locked &&
      !submitting.current
    )
      void challenge?.submit(code.trim())
  }

  const captchaField =
    eager || challenge ? (
      <section
        className="g2-inline-captcha"
        aria-label={t('login.captchaCode') as string}
        aria-busy={busy}
      >
        <div className="g2-inline-captcha-label">{t('login.captchaCode')}</div>
        <GraphicVerifyCode
          autoFocus={!!challenge}
          size="large"
          imageHeight={42}
          aria-label={t('login.inputCaptchaCode') as string}
          placeholder={t('login.inputCaptchaCode') as string}
          autoComplete="off"
          value={code}
          disabled={busy || locked}
          verifyCodeUrl={image.url}
          changeCode={refresh}
          imageLoading={image.loading || (!image.url && !imageError)}
          imageError={imageError}
          refreshDisabled={busy || locked || (image.loading && !imageError)}
          onImageLoad={() => setLoadedVersion(image.version)}
          onImageError={() => setDecodeErrorVersion(image.version)}
          onChange={event =>
            setInput({ code: event.target.value, version: image.version })
          }
          onPressEnter={event => {
            if (challenge) {
              event.preventDefault()
              submit()
            }
          }}
        />
        <div
          className="g2-inline-captcha-hint"
          role={imageError ? 'alert' : undefined}
        >
          {t(
            imageError
              ? 'common.captchaImageError'
              : code.trim() && !inputIsCurrent
              ? 'common.captchaInputOutdated'
              : challenge
              ? 'common.inlineCaptchaHint'
              : 'common.inlineCaptchaReadyHint'
          )}
        </div>
        {challenge && (
          <div className="g2-inline-captcha-actions">
            <Button
              type="text"
              disabled={busy}
              onClick={() => challenge.cancel()}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="primary"
              loading={busy}
              disabled={
                !ready || !inputIsCurrent || !code.trim() || busy || locked
              }
              onClick={submit}
            >
              {t('common.verifyAndContinue')}
            </Button>
          </div>
        )}
      </section>
    ) : null

  return { runWithCaptcha, captchaField }
}
