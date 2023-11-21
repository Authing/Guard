import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { GuardModuleType } from '../Guard/module'

import { MFAEmail } from './core/email'

import { MFASms } from './core/sms'

import { MFAFace } from './core/face'

import { MFATotp } from './core/totp'

import { MFAMethods } from './mfaMethods'

import { GuardMFAInitData, MFAType } from './interface'

import { useGuardAuthClient } from '../Guard/authClient'

import { codeMap } from './codemap'

import './styles.less'

import { message } from 'shim-antd'

import '@antd-es-style/message/style/index.less'

import {
  useGuardEvents,
  useGuardFinallyConfig,
  useGuardInitData,
  useGuardModule
} from '../_utils/context'

import { BackCustom, BackLogin } from '../Back'

import { ChangeLanguage } from '../ChangeLanguage'

import { useGuardView } from '../Guard/core/hooks/useGuardView'

import { MFABackStateContext } from './context'

const { useMemo, useState } = React

const ComponentsMapping: Record<MFAType, (props: any) => React.ReactNode> = {
  [MFAType.EMAIL]: ({ config, initData, mfaLogin }) => (
    <MFAEmail
      config={config}
      mfaToken={initData.mfaToken}
      email={initData.mfaEmail}
      mfaLogin={mfaLogin}
    />
  ),
  [MFAType.SMS]: ({ config, initData, mfaLogin }) => (
    <MFASms config={config} initData={initData} mfaLogin={mfaLogin} />
  ),
  [MFAType.TOTP]: ({ initData, config, changeModule, mfaLogin }) => (
    <MFATotp
      changeModule={changeModule}
      config={config}
      initData={initData}
      mfaLogin={mfaLogin}
    />
  ),
  [MFAType.FACE]: ({ config, initData, mfaLogin, setShowMethods }) => (
    <MFAFace
      config={config}
      initData={initData}
      mfaLogin={mfaLogin}
      setShowMethods={setShowMethods}
    />
  )
}

export const GuardMFAView: React.FC = () => {
  const initData = useGuardInitData<GuardMFAInitData>()

  const config = useGuardFinallyConfig()

  const { changeModule } = useGuardModule()

  useGuardView()

  const events = useGuardEvents()

  const [currentMethod, setCurrentMethod] = useState(
    initData.current ??
      initData.applicationMfa?.sort((a, b) => a.sort - b.sort)[0].mfaPolicy
  )

  const [mfaBackState, setMfaBackState] = useState<string>('login')
  const [showMethods, setShowMethods] = useState(true)
  const client = useGuardAuthClient()
  const { t } = useTranslation()

  const __codePaser = (code: number, msg?: string) => {
    const action = codeMap[code]

    if (code === 200) {
      return (data: any) => {
        events?.onLogin?.(data, client!) // 登录成功
      }
    }

    if (!action) {
      return (data: any) => {
        console.error('not catch code', code)
        // message.error(data.message)
      }
    }

    // 解析成功
    if (action?.action === 'changeModule') {
      let m = action.module ? action.module : GuardModuleType.ERROR
      let init = action.initData ? action.initData : {}
      return (initData?: any) => changeModule?.(m, { ...initData, init })
    }
    if (action?.action === 'insideFix') {
      return () => {}
    }

    if (action?.action === 'message') {
      return (data: any) => {
        data.message ? message.error(data.message) : message.error(msg)
      }
    }

    // 最终结果
    return () => {
      console.error('last action at mfaview')
    }
  }

  const mfaLogin = (code: any, data: any, message?: string) => {
    const callback = __codePaser?.(code, message)

    if (!data) {
      data = {}
    }

    data.__message = message

    callback?.(data)
  }

  const renderBack = useMemo(() => {
    if (currentMethod === MFAType.FACE && mfaBackState === 'check') {
      return (
        <BackCustom
          onBack={() => {
            setCurrentMethod(
              initData.applicationMfa.find(
                item => item.mfaPolicy === MFAType.FACE
              )
                ? MFAType.FACE
                : initData.applicationMfa?.sort((a, b) => a.sort - b.sort)[0]
                    .mfaPolicy
            )
            setShowMethods(true)
            setMfaBackState('login')
          }}
        >
          {t('common.backToVerify')}
        </BackCustom>
      )
    }

    return <BackLogin />
  }, [currentMethod, initData.applicationMfa, mfaBackState, t])

  return (
    // 返回验证页和返回登录页 需要获取内部 face 模式下的状态
    <MFABackStateContext.Provider
      value={{ setMfaBackState: setMfaBackState, mfaBackState: mfaBackState }}
    >
      <div className="g2-view-container g2-view-mfa">
        {renderBack}
        <div className="g2-mfa-content">
          {ComponentsMapping[currentMethod]({
            config: config,
            initData: initData,
            changeModule: changeModule,
            mfaLogin: mfaLogin,
            setShowMethods: setShowMethods
          })}
        </div>
        {showMethods && (
          <MFAMethods
            method={currentMethod}
            onChangeMethod={type => {
              setCurrentMethod(type)
            }}
          />
        )}
        <ChangeLanguage
          langRange={config?.langRange}
          onLangChange={events?.onLangChange}
        />
      </div>
    </MFABackStateContext.Provider>
  )
}
