import { React } from 'shim-react'
import {
  useGuardEvents,
  useGuardFinallyConfig,
  useGuardInitData,
  useGuardModule
} from '../../_utils/context'
import { useGuardView } from '../..'
import { GoBack } from '../components/GoBack'
import { ScanCodeScene } from './core/ScanCode'
import { EmailVerifyScene } from './core/EmailVerify'
import { useGuardAuthClient } from '../../Guard/authClient'
import { GuardModuleType } from '../../Guard'
import { ChangeLanguage } from '../../ChangeLanguage'

const { useCallback, useState } = React

export interface GuardLoginInitData {
  scene: 'password' | 'qrcode' | 'verifyCode'
  noBack: boolean
  verifyAccount?: string
}

export const EyGuardLoginView = () => {
  useGuardView()

  const { changeModule } = useGuardModule()

  const config = useGuardFinallyConfig()

  const events = useGuardEvents()

  const initData = useGuardInitData<GuardLoginInitData>()

  const client = useGuardAuthClient()

  const [refreshQrcode, setRefreshQrcode] = useState<number>(0)

  const onLangChangeEnhance = useCallback(
    lang => {
      events?.onLangChange?.(lang)
      setRefreshQrcode(prev => prev + 1)
    },
    [events]
  )

  const onBeforeLogin = useCallback(
    (loginInfo: any) => {
      if (events?.onBeforeLogin) {
        return events?.onBeforeLogin?.(loginInfo, client)
      }
      return () => console.log('Guard not onBeforeLogin hooks')
    },
    [client, events]
  )

  const onLoginSuccess = useCallback(
    (data: any, message?: string) => {
      events?.onLogin?.(data, client)
    },
    [client, events]
  )

  const onLoginFailed = useCallback(
    (code: number, data: any, message?: string) => {
      // TODO 与拦截器中 render-message 同步
      // const action = codeMap[code]
      // if (action?.action === 'message') {
      //   setErrorNumber(errorNumber + 1)
      // }

      // if (action?.action === 'accountLock') {
      //   setAccountLock(true)
      // }

      events?.onLoginError?.({
        code,
        data,
        message
      })
    },
    [events]
  )

  const renderScene = useCallback(() => {
    switch (initData.scene) {
      case 'password':
      case 'verifyCode':
        return (
          <EmailVerifyScene
            scene={initData.scene}
            onBeforeLogin={onBeforeLogin}
            onLoginFailed={onLoginFailed}
            onLoginSuccess={onLoginSuccess}
          />
        )
      case 'qrcode':
        return (
          <ScanCodeScene
            onBeforeLogin={onBeforeLogin}
            onLoginFailed={onLoginFailed}
            onLoginSuccess={onLoginSuccess}
            refreshQrcode={refreshQrcode}
          />
        )
      default:
        return (
          <EmailVerifyScene
            scene={initData.scene}
            onBeforeLogin={onBeforeLogin}
            onLoginFailed={onLoginFailed}
            onLoginSuccess={onLoginSuccess}
          />
        )
    }
  }, [
    initData.scene,
    onBeforeLogin,
    onLoginFailed,
    onLoginSuccess,
    refreshQrcode
  ])

  return (
    <div className="g2-view-container g2-view-login">
      <div className="g2-view-container-inner">
        <div className="g2-view-header">
          {!initData?.noBack && (
            <>
              <GoBack
                clickHandle={() => {
                  changeModule?.(GuardModuleType.EY_PRE_CHECK_EMAIL)
                }}
              />
              <div style={{ height: 24 }}></div>
            </>
          )}
          <img src={config?.logo} alt="" className="icon" />
          <div className="title">{config?.title}</div>
        </div>
        {renderScene()}
        <ChangeLanguage
          langRange={config?.langRange}
          onLangChange={onLangChangeEnhance}
        />
      </div>
    </div>
  )
}
