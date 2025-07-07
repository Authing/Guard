import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { GuardModuleType } from '../Guard/module'

import { ImagePro } from '../ImagePro'

import {
  useGuardAppId,
  useGuardEvents,
  useGuardFinallyConfig,
  useGuardHttpClient,
  useGuardInitData,
  useGuardModule,
  useGuardPublicConfig
} from '../_utils/context'

import { ValidityVerifyInitData } from './interface'

import { useGuardView } from '../Guard/core/hooks/useGuardView'

import { SendCodeBtn } from '../SendCode/SendCodeBtn'

import { CodeAction, getVersion, i18n, useGuardHttp } from '../_utils'

import { requestClient } from '../_utils/http'

import { useDeviceId } from '../Guard/core/hooks/useDeviceId'

import { useGuardAuthClient } from '../Guard/authClient'

import { Button } from 'shim-antd'

const { useEffect, useState } = React

export const GuardValidityVerifyView: React.FC = () => {
  const { t } = useTranslation()

  const { post } = useGuardHttp()

  const { responseIntercept } = useGuardHttpClient()

  const appId = useGuardAppId()

  const deviceId = useDeviceId()

  const { host } = useGuardFinallyConfig()

  const client = useGuardAuthClient()

  const events = useGuardEvents()

  const initData = useGuardInitData<ValidityVerifyInitData>()
  console.log('GuardValidityVerifyView initData', initData)

  const [verifyStatus, setVerifyStatus] = useState<
    'verified' | 'expired' | 'verifying'
  >('verifying')

  const { changeModule } = useGuardModule()

  const publicConfig = useGuardPublicConfig()

  const resolvedLanguage = i18n.resolvedLanguage ?? i18n.language

  useGuardView()

  const { email, ticket, frequency } = initData ?? {}

  const cdnBase = publicConfig?.cdnBase

  // 开始轮训请求 email verify status
  const checkEmailVerifyStatus = async () => {
    // 得到结果后 根据结果判断是否轮训还是结束轮休

    const version = getVersion()
    const api = `${host}/api/v2/login/check-verify-email`

    const fetchRes = await fetch(api, {
      method: 'POST',
      body: JSON.stringify({
        ticket
      }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        [requestClient.langHeader]: resolvedLanguage,
        'x-authing-userpool-id': publicConfig.userPoolId,
        'x-authing-app-id': appId,
        'x-authing-sdk-version': version,
        'x-authing-request-from': `Guard@${version}`,
        ...(deviceId && { 'x-authing-device-id': deviceId })
      }
    })
    const res = await fetchRes.json()
    const data = res.data

    setVerifyStatus(data?.status ?? 'verifying')

    if (data?.status === 'verified') {
      const timer = setTimeout(() => {
        const {
          code,
          data: loginRes,
          onGuardHandling,
          message
        } = responseIntercept(data.result)
        if (code === 200) {
          events?.onLogin?.(loginRes, client)
        } else {
          const handMode = onGuardHandling?.()
          handMode === CodeAction.RENDER_MESSAGE &&
            events?.onLoginError?.({
              code,
              data: loginRes,
              message
            })
        }
        clearTimeout(timer)
      }, 2000)
      return
    } else if (data?.status === 'expired') {
      return
    } else {
      // 继续轮训
      let timer = setTimeout(async () => {
        await checkEmailVerifyStatus()
        clearTimeout(timer)
      }, frequency || 500)
    }
  }

  const resendEmailVerify = async () => {
    const res = await post('/api/v2/login/resend-verify-email', {
      ticket
    })
    if (res.code === 200) {
      return true
    } else {
      res.onGuardHandling?.()
      return false
    }
  }

  useEffect(() => {
    checkEmailVerifyStatus()
  }, [])

  return (
    <div className="g2-view-container g2-validity-verify-view">
      <div className="g2-validity-verify-view-content">
        <ImagePro
          className="plate"
          src={`${cdnBase}/questions-send-ok.png`}
          alt=""
          height={120}
        />
        <div className="title">
          {verifyStatus === 'verified'
            ? t('login.verifyEmailSuccess')
            : t('login.verifyEmailConstruct', {
                email: email || ''
              })}
        </div>
        {verifyStatus === 'verifying' && (
          <div className="message">{t('login.verifyEmailCheck')}</div>
        )}

        {verifyStatus === 'verifying' && (
          <SendCodeBtn
            sendDesc={t('login.verifyEmailResend') as string}
            retryDesc={(time: number) => {
              return t('login.verifyEmailResendCountdown', {
                time: time.toString()
              })
            }}
            beforeSend={async () => await resendEmailVerify()}
            type="link"
          />
        )}
        {verifyStatus === 'expired' && (
          <div className="message">
            {t('login.verifyEmailExpired')}
            <Button
              type="link"
              onClick={() => changeModule?.(GuardModuleType.LOGIN)}
            >
              {t('login.verifyEmailExpiredAction')}
            </Button>
          </div>
        )}
        {verifyStatus === 'verified' && (
          <div className="message">{t('login.verifyEmailSuccessAction')}</div>
        )}
      </div>
    </div>
  )
}
