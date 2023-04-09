import { Tabs } from 'shim-antd'

import { React } from 'shim-react'

import { GuardModuleType } from '../Guard/module'

import { BackCustom, BackLogin } from '../Back'

import { useGuardAuthClient } from '../Guard/authClient'

import { LoginWithPassword } from '../Login/core/withPassword'

import { LoginWithVerifyCode } from '../Login/core/withVerifyCode'

import { PasswordLoginMethods } from '../Type/application'

import {
  useGuardEvents,
  useGuardFinallyConfig,
  useGuardInitData,
  useGuardModule,
  useGuardPublicConfig
} from '../_utils/context'

import { fallbackLng, i18n } from '../_utils'

import { useTranslation } from 'react-i18next'

import { IdentityBindingBusinessAction, useIdentityBindingBusinessRequest } from './businessRequest'

import { GuardIdentityBindingInitData } from './interface'

import './styles.less'

import { useGuardView } from '../Guard/core/hooks/useGuardView'

const { useMemo } = React

export const GuardIdentityBindingView: React.FC<{
  skipAsk?: boolean // 是否跳过询问页面
}> = ({ skipAsk = false }) => {
  const initData = useGuardInitData<GuardIdentityBindingInitData>()

  const config = useGuardFinallyConfig()

  const { backModule } = useGuardModule()

  useGuardView()

  const { t } = useTranslation()

  const events = useGuardEvents()

  const { publicKey, agreementEnabled } = config

  const publicConfig = useGuardPublicConfig()

  const isInternationSms = publicConfig?.internationalSmsConfig?.enabled || false

  const authClient = useGuardAuthClient()
  const bindType = skipAsk ? 'register' : 'bind'
  const phoneCodeRequest =
    useIdentityBindingBusinessRequest(bindType)[IdentityBindingBusinessAction.PhoneCode]
  const emailCodeRequest =
    useIdentityBindingBusinessRequest(bindType)[IdentityBindingBusinessAction.EmailCode]
  const PasswordRequest =
    useIdentityBindingBusinessRequest(bindType)[IdentityBindingBusinessAction.Password]

  const bindMethodsMap = {
    'phone-code': async (data: any) => {
      const { identity, code, phoneCountryCode } = data

      const options: any = {
        phone: identity,
        code
      }

      if (isInternationSms) {
        options.phoneCountryCode = phoneCountryCode
      }
      return await phoneCodeRequest(options)
    },
    'email-code': async (data: any) => {
      const { identity: email, code } = data
      return await emailCodeRequest({ email, code })
    },
    password: async (data: any) => {
      const { identity: account, password } = data

      const encrypt = authClient.options.encryptFunction

      const captchaCode = data.captchaCode && data.captchaCode.trim()

      const encryptPassword = await encrypt!(password, publicKey!)

      return await PasswordRequest({
        account,
        password: encryptPassword,
        captchaCode
      })
    }
  }

  const onLoginSuccess = (data: any) => {
    events?.onBinding?.(data, authClient!) // 绑定成功

    events?.onLogin?.(data, authClient!) // 登录成功
  }

  const onLoginFailed = (code: number, data: any, message?: string) => {
    events?.onBindingError?.({
      code,
      data,
      message
    })
    events?.onLoginError?.({
      code,
      data,
      message
    })
  }

  const onBind = async (loginInfo: any) => {
    const { type, data } = loginInfo

    const res = await bindMethodsMap[type as 'phone-code' | 'email-code' | 'password']?.(data)

    const { isFlowEnd } = res

    if (isFlowEnd) {
      // 🤮 TODO 日后必要优化
      return {
        ...res,
        apiCode: 200,
        code: 200
      }
    }

    return res
  }

  const agreements = useMemo(
    () =>
      agreementEnabled
        ? config?.agreements?.filter(
          agree =>
            fallbackLng(i18n.language).find(lng => lng.includes(agree.lang)) &&
              !!agree?.availableAt
        ) ?? []
        : [],
    [agreementEnabled, config?.agreements, i18n.language]
  )

  const passwordLoginMethods = useMemo<PasswordLoginMethods[]>(() => {
    const loginMethodsBase = ['username-password', 'email-password', 'phone-password']

    // @ts-ignore
    return initData.methods.filter(method =>
      loginMethodsBase.includes(method)
    ) as PasswordLoginMethods[]
  }, [initData.methods])

  const codeLoginMethods = useMemo(() => {
    const loginMethodsBase = ['email-code', 'phone-code']

    return initData.methods.filter(method => loginMethodsBase.includes(method))
  }, [initData.methods])

  const bindText = useMemo(() => {
    if (skipAsk) {
      return `${t('common.bind')} / ${t('common.register')}`
    }
    return t('common.bind')
  }, [skipAsk, t])

  const methods = [
    {
      key: 'code',
      title: t('common.verifyCodeLogin'),
      component: (
        <LoginWithVerifyCode
          verifyCodeLength={publicConfig?.verifyCodeLength}
          autoRegister={!!skipAsk}
          onLoginRequest={onBind}
          // onLogin={onLogin}
          onLoginSuccess={onLoginSuccess}
          onLoginFailed={onLoginFailed}
          agreements={agreements}
          methods={codeLoginMethods}
          submitButText={bindText}
        />
      )
    },
    {
      key: 'password',
      title: t('login.bindPwdLogin'),
      component: (
        <LoginWithPassword
          publicKey={publicKey!}
          autoRegister={!!skipAsk}
          host={config.host}
          onLoginRequest={onBind}
          passwordLoginMethods={passwordLoginMethods}
          // onLogin={onLogin}
          onLoginSuccess={onLoginSuccess}
          onLoginFailed={onLoginFailed}
          agreements={agreements}
          submitButText={bindText}
        />
      )
    }
  ]

  const renderBack = useMemo(() => {
    if (initData.source === GuardModuleType.IDENTITY_BINDING_ASK)
      return <BackCustom onBack={() => backModule?.()}>{/* {t('common.back')} */}</BackCustom>

    return <BackLogin />
  }, [backModule, initData.source])

  return (
    <div className="g2-view-container g2-view-identity-binding">
      {renderBack}

      <div className="g2-view-identity-binding-content">
        <div className="g2-view-identity-binding-content-logo">
          <img src={config?.logo} alt="" className="logo" />
        </div>
        <div className="g2-view-identity-binding-content-title">
          <span>
            {skipAsk ? t('common.identityBindingSkipAskTitle') : t('common.identityBindingTitle')}
          </span>
        </div>
        <div className="g2-view-identity-binding-content-desc">
          <span>
            {skipAsk ? t('common.identityBindingSkipAskDesc') : t('common.identityBindingDesc')}
          </span>
        </div>
        <div className="g2-view-identity-binding-content-login">
          <Tabs className="g2-view-tabs" centered>
            {methods
              .filter(method => {
                if (method.key === 'password') return passwordLoginMethods.length !== 0

                if (method.key === 'code') return codeLoginMethods.length !== 0

                return true
              })
              .map(method => (
                <Tabs.TabPane key={method.key} tab={method.title}>
                  {method.component}
                </Tabs.TabPane>
              ))}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
