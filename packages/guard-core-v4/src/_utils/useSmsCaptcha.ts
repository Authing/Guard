import { message } from 'shim-antd'
import { React } from 'shim-react'
import { useTranslation } from 'react-i18next'

import {
  useGuardAppId,
  useGuardFinallyConfig,
  useGuardPublicConfig,
  useGuardTenantId
} from './context'
import { useGuardHttp } from './guardHttp'

const { useCallback, useEffect, useRef, useState } = React
const CAPTCHA_LIFETIME = 5 * 60 * 1000

interface CaptchaData {
  captchaCodeSvg: string
  captchaToken: string
}

interface CaptchaForm {
  setFieldsValue: (values: { captchaCode: undefined }) => void
}

export const useSmsCaptcha = (enabled: boolean, form: CaptchaForm) => {
  const { get } = useGuardHttp()
  const { t } = useTranslation()
  const appId = useGuardAppId()
  const tenantId = useGuardTenantId()
  const { host } = useGuardFinallyConfig()
  const { userPoolId } = useGuardPublicConfig()
  const [verifyCodeUrl, setVerifyCodeUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const active = useRef(false)
  const pending = useRef(false)
  const generation = useRef(0)
  const challenge = useRef<{ token: string; expiresAt: number }>()

  const refreshCaptcha = useCallback(async () => {
    if (!enabled || !active.current || pending.current) return

    const requestId = ++generation.current
    const requestedAt = Date.now()
    pending.current = true
    challenge.current = undefined
    setVerifyCodeUrl('')
    setLoading(true)
    form.setFieldsValue({ captchaCode: undefined })

    try {
      const result = await get<CaptchaData>('/api/v3/get-captcha-code', {
        r: requestedAt
      })
      if (!active.current || requestId !== generation.current) return

      const data = result.data
      if (
        result.statusCode !== 200 ||
        !data ||
        typeof data.captchaCodeSvg !== 'string' ||
        !data.captchaCodeSvg.trim() ||
        typeof data.captchaToken !== 'string' ||
        !data.captchaToken.trim()
      ) {
        message.error(t('login.captchaLoadFailed'))
        return
      }

      const imageSrc = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
        data.captchaCodeSvg
      )}`
      challenge.current = {
        token: data.captchaToken,
        expiresAt: requestedAt + CAPTCHA_LIFETIME
      }
      setVerifyCodeUrl(imageSrc)
    } catch (_) {
      if (active.current && requestId === generation.current) {
        message.error(t('login.captchaLoadFailed'))
      }
    } finally {
      if (active.current && requestId === generation.current) {
        pending.current = false
        setLoading(false)
      }
    }
  }, [enabled, form, get, t])

  useEffect(() => {
    active.current = true
    setVerifyCodeUrl('')
    setLoading(false)
    form.setFieldsValue({ captchaCode: undefined })
    void refreshCaptcha()

    return () => {
      active.current = false
      generation.current++
      pending.current = false
      challenge.current = undefined
    }
  }, [refreshCaptcha, form, host, appId, userPoolId, tenantId])

  // Read the token at send time so refreshing the image does not remount the
  // SMS input or reset its countdown, and an expired token is never submitted.
  const getCaptchaToken = useCallback(() => {
    const current = challenge.current
    if (
      active.current &&
      !pending.current &&
      current &&
      Date.now() < current.expiresAt
    ) {
      return current.token
    }

    const error = t(
      pending.current
        ? 'login.captchaLoading'
        : current
        ? 'login.captchaExpired'
        : 'login.captchaLoadFailed'
    )
    message.error(error)
    void refreshCaptcha()
    throw new Error(error)
  }, [refreshCaptcha, t])

  const onSendCodeComplete = useCallback(
    (token?: string) => {
      // A completed request must not replace a newer, manually refreshed image.
      if (token && token === challenge.current?.token) {
        void refreshCaptcha()
      }
    },
    [refreshCaptcha]
  )

  return {
    verifyCodeUrl,
    loading,
    refreshCaptcha,
    getCaptchaToken,
    onSendCodeComplete
  }
}
