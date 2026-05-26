import { message } from 'shim-antd'
import { React } from 'shim-react'
import { useTranslation } from 'react-i18next'
import { useGuardAuthClient } from '../../../Guard/authClient'
import { useDeviceId } from '../../../Guard/core/hooks/useDeviceId'
import { getGuardWindow } from '../../../Guard/core/useAppendConfig'
import { GuardButton } from '../../../GuardButton'
import { IconFont } from '../../../IconFont'
import { LoginMethods } from '../../../Type/application'
import {
  useGuardAppId,
  useGuardEvents,
  useGuardHttpClient,
  useGuardPublicConfig
} from '../../../_utils/context'

interface FaceLoginButtonProps {
  onLoginSuccess: any
  onLoginFailed: any
}

interface FaceLoginPublicConfig {
  enableFaceLogin?: boolean
}

interface FaceLivenessInitData {
  token?: string
  checkUrl?: string
  msg?: string
  message?: string
  raw?: {
    data?: {
      token?: string
      checkUrl?: string
    }
    msg?: string
    message?: string
  }
}

interface FaceLivenessResultData {
  success?: boolean
  passed?: boolean
  livenessToken?: string
  faceImageBase64?: string
  msg?: string
  message?: string
  raw?: {
    msg?: string
    message?: string
  }
}

interface FaceSignInData {
  status?: 'SUCCESS' | 'NEED_BIND' | 'FAIL'
  reason?: string
  message?: string
  msg?: string
}

interface FaceLoginFeedback {
  status: 'success' | 'error'
  message: string
}

const { useCallback, useState } = React

const FACE_LOGIN_POPUP_WIDTH = 585
const FACE_LOGIN_POPUP_HEIGHT = 649
const FACE_LOGIN_POLL_INTERVAL = 800
const FACE_LOGIN_POPUP_TIMEOUT = 5 * 60 * 1000

const isFaceLoginEnabled = (publicConfig: FaceLoginPublicConfig) =>
  Boolean(publicConfig?.enableFaceLogin)

const getResponseCode = (res: any) => res?.statusCode ?? res?.code

const getResponseData = <T,>(res: any): T => {
  if (!res?.data || typeof res.data !== 'object') {
    return res
  }

  return {
    ...res,
    ...res.data
  }
}

const getInitLivenessTicket = (data?: FaceLivenessInitData) =>
  data?.raw?.data?.token || data?.token

const getInitCheckUrl = (data?: FaceLivenessInitData) =>
  data?.raw?.data?.checkUrl || data?.checkUrl

const getResponseMessage = (...sources: any[]) => {
  for (const source of sources) {
    const message =
      source?.message || source?.msg || source?.raw?.message || source?.raw?.msg

    if (message) {
      return message
    }
  }
}

const isSuccessResponse = (res: any) => {
  const code = getResponseCode(res)

  return code === 200 || (code === undefined && !res?.message && !res?.messages)
}

const openLivenessWindow = (url: string) => {
  const guardWindow = getGuardWindow()

  if (!guardWindow) return

  const document = guardWindow.document
  const dualScreenLeft =
    guardWindow.screenLeft !== undefined
      ? guardWindow.screenLeft
      : guardWindow.screenX
  const dualScreenTop =
    guardWindow.screenTop !== undefined
      ? guardWindow.screenTop
      : guardWindow.screenY
  const width =
    guardWindow.innerWidth ||
    document.documentElement.clientWidth ||
    guardWindow.screen.width
  const height =
    guardWindow.innerHeight ||
    document.documentElement.clientHeight ||
    guardWindow.screen.height
  const systemZoom = width / guardWindow.screen.availWidth
  const left =
    (width - FACE_LOGIN_POPUP_WIDTH) / 2 / systemZoom + dualScreenLeft
  const top =
    (height - FACE_LOGIN_POPUP_HEIGHT) / 2 / systemZoom + dualScreenTop
  const newWindow = guardWindow.open(
    url,
    '_blank',
    `
      toolbar=no,
      menubar=no,
      scrollbars=yes,
      resizable=yes,
      location=no,
      status=no,
      width=${FACE_LOGIN_POPUP_WIDTH},
      height=${FACE_LOGIN_POPUP_HEIGHT},
      top=${top},
      left=${left},
    `
  )

  newWindow?.focus()

  return newWindow
}

const waitForLivenessWindowClosed = (popup: Window) =>
  new Promise<void>((resolve, reject) => {
    const guardWindow = getGuardWindow()
    const timerWindow = guardWindow || window
    const startedAt = Date.now()
    const timer = timerWindow.setInterval(() => {
      if (popup.closed) {
        timerWindow.clearInterval(timer)
        resolve()
        return
      }

      if (Date.now() - startedAt > FACE_LOGIN_POPUP_TIMEOUT) {
        timerWindow.clearInterval(timer)
        popup.close()
        reject(new Error('FACE_LOGIN_TIMEOUT'))
      }
    }, FACE_LOGIN_POLL_INTERVAL)
  })

export const FaceLoginButton = (props: FaceLoginButtonProps) => {
  const { onLoginFailed, onLoginSuccess } = props
  const [loading, setLoading] = useState<boolean>(false)
  const [feedback, setFeedback] = useState<FaceLoginFeedback>()
  const { t } = useTranslation()
  const publicConfig = useGuardPublicConfig() as FaceLoginPublicConfig
  const { post } = useGuardHttpClient()
  const appId = useGuardAppId()
  const events = useGuardEvents()
  const authClient = useGuardAuthClient()
  const deviceId = useDeviceId()

  const isShowFaceLogin = useCallback(() => {
    if (!navigator.mediaDevices) {
      return false
    }

    return isFaceLoginEnabled(publicConfig)
  }, [publicConfig])

  const handleLogin = async () => {
    setLoading(true)
    setFeedback(undefined)

    try {
      const initRes = await post<FaceLivenessInitData>(
        '/api/v3/custom/face-login/liveness/init',
        {
          appId,
          title: t('login.faceLoginLivenessTitle')
        }
      )
      const initData = getResponseData<FaceLivenessInitData>(initRes)
      const livenessTicket = getInitLivenessTicket(initData)
      const checkUrl = getInitCheckUrl(initData)

      if (!isSuccessResponse(initRes) || !livenessTicket || !checkUrl) {
        const errorMessage =
          getResponseMessage(initRes, initData) || t('login.faceLoginFailed')

        setFeedback({
          status: 'error',
          message: errorMessage
        })
        onLoginFailed(getResponseCode(initRes) || 500, initData, errorMessage)
        return
      }

      const popup = openLivenessWindow(checkUrl)
      if (!popup) {
        message.error(t('login.faceLoginPopupBlocked'))
        return
      }

      await waitForLivenessWindowClosed(popup)

      const resultRes = await post<FaceLivenessResultData>(
        '/api/v3/custom/face-login/liveness/result',
        {
          appId,
          livenessTicket
        }
      )
      const resultData = getResponseData<FaceLivenessResultData>(resultRes)
      const resultMessage = getResponseMessage(resultRes, resultData)

      if (
        !isSuccessResponse(resultRes) ||
        resultData?.success === false ||
        resultData?.passed === false ||
        !resultData?.passed ||
        !resultData?.faceImageBase64
      ) {
        const errorMessage = resultMessage || t('login.faceLoginFailed')

        setFeedback({
          status: 'error',
          message: errorMessage
        })
        onLoginFailed(
          getResponseCode(resultRes) || 500,
          resultData,
          errorMessage
        )
        return
      }

      setFeedback({
        status: 'success',
        message: resultMessage || t('login.faceLoginSuccess')
      })

      if (events?.onBeforeLogin) {
        const isContinue = await events.onBeforeLogin(
          {
            type: LoginMethods.FaceLogin,
            data: resultData
          },
          authClient
        )
        if (!isContinue) {
          return
        }
      }

      const signInRes = await post<FaceSignInData>(
        '/api/v3/custom/face-login/sign-in',
        {
          appId,
          faceImageBase64: resultData.faceImageBase64,
          livenessTicket: resultData.livenessToken || livenessTicket,
          ...(deviceId && { deviceInfo: { deviceId } })
        }
      )
      const signInData = getResponseData<FaceSignInData>(signInRes)

      if (!isSuccessResponse(signInRes) || signInData?.status !== 'SUCCESS') {
        const errorMessage =
          getResponseMessage(signInRes, signInData) ||
          (signInData?.status === 'NEED_BIND'
            ? t('login.faceLoginNeedBind')
            : t('login.faceLoginFailed'))

        setFeedback({
          status: 'error',
          message: errorMessage
        })
        onLoginFailed(
          getResponseCode(signInRes) || 500,
          signInData,
          errorMessage
        )
        return
      }

      onLoginSuccess(signInData)
    } catch (error: any) {
      const errorMessage = error.message || t('login.faceLoginFailed')

      setFeedback({
        status: 'error',
        message: errorMessage
      })
      onLoginFailed(500, undefined, errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const faceLoginVisible = isShowFaceLogin()
  const faceLoginButtonClassName = [
    'g2-guard-third-login-btn',
    feedback && `g2-face-login-btn-${feedback.status}`
  ]
    .filter(Boolean)
    .join(' ')
  const faceLoginIconType =
    feedback?.status === 'success'
      ? 'authing-checkbox-circle-fill'
      : feedback?.status === 'error'
      ? 'authing-error-warning-line1'
      : 'authing-new-face'
  const faceLoginIconColor =
    feedback?.status === 'success'
      ? '#00B42A'
      : feedback?.status === 'error'
      ? '#F53F3F'
      : '#215AE5'
  const faceLoginButtonText =
    feedback?.status === 'error'
      ? `${feedback.message}，${t('login.faceLoginClickRetry')}`
      : feedback?.message || t('login.loginWithFace')

  return (
    <>
      {faceLoginVisible && (
        <GuardButton
          className={faceLoginButtonClassName}
          block
          loading={loading}
          size="large"
          onClick={handleLogin}
          icon={
            <IconFont
              type={faceLoginIconType}
              style={{
                fontSize: 16,
                marginRight: 8,
                color: faceLoginIconColor
              }}
            />
          }
        >
          {faceLoginButtonText}
        </GuardButton>
      )}
    </>
  )
}
