import { React } from 'shim-react'
import { useTranslation } from 'react-i18next'
import { useGuardAuthClient } from '../../../Guard/authClient'
import { useDeviceId } from '../../../Guard/core/hooks/useDeviceId'
import { getGuardWindow } from '../../../Guard/core/useAppendConfig'
import { GuardButton } from '../../../GuardButton'
import { IconFont } from '../../../IconFont'
import { ShieldSpin } from '../../../ShieldSpin'
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
  enable_face_login?: boolean
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

const { useCallback, useEffect, useRef, useState } = React

const FACE_LOGIN_TYPE = '1'

const isFaceLoginEnabled = (publicConfig: FaceLoginPublicConfig) =>
  Boolean(publicConfig?.enableFaceLogin || publicConfig?.enable_face_login)

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

const getCurrentGuardWindow = () => getGuardWindow() || window

const getFaceLoginCallbackParams = () => {
  const currentWindow = getCurrentGuardWindow()
  const currentUrl = new URL(currentWindow.location.href)
  const hashSearchIndex = currentUrl.hash.indexOf('?')
  const hashParams =
    hashSearchIndex > -1
      ? new URLSearchParams(currentUrl.hash.slice(hashSearchIndex + 1))
      : undefined

  return {
    faceType:
      currentUrl.searchParams.get('faceType') || hashParams?.get('faceType'),
    token: currentUrl.searchParams.get('token') || hashParams?.get('token')
  }
}

const getFaceLoginReturnUrl = () => {
  const currentWindow = getCurrentGuardWindow()
  const returnUrl = new URL(currentWindow.location.href)

  returnUrl.searchParams.set('faceType', FACE_LOGIN_TYPE)
  returnUrl.searchParams.delete('token')

  const hashSearchIndex = returnUrl.hash.indexOf('?')
  if (hashSearchIndex > -1) {
    const hashPath = returnUrl.hash.slice(0, hashSearchIndex)
    const hashParams = new URLSearchParams(
      returnUrl.hash.slice(hashSearchIndex + 1)
    )

    hashParams.delete('faceType')
    hashParams.delete('token')

    const hashSearch = hashParams.toString()
    returnUrl.hash = hashSearch ? `${hashPath}?${hashSearch}` : hashPath
  }

  return returnUrl.toString()
}

const clearFaceLoginCallbackParams = () => {
  const currentWindow = getCurrentGuardWindow()

  if (!currentWindow?.history?.replaceState) return

  const currentUrl = new URL(currentWindow.location.href)
  currentUrl.searchParams.delete('faceType')
  currentUrl.searchParams.delete('token')

  const hashSearchIndex = currentUrl.hash.indexOf('?')
  if (hashSearchIndex > -1) {
    const hashPath = currentUrl.hash.slice(0, hashSearchIndex)
    const hashParams = new URLSearchParams(
      currentUrl.hash.slice(hashSearchIndex + 1)
    )

    hashParams.delete('faceType')
    hashParams.delete('token')

    const hashSearch = hashParams.toString()
    currentUrl.hash = hashSearch ? `${hashPath}?${hashSearch}` : hashPath
  }

  currentWindow.history.replaceState(
    currentWindow.history.state,
    currentWindow.document?.title || '',
    currentUrl.toString()
  )
}

export const FaceLoginButton = (props: FaceLoginButtonProps) => {
  const { onLoginFailed, onLoginSuccess } = props
  const [loading, setLoading] = useState<boolean>(false)
  const [pageLoading, setPageLoading] = useState<boolean>(false)
  const [feedback, setFeedback] = useState<FaceLoginFeedback>()
  const faceLoginCallbackHandledRef = useRef<boolean>(false)
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

  const handleLivenessResult = useCallback(
    async (livenessTicket: string, withPageLoading = false) => {
      if (withPageLoading) {
        setPageLoading(true)
      }

      try {
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
        if (withPageLoading) {
          setPageLoading(false)
        }
      }
    },
    [
      appId,
      authClient,
      deviceId,
      events,
      onLoginFailed,
      onLoginSuccess,
      post,
      t
    ]
  )

  useEffect(() => {
    const { faceType, token } = getFaceLoginCallbackParams()

    if (
      !isFaceLoginEnabled(publicConfig) ||
      faceType !== FACE_LOGIN_TYPE ||
      !token ||
      faceLoginCallbackHandledRef.current
    ) {
      return
    }

    faceLoginCallbackHandledRef.current = true
    clearFaceLoginCallbackParams()
    handleLivenessResult(token, true)
  }, [handleLivenessResult, publicConfig])

  const handleLogin = async () => {
    setLoading(true)
    setFeedback(undefined)

    try {
      const initRes = await post<FaceLivenessInitData>(
        '/api/v3/custom/face-login/liveness/init',
        {
          appId,
          title: t('login.faceLoginLivenessTitle'),
          returnUrl: getFaceLoginReturnUrl()
        }
      )
      const initData = getResponseData<FaceLivenessInitData>(initRes)
      const checkUrl = getInitCheckUrl(initData)

      if (!isSuccessResponse(initRes) || !checkUrl) {
        const errorMessage =
          getResponseMessage(initRes, initData) || t('login.faceLoginFailed')

        setFeedback({
          status: 'error',
          message: errorMessage
        })
        onLoginFailed(getResponseCode(initRes) || 500, initData, errorMessage)
        return
      }

      getCurrentGuardWindow().location.replace(checkUrl)
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
      {pageLoading && (
        <div className="g2-face-login-page-loading">
          <ShieldSpin size={64} />
        </div>
      )}
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
