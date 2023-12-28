import { React } from 'shim-react'
import { useState } from 'react'
import { useMediaSize } from '../../../_utils/hooks'
import { get as getWebauthnCredential } from '@github/webauthn-json'
import { useGuardHttp } from '../../../_utils/guardHttp'
import {
  useGuardAppId,
  useGuardFinallyConfig,
  useGuardHttpClient,
  useGuardPublicConfig
} from '../../../_utils/context'
import { GuardButton } from '../../../GuardButton'
import { IconFont } from '../../../IconFont'
import { useTranslation } from 'react-i18next'
import { requestClient } from '../../../_utils/http'
import { CodeAction, getVersion, i18n } from '../../../_utils'

interface LoginWithPasskeyProps {
  onLoginSuccess: any
  onLoginFailed: any
}

const { useCallback } = React

export const PasskeyButton = (props: LoginWithPasskeyProps) => {
  const { onLoginFailed, onLoginSuccess } = props
  const { isPhoneMedia } = useMediaSize()
  const publicConfig = useGuardPublicConfig()
  const [abortController, setAbortController] = useState<AbortController>()
  const [loading, setLoading] = useState<boolean>(false)
  const { host } = useGuardFinallyConfig()
  const appId = useGuardAppId()
  const version = getVersion()
  const { responseIntercept } = useGuardHttpClient()

  const { t } = useTranslation()

  const createAbortSignal = () => {
    if (abortController) {
      abortController.abort()
    }
    const controller = new AbortController()
    setAbortController(controller)
    return controller.signal
  }

  const isShowPasskey = useCallback(() => {
    if (isPhoneMedia || !publicConfig.passkeyEnabled) {
      return false
    }

    const userAgent = navigator.userAgent

    if (userAgent.includes('Chrome') && !userAgent.includes('Edge')) {
      return 'Chrome'
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      return 'Safari'
    } else if (userAgent.includes('Edg')) {
      return 'Edge'
    } else if (userAgent.includes('Brave')) {
      return 'Brave'
    } else if (userAgent.includes('Windows')) {
      return false
    } else {
      return false // 未知浏览器
    }
  }, [isPhoneMedia, publicConfig])

  const handleLogin = async () => {
    setLoading(true)
    try {
      const initializeApi = `${host}/api/v3/webauthn/login/initialize`

      const initializeRes = await fetch(initializeApi, {
        method: 'POST',
        body: JSON.stringify({}),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          [requestClient.langHeader]: i18n.language,
          'x-authing-userpool-id': publicConfig.userPoolId,
          'x-authing-app-id': appId,
          'x-authing-sdk-version': version,
          'x-authing-request-from': `Guard@${version}`
        }
      })
      const initializeJson = await initializeRes.json()
      const {
        statusCode,
        data: challenge,
        message: tips
      } = responseIntercept(initializeJson)
      if (statusCode !== 200) {
        onLoginFailed(statusCode, undefined, tips)
        return
      }

      challenge.mediation = 'required' as CredentialMediationRequirement
      challenge.signal = createAbortSignal()
      const ticket = challenge.ticket
      const assertion = await getWebauthnCredential(challenge)

      const finalizeApi = `${host}/api/v3/webauthn/login/finalize`
      const finalizeRes = await fetch(finalizeApi, {
        method: 'POST',
        body: JSON.stringify({
          credential: assertion,
          ticket
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          [requestClient.langHeader]: i18n.language,
          'x-authing-userpool-id': publicConfig.userPoolId,
          'x-authing-app-id': appId,
          'x-authing-sdk-version': version,
          'x-authing-request-from': `Guard@${version}`
        }
      })
      const finalizeJson = await finalizeRes.json()
      const {
        statusCode: code2,
        data: tokenSet,
        message: tips2
      } = responseIntercept(finalizeJson)
      if (code2 !== 200) {
        onLoginFailed(code2, undefined, tips2)
        return
      }
      onLoginSuccess(tokenSet)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {isShowPasskey() && (
        <GuardButton
          className="g2-guard-third-login-btn"
          block
          loading={loading}
          size="large"
          onClick={handleLogin}
          icon={
            <IconFont
              type="authing-slideshow-3-line"
              style={{ fontSize: 16, marginRight: 8, color: '#215AE5' }}
            />
          }
        >
          {t('login.loginWithPasskey')}
        </GuardButton>
      )}
    </>
  )
}
