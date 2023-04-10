import { React } from 'shim-react'

import { i18n, fallbackLng } from '../_utils'

import { useTranslation } from 'react-i18next'

import { message, Tabs, Tag, Tooltip, Space } from 'shim-antd'

import intersection from 'lodash/intersection'

import { LoginWithPassword } from './core/withPassword/index'

import { LoginWithLDAP } from './core/withLDAP'

import { LoginWithAD } from './core/withAD'

import { LoginWithAppQrcode } from './core/withAppQrcode'

import { LoginWithWechatMiniQrcode } from './core/withWechatMiniQrcode'

import { LoginWithWechatmpQrcode } from './core/withWechatmpQrcode'

import { codeMap } from './codemap'

import { SocialLogin } from './socialLogin'

import { MultipleAccounts } from './multipleAccounts'

import { ResetAccountName } from './resetAccountName'

import { GuardModuleType } from '../Guard/module'

import { IconFont } from '../IconFont'

import { ChangeLanguage } from '../ChangeLanguage'

import './styles.less'

import {
  useGuardAppId,
  useGuardEvents,
  useGuardFinallyConfig,
  useGuardInitData,
  useGuardModule,
  useGuardPublicConfig,
  useGuardTenantProvider
} from '../_utils/context'

import { getPasswordIdentify, getSortTabs } from '../_utils'

import { LoginWithVerifyCode } from './core/withVerifyCode'

import { useMediaSize, useMethod } from '../_utils/hooks'

import { getGuardDocument } from '../_utils/guardDocument'

import { useGuardAuthClient } from '../Guard/authClient'

import { GuardLoginInitData } from './interface'

import { GuardButton } from '../GuardButton'

import { LoginMethods, QrCodeItem, VerifyLoginMethods } from '../Type/application'

import { useLoginMultiple } from './hooks/useLoginMultiple'

import { useGuardView } from '../Guard/core/hooks/useGuardView'

import { LoginWithAuthingOtpPush } from './core/withAuthingOtpPush/index'
import { BackLogin } from '../Back'

const { useEffect, useLayoutEffect, useState, useRef, useMemo, useCallback } = React

const inputWays = [
  LoginMethods.Password,
  LoginMethods.PhoneCode,
  LoginMethods.AD,
  LoginMethods.LDAP,
  LoginMethods.AuthingOtpPush
]
const qrcodeWays = [LoginMethods.AppQr, LoginMethods.WxMinQr, LoginMethods.WechatMpQrcode]

const useMethods = (config: any) => {
  let dlm = config?.defaultLoginMethod
  const propsMethods = config?.loginMethods
  if (!propsMethods?.includes(dlm)) {
    dlm = propsMethods?.[0]
  }
  const renderInputWay = intersection(propsMethods, inputWays).length > 0
  const renderQrcodeWay = intersection(propsMethods, qrcodeWays).length > 0
  return [dlm, renderInputWay, renderQrcodeWay]
}

const useDisables = (data: any) => {
  let { disableResetPwd, disableRegister } = data.config
  const { loginWay, autoRegister } = data

  if (loginWay === LoginMethods.PhoneCode) {
    disableResetPwd = true
  }
  if ([LoginMethods.LDAP, LoginMethods.AuthingOtpPush].includes(loginWay)) {
    disableResetPwd = true
    disableRegister = true
  }
  if (loginWay === LoginMethods.AD) {
    // TODO P0 需求暂时先取消掉
    // disableResetPwd = true
    disableRegister = true
  }
  if (autoRegister === true) {
    disableRegister = true
  }
  return { disableResetPwd, disableRegister }
}

const useSwitchStates = (loginWay: LoginMethods) => {
  let switchText = i18n.t('login.scanLogin')
  if (qrcodeWays.includes(loginWay)) {
    switchText = i18n.t('login.moreWays')
  }
  const inputNone = !inputWays.includes(loginWay) ? 'none' : ''
  const qrcodeNone = !qrcodeWays.includes(loginWay) ? 'none' : ''

  return { switchText, inputNone, qrcodeNone }
}

const computedTabName = (str: string) => {
  if (str.length > 20) {
    return `${str.substring(0, 20)}...`
  }
  return str
}

export const GuardLoginView: React.FC<{ isResetPage?: boolean }> = ({ isResetPage = false }) => {
  const { specifyDefaultLoginMethod } = useGuardInitData<GuardLoginInitData>()

  const config = useGuardFinallyConfig()

  const appId = useGuardAppId()

  const { changeModule } = useGuardModule()

  const events = useGuardEvents()

  const publicConfig = useGuardPublicConfig()

  const [defaultMethod, renderInputWay, renderQrcodeWay] = useMethods(config)

  const agreementEnabled = config?.agreementEnabled

  const { t } = useTranslation()

  const [loginWay, setLoginWay] = useState(specifyDefaultLoginMethod || defaultMethod)

  useGuardView({
    currentTab: loginWay,
    changeTab: setLoginWay
  })

  const { defaultQrWay, backfillData, multipleInstance, isMultipleAccount, referMultipleState } =
    useLoginMultiple(setLoginWay)

  const [canLoop, setCanLoop] = useState(false) // 允许轮询

  const client = useGuardAuthClient()

  const qrcodeTabsSettings = publicConfig?.qrcodeTabsSettings

  const [errorNumber, setErrorNumber] = useState(0)

  const [accountLock, setAccountLock] = useState(false)

  const identifyRef = useRef<Record<string, string>>({} as any)

  const tenantProvider = useGuardTenantProvider()

  /** 页面相关标签 */
  const tags = useMemo(() => {
    return (
      [
        tenantProvider?.isTenantConsole() && {
          name: i18n.t('login.tenant.consoleManage')
        },
        tenantProvider?.isTenantSSOLaunchPad() && {
          name: t('login.tenant.ssoPad')
        }
      ] as Array<{
        name: string
        color?: string
        backgroundColor?: string
      }>
    ).filter(Boolean)
  }, [t, tenantProvider])

  const publicKey = config?.publicKey as string

  // let autoRegister = props.config?.autoRegister
  const ms = config?.loginMethods

  const firstInputWay = inputWays.filter(way => ms?.includes(way))[0]

  const firstQRcodeWay = qrcodeWays.filter(way => ms?.includes(way))[0]

  const { disableResetPwd, disableRegister } = useDisables({
    config: config,
    loginWay,
    autoRegister: config?.autoRegister
  })

  const hiddenTab = useMemo(() => {
    const scanLogins = ms ? ms.filter(method => qrcodeWays.includes(method)) : [] //取到扫码登录类型
    if (scanLogins.length > 1) {
      // 如果有两个以上的code 类型
      return false
    } else if (!scanLogins.includes(LoginMethods.AppQr)) {
      // 如果只有一个且那一个还不是 app 类型
      if (
        qrcodeTabsSettings &&
        (qrcodeTabsSettings?.[LoginMethods.WechatMpQrcode].length > 1 ||
          qrcodeTabsSettings?.[LoginMethods.WxMinQr].length > 1)
      ) {
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  }, [ms, qrcodeTabsSettings])

  const defaultQrCodeWay = useMemo(() => {
    // 如果存在多账号的二维码方式
    if (defaultQrWay) {
      return defaultQrWay
    }
    if ([LoginMethods.WechatMpQrcode, LoginMethods.WxMinQr].includes(defaultMethod)) {
      const id = qrcodeTabsSettings?.[defaultMethod as LoginMethods]?.find(
        (i: { id: string; title: string; isDefault?: boolean | undefined }) => i.isDefault
      )?.id
      return defaultMethod + id
    } else {
      return defaultMethod
    }
  }, [defaultQrWay, defaultMethod, qrcodeTabsSettings])

  const onLoginSuccess = useCallback(
    (data: any) => {
      events?.onLogin?.(data, client)
    },
    [client, events]
  )

  // 保存用户输入的手机号、邮箱，在点击 问题反馈时带上
  const saveIdentify = useCallback((type: LoginMethods, identity: string) => {
    identifyRef.current = {
      ...identifyRef.current,
      [type]: getPasswordIdentify(identity)
    }
  }, [])

  // 重置用户名页面
  useEffect(() => {
    if (isResetPage) {
      message.info({
        content: i18n.t('common.resetAccount.message'),
        className: 'g2-view-message-info'
      })
    }
  }, [isResetPage])

  const onLoginFailed = useCallback(
    (code: number, data: any, message?: string) => {
      // TODO 与拦截器中 render-message 同步
      const action = codeMap[code]
      if (action?.action === 'message') {
        setErrorNumber(errorNumber + 1)
      }

      if (action?.action === 'accountLock') {
        setAccountLock(true)
      }

      events?.onLoginError?.({
        code,
        data,
        message
      })
    },
    [errorNumber, events]
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

  useEffect(() => {
    if (qrcodeWays.includes(loginWay)) {
      setCanLoop(true)
    } else {
      setCanLoop(false)
    }
    // 可以设定 = fasle 的时候关闭 qrcode 的几个定时器
    // 不关的话，第二次进入会更快，也没什么代价（只有轮询）
  }, [loginWay])

  const { switchText, inputNone, qrcodeNone } = useSwitchStates(loginWay)
  //availableAt 0或者null-注册时，1-登录时，2-注册和登录时 注册登录合并时应该登录注册协议全部显示
  const agreements = useMemo(
    () =>
      agreementEnabled
        ? config?.agreements?.filter(
          agree =>
            fallbackLng(i18n.language).find(lng => lng.includes(agree.lang)) &&
              (config?.autoRegister || !!agree?.availableAt)
        ) ?? []
        : [],
    [agreementEnabled, config?.autoRegister, config?.agreements, i18n.language]
  )

  const verifyLoginMethods = useMemo<VerifyLoginMethods[]>(
    () => publicConfig?.verifyCodeTabConfig?.enabledLoginMethods ?? ['phone-code'],

    [publicConfig?.verifyCodeTabConfig?.enabledLoginMethods]
  )

  const [socialConnectionObjs, enterpriseConnectionObjs, isNoMethod] = useMethod({
    config,
    publicConfig
  })

  const noLoginMethods = !config?.loginMethods?.length

  const { isPhoneMedia } = useMediaSize()

  // 渲染前执行
  useLayoutEffect(() => {
    if (noLoginMethods && !isPhoneMedia) {
      // 无表单登录方式，且不是手机端
      const document = getGuardDocument()
      // pc 下
      const containerDOM = document.getElementsByClassName('g2-view-container')?.[0]

      if (containerDOM) {
        // @ts-ignore
        containerDOM.style['min-height'] = isNoMethod ? '456px' : '280px'
        containerDOM.classList.add('no-login-methods-view')
        return () => {
          // @ts-ignore
          containerDOM.style['min-height'] = '540px'
          containerDOM.classList.remove('no-login-methods-view')
        }
      }
    }
  }, [isNoMethod, isPhoneMedia, noLoginMethods])

  useEffect(() => {
    const document = getGuardDocument()

    const containerDOM = document.getElementsByClassName('g2-view-header')?.[0]
    const innerContainer = document.querySelector('.g2-view-login>.g2-view-container-inner')
    if (isPhoneMedia && noLoginMethods) {
      if (containerDOM) {
        containerDOM.classList.add('g2-view-header-mobile')
      }
      if (innerContainer) {
        innerContainer.classList.add('g2-view-login-mobile-inner')
      }
    } else {
      containerDOM?.classList.remove('g2-view-header-mobile')
      innerContainer?.classList.remove('g2-view-login-mobile-inner')
    }
    return () => {
      containerDOM?.classList.remove('g2-view-header-mobile')
      innerContainer?.classList.remove('g2-view-login-mobile-inner')
    }
  }, [isPhoneMedia, noLoginMethods])

  // 获取登录 tab 多语言
  const {
    password: passwordI18n,
    verifyCode: verifyCodeI18n,
    ad: adI18n,
    ldap: ldapI18n
  } = publicConfig?.ssoPageComponentDisplay?.loginMethodsI18nDisplaySettings || {}

  const PasswordTab = useMemo(
    () =>
      ms?.includes(LoginMethods.Password) && (
        <Tabs.TabPane
          key={LoginMethods.Password}
          tab={computedTabName(
            passwordI18n?.tab?.i18n?.[i18n.language] ||
              passwordI18n?.tab?.default ||
              t('login.pwdLogin')
          )}
        >
          <LoginWithPassword
            loginWay={loginWay}
            publicKey={publicKey}
            autoRegister={config?.autoRegister}
            host={config?.host}
            // onLogin={onLogin}
            backfillData={backfillData}
            onLoginSuccess={onLoginSuccess}
            onLoginFailed={onLoginFailed}
            onBeforeLogin={onBeforeLogin}
            saveIdentify={saveIdentify}
            passwordLoginMethods={config?.passwordLoginMethods ?? []}
            agreements={agreements}
            multipleInstance={multipleInstance}
          />
        </Tabs.TabPane>
      ),
    [
      agreements,
      ms,
      multipleInstance,
      backfillData,
      config,
      publicKey,
      loginWay,
      onBeforeLogin,
      saveIdentify,
      onLoginFailed,
      onLoginSuccess,
      t,
      passwordI18n
    ]
  )

  const CodeTab = useMemo(
    () =>
      ms?.includes(LoginMethods.PhoneCode) && (
        <Tabs.TabPane
          key={LoginMethods.PhoneCode}
          tab={computedTabName(
            verifyCodeI18n?.tab?.i18n?.[i18n.language] ||
              verifyCodeI18n?.tab?.default ||
              t('common.verifyCodeLogin')
          )}
        >
          <LoginWithVerifyCode
            verifyCodeLength={publicConfig?.verifyCodeLength}
            autoRegister={config?.autoRegister}
            onBeforeLogin={onBeforeLogin}
            // onLogin={onLogin}
            onLoginSuccess={onLoginSuccess}
            onLoginFailed={onLoginFailed}
            saveIdentify={saveIdentify}
            agreements={agreements}
            methods={verifyLoginMethods}
            backfillData={backfillData}
            multipleInstance={multipleInstance}
          />
        </Tabs.TabPane>
      ),
    [
      agreements,
      ms,
      multipleInstance,
      backfillData,
      config,
      onBeforeLogin,
      saveIdentify,
      onLoginFailed,
      onLoginSuccess,
      publicConfig?.verifyCodeLength,
      verifyLoginMethods,
      verifyCodeI18n,
      t
    ]
  )

  const LdapTab = useMemo(
    () =>
      ms?.includes(LoginMethods.LDAP) && (
        <Tabs.TabPane
          key={LoginMethods.LDAP}
          tab={computedTabName(
            ldapI18n?.tab?.i18n?.[i18n.language] || ldapI18n?.tab?.default || t('login.ldapLogin')
          )}
        >
          <LoginWithLDAP
            publicKey={publicKey}
            autoRegister={config?.autoRegister}
            host={config?.host}
            // onLogin={onLogin}
            onLoginSuccess={onLoginSuccess}
            onLoginFailed={onLoginFailed}
            onBeforeLogin={onBeforeLogin}
            agreements={agreements}
            backfillData={backfillData}
            multipleInstance={multipleInstance}
          />
        </Tabs.TabPane>
      ),
    [
      agreements,
      backfillData,
      config?.autoRegister,
      config?.host,
      multipleInstance,
      onBeforeLogin,
      onLoginFailed,
      onLoginSuccess,
      publicKey,
      ms,
      t,
      ldapI18n
    ]
  )

  const ADTab = useMemo(
    () =>
      ms?.includes(LoginMethods.AD) && (
        <Tabs.TabPane
          key={LoginMethods.AD}
          tab={computedTabName(
            adI18n?.tab?.i18n?.[i18n.language] || adI18n?.tab?.default || t('login.adLogin')
          )}
        >
          <LoginWithAD
            backfillData={backfillData}
            multipleInstance={multipleInstance}
            publicKey={publicKey}
            autoRegister={config?.autoRegister}
            // onLogin={onLogin}
            onLoginSuccess={onLoginSuccess}
            onLoginFailed={onLoginFailed}
            onBeforeLogin={onBeforeLogin}
            agreements={agreements}
          />
        </Tabs.TabPane>
      ),
    [
      agreements,
      backfillData,
      config?.autoRegister,
      multipleInstance,
      onBeforeLogin,
      onLoginFailed,
      onLoginSuccess,
      publicKey,
      ms,
      t,
      adI18n
    ]
  )

  const WxMiniQrTab = useCallback(
    (item: QrCodeItem) => {
      return (
        <Tabs.TabPane key={LoginMethods.WxMinQr + item.id} tab={item.title ?? t('login.scanLogin')}>
          <LoginWithWechatMiniQrcode
            id={item.id}
            multipleInstance={multipleInstance}
            onLoginSuccess={onLoginSuccess}
            canLoop={canLoop}
            qrCodeScanOptions={{
              extIdpConnId: item.id
            }}
          />
        </Tabs.TabPane>
      )
    },
    [canLoop, multipleInstance, onLoginSuccess, t]
  )

  const AppQrTab = useCallback(() => {
    return (
      <Tabs.TabPane key={LoginMethods.AppQr} tab={t('login.appScanLogin')}>
        <LoginWithAppQrcode
          multipleInstance={multipleInstance}
          onLoginSuccess={onLoginSuccess}
          canLoop={canLoop}
        />
      </Tabs.TabPane>
    )
  }, [canLoop, multipleInstance, onLoginSuccess, t])

  const WechatMpQrTab = useCallback(
    (item: QrCodeItem) => {
      return (
        <Tabs.TabPane
          key={LoginMethods.WechatMpQrcode + item.id}
          tab={item.title ?? t('login.wechatmpQrcode')}
        >
          <LoginWithWechatmpQrcode
            id={item.id}
            multipleInstance={multipleInstance}
            onLoginSuccess={onLoginSuccess}
            canLoop={canLoop}
            qrCodeScanOptions={{
              extIdpConnId: item.id
            }}
          />
        </Tabs.TabPane>
      )
    },
    [canLoop, multipleInstance, onLoginSuccess, t]
  )

  const AuthingOtpPushTab = useMemo(() => {
    return (
      ms?.includes(LoginMethods.AuthingOtpPush) && (
        <Tabs.TabPane key={LoginMethods.AuthingOtpPush} tab={t('login.authingOtpPushLogin')}>
          <LoginWithAuthingOtpPush
            onLoginSuccess={onLoginSuccess}
            multipleInstance={multipleInstance}
            initData={backfillData}
            agreements={agreements}
          ></LoginWithAuthingOtpPush>
        </Tabs.TabPane>
      )
    )
  }, [ms, onLoginSuccess, t, backfillData, multipleInstance, agreements])

  // 登录方式对应 tab Component
  const tabMap = useMemo(() => {
    return {
      [LoginMethods.Password]: PasswordTab,
      [LoginMethods.PhoneCode]: CodeTab,
      [LoginMethods.LDAP]: LdapTab,
      [LoginMethods.AD]: ADTab,
      [LoginMethods.AuthingOtpPush]: AuthingOtpPushTab
    }
  }, [PasswordTab, CodeTab, LdapTab, ADTab, AuthingOtpPushTab])

  const [hiddenNormalTabs, setHiddenNormalTabs] = useState(false)
  const GeneralLoginComponent = useMemo(() => {
    const total = ms?.filter(tabName =>
      [
        LoginMethods.Password,
        LoginMethods.PhoneCode,
        LoginMethods.LDAP,
        LoginMethods.AD,
        LoginMethods.AuthingOtpPush
      ].includes(tabName)
    )

    if (total) {
      total.length > 1 ? setHiddenNormalTabs(false) : setHiddenNormalTabs(true)

      return getSortTabs(total, config.defaultLoginMethod ?? '').map(
        tabName =>
          tabMap[
            tabName as
              | LoginMethods.Password
              | LoginMethods.PhoneCode
              | LoginMethods.LDAP
              | LoginMethods.AD
              | LoginMethods.AuthingOtpPush
          ]
      )
    }
    return null
  }, [config.defaultLoginMethod, ms, tabMap])

  const QrCodeTabMap = useMemo(() => {
    return {
      [LoginMethods.AppQr]: AppQrTab,
      [LoginMethods.WechatMpQrcode]: WechatMpQrTab,
      [LoginMethods.WxMinQr]: WxMiniQrTab
    }
  }, [AppQrTab, WechatMpQrTab, WxMiniQrTab])

  const CodeLoginComponent = useMemo(() => {
    const qrCodeMap: {
      [name: string]: {
        type: LoginMethods.WechatMpQrcode | LoginMethods.WxMinQr
        title: string
        id: string
      }
    } = {}

    Object.keys(qrcodeTabsSettings).forEach(key => {
      qrcodeTabsSettings[key as LoginMethods].forEach(item => {
        qrCodeMap[item.id] = {
          type: key as LoginMethods.WechatMpQrcode | LoginMethods.WxMinQr,
          title: item.title,
          id: item.id
        }
      })
    })

    const loginMethodsSort = publicConfig.qrCodeSortConfig?.loginMethodsSort || []

    const sortWithType = (loginMethodsSort || []).map(key => {
      return {
        key,
        type: qrCodeMap[key]?.type || LoginMethods.AppQr
      }
    })

    const position = sortWithType?.findIndex(item => item.type === defaultMethod)

    if (position > 0) {
      const item = loginMethodsSort.splice(position, 1)
      loginMethodsSort.unshift(item[0])
    }

    return (loginMethodsSort || []).map(key => {
      return qrCodeMap[key]
        ? QrCodeTabMap[qrCodeMap[key].type]?.(qrCodeMap[key])
        : QrCodeTabMap[LoginMethods.AppQr]()
    })
  }, [
    QrCodeTabMap,
    qrcodeTabsSettings,
    publicConfig.qrCodeSortConfig?.loginMethodsSort,
    defaultMethod
  ])

  const isScanModule = useMemo(() => {
    return [LoginMethods.WechatMpQrcode, LoginMethods.WxMinQr, LoginMethods.AppQr].includes(loginWay)
  }, [LoginMethods, loginWay])

  const tipComponent = useMemo(() => {
    if ((!disableResetPwd && !isResetPage) || !disableRegister || (errorNumber >= 2 || accountLock)) {
      return (
        <Space className={'g2-tips-line'} align="center" size={24}>
          {!disableResetPwd && !isResetPage && (
            <div>
              <GuardButton
                type="link"
                className="link-like forget-password-link"
                onClick={() => changeModule?.(GuardModuleType.FORGET_PWD, {})}
              >
                {t('login.forgetPwd')}
              </GuardButton>
            </div>
          )}

          {!disableRegister && (
            <span className="go-to-register">
              {/* <span className="gray">{t('common.noAccYet')}</span> */}
              <GuardButton
                type="link"
                className="link-like register-link"
                onClick={() => changeModule?.(GuardModuleType.REGISTER, {})}
              >
                {t('common.registerImmediate')}
              </GuardButton>
            </span>
          )}
          {(errorNumber >= 2 || accountLock) && (
            <GuardButton
              type="link"
              onClick={() => {
                changeModule?.(GuardModuleType.ANY_QUESTIONS)
              }}
            >
              {t('common.feedback')}
            </GuardButton>
          )}
        </Space>
      )
    }

    return null

  }, [])

  return (
    <div className="g2-view-container g2-view-login">
      <BackLogin isRender={isResetPage} />

      <div className="g2-view-container-inner">
        {isNoMethod ? (
          <>
            <div className="g2-view-header">
              <img src={config?.logo} alt="" className="icon" />
              <div className="title">{config?.title}</div>
              {!!publicConfig?.welcomeMessage && (
                <div className="title-description">
                  {publicConfig?.welcomeMessage[i18n.language]}
                </div>
              )}
            </div>
            <div className="no-login-methods-view">
              <IconFont type="authing-bianzu" style={{ width: 178, height: 120 }} />
              <span className="no-login-methods-desc">{t('login.noLoginMethodsDesc')}</span>
            </div>
          </>
        ) : (
          <>
            {/* 两种方式都需要渲染的时候，才出现切换按钮 */}
            {!isMultipleAccount && renderInputWay && renderQrcodeWay && (
              <div className="g2-qrcode-switch">
                {/* <div className="switch-text">{switchText}</div> */}
                <Tooltip
                  placement="left"
                  title={switchText}
                  getPopupContainer={(node: any) => {
                    if (node) {
                      return node.parentElement
                    }
                    return document.body
                  }}
                >
                  <div
                    className="switch-img"
                    onClick={() => {
                      message.destroy()
                      if (inputWays.includes(loginWay)) {
                        setLoginWay(firstQRcodeWay)
                      } else if (qrcodeWays.includes(loginWay)) {
                        setLoginWay(firstInputWay)
                      }
                    }}
                  >
                    {/* <div className="imgae-mask" /> */}
                    <IconFont
                      type="authing-qr-code-fill"
                      className={`qrcode-switch-image ${inputNone}`}
                    />
                    <IconFont
                      type="authing-computer-line"
                      className={`qrcode-switch-image ${qrcodeNone}`}
                    />
                  </div>
                </Tooltip>
                {/* <Popover
                  placement="leftTop"
                  visible={true}
                  content={switchText}
                  overlayClassName={
                    switchText === i18n.t('login.moreWays')
                      ? 'long-switch-text'
                      : 'switch-text'
                  }
                  getPopupContainer={(node: any) => {
                    if (node) {
                      return node.parentElement
                    }
                    return document.body
                  }}
                ></Popover> */}
              </div>
            )}
            {!isScanModule && <div className="g2-view-header">
              <img src={config?.logo} alt="" className="icon" />
              <div className="title">
                {isMultipleAccount ? t('login.selectLoginAccount') : config?.title}
              </div>
              {!!publicConfig?.welcomeMessage && (
                <div className="title-description">
                  {publicConfig?.welcomeMessage[i18n.language]}
                </div>
              )}
              {/* 提供头部打标签的功能 */}
              {tags?.map?.((it, i) => (
                // @ts-ignore
                <Tag
                  className="authing-header-tag"
                  style={{
                    color: it?.color,
                    backgroundColor: it?.backgroundColor
                  }}
                  key={i}
                >
                  {it.name}
                </Tag>
              ))}
            </div>}
            {isMultipleAccount ? (
              <MultipleAccounts
                multipleInstance={multipleInstance}
                referMultipleState={referMultipleState}
                changeModule={changeModule}
              />
            ) : (
              <>
                {renderInputWay && (
                  <div className={inputNone }>
                    {!isResetPage ? (
                      <div className={`g2-view-tabs ${hiddenNormalTabs && 'hidden'}`}>
                        <Tabs
                          destroyInactiveTabPane={true}
                          onChange={(k: any) => {
                            setLoginWay(k)
                            message.destroy()
                            events?.onLoginTabChange?.(k)
                          }}
                          activeKey={loginWay}
                          moreIcon={<IconFont type='authing-more-fill1' className='authing-tabs-more' />}
                          centered
                        >
                          {GeneralLoginComponent}
                        </Tabs>
                      </div>
                    ) : (
                      <ResetAccountName />
                    )}
                    {tipComponent}
                  </div>
                )}
                {renderQrcodeWay && isScanModule && (
                  <div className={`g2-view-tabs ${qrcodeNone} ${hiddenTab && 'hidden'}`} style={{ marginTop: '54px' }}>
                    <Tabs
                      centered
                      destroyInactiveTabPane={true}
                      defaultActiveKey={defaultQrCodeWay}
                      moreIcon={<IconFont type='authing-more-fill1' className='authing-tabs-more' />}
                      onChange={(k: any) => {
                        message.destroy()
                        events?.onLoginTabChange?.(k)
                      }}
                    >
                      {CodeLoginComponent}
                    </Tabs>
                  </div>
                )}
              </>
            )}
            <div className="g2-social-login">
              <SocialLogin
                appId={appId}
                config={config!}
                multipleInstance={multipleInstance}
                // onLogin={onLogin}
                onLoginSuccess={onLoginSuccess}
                onLoginFailed={onLoginFailed}
                socialConnectionObjs={socialConnectionObjs}
                enterpriseConnectionObjs={enterpriseConnectionObjs}
              />
            </div>
          </>
        )}
      </div>
      <ChangeLanguage langRange={config?.langRange} onLangChange={events?.onLangChange} />
    </div>
  )
}
