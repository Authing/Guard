import { message } from 'shim-antd'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { UiQrCode } from '../../Qrcode/UiQrCode'

import { ShieldSpin } from '../../ShieldSpin'

import {
  useGuardAppId,
  useGuardEvents,
  useGuardHttpClient,
  useGuardPublicConfig
} from '../../_utils/context'

import { StoreInstance } from '../../Guard/core/hooks/useMultipleAccounts'

import { LoginMethods, QrCodeItem } from '../../Type'

import { useGuardAuthClient } from '../../Guard/authClient'

const { useCallback, useEffect, useState } = React

type IShenzhenLoginMethod =
  | LoginMethods.IShenzhenPersonalQrcode
  | LoginMethods.IShenzhenCorporateQrcode

type IShenzhenQrCodeData = {
  random: string
  url: string
  expiresIn: number
  subjectType: 'personal' | 'corporate'
}

type IShenzhenQrCodeStatus = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6

interface LoginWithIShenzhenQrcodeProps {
  canLoop: boolean
  connectionId: string
  loginMethod: IShenzhenLoginMethod
  multipleInstance?: StoreInstance
  onLoginSuccess: (data: any) => void
  qrConfig?: QrCodeItem['QRConfig']
}

export const LoginWithIShenzhenQrcode = (
  props: LoginWithIShenzhenQrcodeProps
) => {
  const {
    canLoop,
    connectionId,
    loginMethod,
    multipleInstance,
    onLoginSuccess,
    qrConfig
  } = props

  const appId = useGuardAppId()
  const publicConfig = useGuardPublicConfig()
  const authClient = useGuardAuthClient()
  const events = useGuardEvents()
  const { get, post, responseIntercept } = useGuardHttpClient()
  const { t } = useTranslation()

  const [status, setStatus] = useState<
    | 'loading'
    | 'ready'
    | 'already'
    | 'success'
    | 'error'
    | 'expired'
    | 'cancel'
    | 'MFA'
  >('loading')
  const [qrCodeUrl, setQrCodeUrl] = useState<string>()
  const [errorDescription, setErrorDescription] = useState('')
  const [refreshCount, setRefreshCount] = useState(0)

  const refreshQrCode = useCallback(() => {
    setErrorDescription('')
    setStatus('loading')
    setQrCodeUrl(undefined)
    setRefreshCount(count => count + 1)
  }, [])

  useEffect(() => {
    if (!canLoop) {
      return
    }

    let stopped = false
    let pollTimer: ReturnType<typeof setTimeout> | undefined
    let expiresTimer: ReturnType<typeof setTimeout> | undefined

    const clearTimers = () => {
      pollTimer && clearTimeout(pollTimer)
      expiresTimer && clearTimeout(expiresTimer)
    }

    const stop = () => {
      stopped = true
      clearTimers()
    }

    const fail = (errorStatus: 'error' | 'cancel', errorMessage: string) => {
      stop()
      setErrorDescription(errorMessage)
      setStatus(errorStatus)
      message.error(errorMessage)
    }

    const completeLogin = async (data: any) => {
      clearTimers()
      setStatus('success')

      let loginData = data?.userInfo || data?.user || data
      if (data?.ticket) {
        const userResult = await post('/api/v2/qrcode/userinfo', {
          ticket: data.ticket
        })
        if (String(userResult.code) !== '200' || !userResult.data) {
          throw new Error(
            userResult.message || String(t('login.iShenzhenLoginFailed'))
          )
        }
        loginData = { ...userResult.data, ticket: data.ticket }
      }

      if (events?.onBeforeLogin) {
        const isContinue = await events.onBeforeLogin(
          { type: loginMethod, data: loginData },
          authClient
        )
        if (isContinue === false) {
          stop()
          return
        }
      }

      stop()
      multipleInstance?.setLoginWay('qrcode', loginMethod, connectionId)
      onLoginSuccess(loginData)
    }

    const scheduleNextCheck = (check: () => Promise<void>) => {
      if (!stopped) {
        pollTimer = setTimeout(check, 1500)
      }
    }

    const start = async () => {
      try {
        if (!qrConfig?.generateUrl) {
          throw new Error(String(t('login.iShenzhenGenerateFailed')))
        }

        const response = await fetch(qrConfig.generateUrl, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'x-authing-userpool-id': publicConfig.userPoolId,
            'x-authing-app-id': appId
          },
          body: JSON.stringify({
            appId,
            connId: connectionId
          })
        })
        const result = await response.json()

        if (!response.ok || String(result.code) !== '200' || !result.data) {
          throw new Error(
            result.message || String(t('login.iShenzhenGenerateFailed'))
          )
        }

        if (stopped) {
          return
        }

        const qrCode = result.data as IShenzhenQrCodeData
        if (!qrCode.random || !qrCode.url) {
          throw new Error(String(t('login.iShenzhenGenerateFailed')))
        }

        setQrCodeUrl(qrCode.url)
        expiresTimer = setTimeout(
          () => {
            stop()
            setStatus('expired')
          },
          Math.max(qrCode.expiresIn || 120, 1) * 1000
        )

        const check = async () => {
          if (stopped) {
            return
          }

          try {
            const result = await get(
              `/api/v2/qrcode/check?random=${encodeURIComponent(qrCode.random)}`
            )
            if (String(result.code) !== '200' || !result.data) {
              throw new Error(
                result.message || String(t('login.iShenzhenCheckFailed'))
              )
            }

            const data: any = result.data
            const qrStatus = data.status as IShenzhenQrCodeStatus

            switch (qrStatus) {
              case -1:
                stop()
                setStatus('expired')
                break
              case 0:
                scheduleNextCheck(check)
                break
              case 1:
                setStatus('already')
                scheduleNextCheck(check)
                break
              case 2:
              case 6:
                await completeLogin(data)
                break
              case 3:
                fail(
                  'cancel',
                  data.scannedResult?.message || t('login.iShenzhenCancelled')
                )
                break
              case 4:
                stop()
                setStatus('MFA')
                if (data.scannedResult) {
                  responseIntercept(data.scannedResult).onGuardHandling?.()
                } else {
                  fail('error', t('login.iShenzhenLoginFailed'))
                }
                break
              case 5:
                fail(
                  'error',
                  data.scannedResult?.message ||
                    data.scannedResult?.errmsg ||
                    t('login.iShenzhenLoginFailed')
                )
                break
              default:
                fail('error', t('login.iShenzhenCheckFailed'))
                break
            }
          } catch (error: any) {
            if (!stopped) {
              fail('error', error?.message || t('login.iShenzhenCheckFailed'))
            }
          }
        }

        await check()
      } catch (error: any) {
        if (!stopped) {
          fail('error', error?.message || t('login.iShenzhenGenerateFailed'))
        }
      }
    }

    setErrorDescription('')
    setStatus('loading')
    setQrCodeUrl(undefined)
    start()

    return stop
  }, [
    appId,
    authClient,
    canLoop,
    connectionId,
    events,
    get,
    loginMethod,
    multipleInstance,
    onLoginSuccess,
    post,
    publicConfig.userPoolId,
    qrConfig?.generateUrl,
    refreshCount,
    responseIntercept,
    t
  ])

  if (!canLoop) {
    return null
  }

  return (
    <UiQrCode
      src={qrCodeUrl}
      status={status}
      loadingComponent={<ShieldSpin />}
      descriptions={{
        ready: (
          <span
            style={{
              display: 'inline-block',
              maxWidth: '166px',
              overflow: 'hidden',
              textAlign: 'center',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {t(
              loginMethod === LoginMethods.IShenzhenCorporateQrcode
                ? 'login.iShenzhenCorporateScanLogin'
                : 'login.iShenzhenPersonalScanLogin'
            )}
          </span>
        ),
        already: t('login.iShenzhenScanned'),
        success: t('common.LoginSuccess'),
        expired: t('login.iShenzhenExpired'),
        cancel: errorDescription || t('login.iShenzhenCancelled'),
        error: errorDescription || t('login.iShenzhenLoginFailed'),
        MFA: t('common.LoginSuccess')
      }}
      imageStyle={{
        height: '166px',
        width: '166px'
      }}
      onLoad={() =>
        setStatus(currentStatus =>
          currentStatus === 'loading' ? 'ready' : currentStatus
        )
      }
      onMaskContent={currentStatus => {
        if (['cancel', 'error', 'expired'].includes(currentStatus)) {
          refreshQrCode()
        }
      }}
    />
  )
}
