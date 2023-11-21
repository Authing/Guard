import { message } from 'shim-antd'

import '@antd-es-style/message/style/index.less'

import { User } from 'authing-js-sdk'

import { React } from 'shim-react'

import { useAsyncFn } from 'react-use'

import { ErrorCode } from '../_utils/GuardErrorCode'

import { useGuardHttp } from '../_utils/guardHttp'

import { useGuardAuthClient } from '../Guard/authClient'

import { GuardModuleType } from '../Guard/module'

import { ShieldSpin, Spin } from '../ShieldSpin'

import { BindSuccess } from './core/bindSuccess'

import { SecurityCode } from './core/securityCode'

import { GuardBindTotpInitData } from './interface'

import { useTranslation } from 'react-i18next'

import './styles.less'

import {
  useGuardEvents,
  useGuardInitData,
  useGuardIsAuthFlow,
  useGuardModule
} from '../_utils/context'

import { MFAType } from '../MFA/interface'

import { BackCustom } from '../Back'

import { useGuardView } from '../Guard/core/hooks/useGuardView'

enum BindTotpType {
  SECURITY_CODE = 'securityCode',
  BIND_SUCCESS = 'bindSuccess'
}

const { useEffect, useMemo, useState } = React

export const GuardBindTotpView: React.FC = () => {
  const initData = useGuardInitData<GuardBindTotpInitData>()

  const events = useGuardEvents()

  const { changeModule } = useGuardModule()

  const { get, post } = useGuardHttp()

  const isAuthFlow = useGuardIsAuthFlow()

  useGuardView()

  const { t } = useTranslation()

  const [secret, setSecret] = useState('')

  const [qrcode, setQrcode] = useState('')

  const [user, setUser] = useState<User>()

  const [bindTotpType, setBindTotpType] = useState<BindTotpType>(
    BindTotpType.SECURITY_CODE
  )

  const authClient = useGuardAuthClient()

  const [bindInfo, fetchBindInfo] = useAsyncFn(async () => {
    const query = {
      // type: 'totp',
      source: 'APPLICATION'
    }
    const config = {
      headers: {
        authorization: initData.mfaToken
      }
    }

    try {
      const { code, message: msg } = await get<any>(
        '/api/v2/mfa/authenticator',
        query,
        config
      )
      if (code === ErrorCode.LOGIN_INVALID) {
        message.error(msg)
        changeModule?.(GuardModuleType.LOGIN, {})
        return
      }
    } catch (error: any) {
      message.error(error?.message)
    }

    try {
      const { data, code, onGuardHandling } = await post<any>(
        '/api/v2/mfa/totp/associate',
        query,
        config
      )
      if (code === 200) {
        setSecret(data.recovery_code)
        setQrcode(data.qrcode_data_url)
      } else {
        onGuardHandling?.()
      }
    } catch (error: any) {
      message.error(error?.message)
    }
  }, [])

  const onBind = (resUser?: User) => {
    if (isAuthFlow && resUser) {
      events?.onLogin?.(resUser, authClient)
    } else {
      if (user) {
        events?.onLogin?.(user, authClient)
      }
    }
  }

  const onNext = (user?: User) => {
    if (isAuthFlow) {
      setBindTotpType(BindTotpType.BIND_SUCCESS)
    } else {
      setUser(user)
      setBindTotpType(BindTotpType.BIND_SUCCESS)
    }
  }

  useEffect(() => {
    fetchBindInfo()
  }, [fetchBindInfo])

  const renderContent = useMemo<
    Record<BindTotpType, (props: any) => React.ReactNode>
  >(
    () => ({
      [BindTotpType.SECURITY_CODE]: props => <SecurityCode {...props} />,
      [BindTotpType.BIND_SUCCESS]: props => <BindSuccess {...props} />
    }),
    []
  )

  const renderBack = useMemo(() => {
    const onBack = () => {
      changeModule?.(GuardModuleType.MFA, {
        ...initData,
        current: MFAType.TOTP
      })
    }

    return <BackCustom onBack={onBack}>{t('common.backToVerify')}</BackCustom>
  }, [changeModule, initData, t])

  return (
    <>
      {bindInfo.loading ? (
        <Spin />
      ) : (
        <div className="g2-view-container g2-bind-totp">
          {renderBack}
          <div className="g2-mfa-content g2-mfa-bindTotp">
            {bindInfo.loading ? (
              <ShieldSpin />
            ) : (
              renderContent[bindTotpType]({
                mfaToken: initData.mfaToken,
                qrcode,
                secret,
                onBind,
                onNext,
                changeModule: changeModule
              })
            )}
          </div>
        </div>
      )}
    </>
  )
}
