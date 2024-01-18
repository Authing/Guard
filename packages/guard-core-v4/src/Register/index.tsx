import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { Tabs } from 'shim-antd'

import { ChangeLanguage } from '../ChangeLanguage'

import { useGuardAuthClient } from '../Guard/authClient'

import { GuardModuleType } from '../Guard/module'

import { RegisterWithEmail } from './core/WithEmail'

import { RegisterWithCode } from './core/WithCode'

import {
  getI18nLabel,
  getLoginTypePipe,
  getSortTabs,
  transformMethod
} from '../_utils'

import { fallbackLng, i18n } from '../_utils/locales'

import {
  useGuardDefaultLanguage,
  useGuardEvents,
  useGuardFinallyConfig,
  useGuardModule,
  useGuardPublicConfig
} from '../_utils/context'

import { GuardLoginInitData } from '../Login/interface'

import {
  RegisterMethods,
  RegisterSortMethods,
  TabFieldsI18nItem
} from '../Type/application'

import { useGuardView } from '../Guard/core/hooks/useGuardView'

const { useEffect, useMemo, useState } = React

export const GuardRegisterView: React.FC = () => {
  const events = useGuardEvents()

  const config = useGuardFinallyConfig()

  const { changeModule } = useGuardModule()

  const { t } = useTranslation()
  const agreementEnabled = config?.agreementEnabled
  const { langRange } = config
  const authClient = useGuardAuthClient()

  const publicConfig = useGuardPublicConfig()

  const defaultLanguageConfig = useGuardDefaultLanguage()

  const verifyRegisterMethods = useMemo<string[]>(() => {
    const verifyLoginMethods = []
    const { registerMethods } = config
    if (registerMethods?.includes(RegisterMethods.EmailCode)) {
      verifyLoginMethods.push('email-code')
    }
    if (registerMethods?.includes(RegisterMethods.Phone)) {
      verifyLoginMethods.push('phone-code')
    }

    return verifyLoginMethods
  }, [config])

  const registerContextProps = useMemo(
    () => ({
      onRegisterSuccess: (
        data: any = {},
        registerInfo: {
          registerFrom: RegisterMethods
          account: string
        }, //以何种方式注册成功
        message?: string
      ) => {
        const initData = getLoginTypePipe(
          publicConfig,
          registerInfo.registerFrom
        )
        const loginInitData: GuardLoginInitData = {}
        if (initData) {
          loginInitData.specifyDefaultLoginMethod =
            initData.specifyDefaultLoginMethod

          initData?.lockMethod &&
            (loginInitData._lockMethod = initData.lockMethod)

          loginInitData._firstItemInitialValue = registerInfo.account
        }
        events?.onRegister?.(data, authClient)
        changeModule?.(GuardModuleType.LOGIN, loginInitData)
      },
      onRegisterFailed: (code: number, data: any = {}, message?: string) => {
        // if (message) Message.error(message)

        events?.onRegisterError?.({
          code,
          data,
          message
        })
      },
      registeContext: config.registerContext,
      onBeforeRegister: events?.onBeforeRegister,
      //availableAt 0或者null-注册时，1-登录时，2-注册和登录时
      agreements: agreementEnabled
        ? config?.agreements?.filter(
            agree =>
              fallbackLng(i18n.resolvedLanguage).find(lng =>
                lng.includes(agree.lang)
              ) && agree?.availableAt !== 1
          ) ?? []
        : [],
      publicConfig: publicConfig,
      methods: verifyRegisterMethods
    }),
    [
      agreementEnabled,
      config?.agreements,
      events?.onBeforeRegister,
      i18n.resolvedLanguage,
      verifyRegisterMethods
    ]
  )

  const tabMapping: Record<
    string,
    { component: React.ReactNode; name: string }
  > = useMemo(() => {
    let verifyCodeLogin = ''
    if (verifyRegisterMethods.length > 1) {
      verifyCodeLogin = t('common.verifyCodeRegister')
    } else {
      if (verifyRegisterMethods.includes('phone-code')) {
        verifyCodeLogin = t('common.phoneVerifyCode')
      } else if (verifyRegisterMethods.includes('email-code')) {
        verifyCodeLogin = t('common.emailVerifyCode')
      } else {
        verifyCodeLogin = t('common.verifyCodeRegister')
      }
    }
    return {
      [RegisterSortMethods.Email]: {
        component: <RegisterWithEmail {...registerContextProps} />,
        name: t('common.EmailRegister')
      },
      [RegisterSortMethods.Phone]: {
        component: <RegisterWithCode {...registerContextProps} />,
        name: verifyCodeLogin
      }
    }
  }, [registerContextProps, t, verifyRegisterMethods])

  // i18nFields 数据
  const i18nFields = useMemo(() => {
    const i18nMap = new Map<string, TabFieldsI18nItem>()
    publicConfig.tabMethodsFields.forEach(item => {
      i18nMap.set(item.key, item)
    })
    return i18nMap
  }, [publicConfig.tabMethodsFields])

  const [activeKey, setActiveKey] = useState<string>('')

  const defaultMethod = useMemo(() => {
    return (
      config.defaultRegisterMethod &&
      transformMethod(config.defaultRegisterMethod)
    )
  }, [config.defaultRegisterMethod])

  useEffect(() => {
    if (defaultMethod) {
      setActiveKey(defaultMethod)
    }
  }, [defaultMethod])

  useGuardView({
    currentTab: activeKey,
    changeTab: setActiveKey
  })

  const renderTab = useMemo(() => {
    const { registerMethods = [] } = config

    // registerMethods 处理，改版后支持自定义 method
    const filterRegisterMethods = [
      ...new Set(
        [...registerMethods]?.map(method => {
          return transformMethod(method)
        })
      )
    ]

    return getSortTabs(filterRegisterMethods, defaultMethod).map(method => {
      const tab = tabMapping[method]
      const name = getI18nLabel(method, i18nFields, defaultLanguageConfig)
      return (
        <Tabs.TabPane
          tab={tab?.name || t('common.registerTab', { text: name })}
          key={method}
        >
          {tab?.component || (
            <RegisterWithEmail
              label={name}
              method={method}
              {...registerContextProps}
            />
          )}
        </Tabs.TabPane>
      )
    })
  }, [
    config,
    tabMapping,
    publicConfig,
    defaultMethod,
    i18nFields,
    i18n.resolvedLanguage,
    registerContextProps,
    defaultLanguageConfig,
    t
  ])

  return (
    <div className="g2-view-container g2-view-register">
      <div className="g2-view-container-inner">
        <div className="g2-view-header">
          <img src={config?.logo} alt="" className="icon" />

          <div className="title">{config?.title}</div>
        </div>
        <div className="g2-view-tabs">
          <Tabs
            destroyInactiveTabPane={true}
            activeKey={activeKey}
            onChange={(activeKey: string) => {
              setActiveKey(activeKey)
              events?.onRegisterTabChange?.(activeKey as RegisterMethods)
            }}
          >
            {renderTab}
          </Tabs>
        </div>
        <div className="g2-tips-line">
          <span className="back-to-login">
            {/* <span className="gray">{t('common.alreadyHasAcc')}</span> */}
            <span
              className="link-like"
              onClick={() => changeModule?.(GuardModuleType.LOGIN, {})}
            >
              {t('common.backLoginPage')}
            </span>
          </span>
        </div>
      </div>
      <ChangeLanguage
        langRange={langRange}
        onLangChange={events?.onLangChange}
      />
    </div>
  )
}
