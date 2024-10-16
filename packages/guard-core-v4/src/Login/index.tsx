import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { message, Popover, Tabs, Tag, Tooltip } from 'shim-antd'

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

import { fallbackLng, i18n } from '../_utils/locales'

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

import {
  CodeAction,
  getPasswordIdentify,
  getSortTabs,
  isDingTalkOrigin,
  isWeComOrigin
} from '../_utils'

import { LoginWithVerifyCode, SpecifyCodeMethods } from './core/withVerifyCode'

import { useMediaSize, useMethod } from '../_utils/hooks'

import { getGuardDocument } from '../_utils/guardDocument'

import { useGuardAuthClient } from '../Guard/authClient'

import { GuardLoginInitData } from './interface'

import { GuardButton } from '../GuardButton'

import {
  LoginMethods,
  QrCodeItem,
  QrcodeTabsSettings,
  SocialConnectionItem,
  VerifyLoginMethods
} from '../Type/application'

import { useLoginMultiple } from './hooks/useLoginMultiple'

import { useGuardView } from '../Guard/core/hooks/useGuardView'

import { LoginWithAuthingOtpPush } from './core/withAuthingOtpPush/index'
// import { LoginWithPasskey } from './core/withPasskey'

import { usePostMessage } from './socialLogin/postMessage'

import { LoginWithWeComQrcode } from './core/withWeComQrcode'

import { getGuardWindow } from '../Guard/core/useAppendConfig'

import { LoginWithDingTalkQrcode } from './core/withDingTalkQrcode'
import { LoginWithZjQrcode } from './core/withZjQrcode'

const { useEffect, useLayoutEffect, useState, useRef, useMemo, useCallback } =
  React

const inputWays = [
  LoginMethods.Password,
  LoginMethods.PhoneCode,
  LoginMethods.AD,
  LoginMethods.LDAP,
  LoginMethods.AuthingOtpPush,
  LoginMethods.EmailCode
]
const qrcodeWays = [
  LoginMethods.AppQr,
  LoginMethods.WxMinQr,
  LoginMethods.WechatMpQrcode,
  LoginMethods.WechatworkCorpQrconnect,
  LoginMethods.DingTalkQrcode,
  LoginMethods.ZJZWFWQrcode
]
/**
 * 作为内嵌登录方式的身份源链接
 */
const renderQrcodeByIdentify = [
  LoginMethods.WechatMpQrcode,
  LoginMethods.WxMinQr,
  LoginMethods.DingTalkQrcode,
  LoginMethods.WechatworkCorpQrconnect,
  LoginMethods.ZJZWFWQrcode
]

function hasMultipleQRLengths(
  qrcodeTabsSettings: QrcodeTabsSettings,
  methods: Partial<keyof QrcodeTabsSettings>[]
) {
  return methods.some(method => qrcodeTabsSettings?.[method]?.length > 1)
}

const useMethods = (config: any) => {
  let dlm = config?.defaultLoginMethod
  let propsMethods = config?.loginMethods
  if (!propsMethods?.includes(dlm)) {
    dlm = propsMethods?.[0]
  }
  let renderInputWay = intersection(propsMethods, inputWays).length > 0
  let renderQrcodeWay = intersection(propsMethods, qrcodeWays).length > 0
  return [dlm, renderInputWay, renderQrcodeWay]
}

const useDisables = (data: any) => {
  let { disableResetPwd, disableRegister } = data.config
  let { loginWay, autoRegister } = data

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
  let inputNone = !inputWays.includes(loginWay) ? 'none' : ''
  let qrcodeNone = !qrcodeWays.includes(loginWay) ? 'none' : ''

  return { switchText, inputNone, qrcodeNone }
}

const computedTabName = (str: string) => {
  if (str.length > 20) {
    return `${str.substring(0, 20)}...`
  }
  return str
}

export const GuardLoginView: React.FC<{ isResetPage?: boolean }> = ({
  isResetPage = false
}) => {
  const { specifyDefaultLoginMethod } = useGuardInitData<GuardLoginInitData>()

  const config = useGuardFinallyConfig()

  const appId = useGuardAppId()

  const { changeModule } = useGuardModule()

  const events = useGuardEvents()

  const publicConfig = useGuardPublicConfig()

  let [defaultMethod, renderInputWay, renderQrcodeWay] = useMethods(config)

  const agreementEnabled = config?.agreementEnabled

  const { t } = useTranslation()

  const onMessage = usePostMessage()

  const [loginWay, setLoginWay] = useState(
    specifyDefaultLoginMethod || defaultMethod
  )

  useGuardView({
    currentTab: loginWay,
    changeTab: setLoginWay
  })

  const {
    defaultQrWay,
    backfillData,
    multipleInstance,
    isMultipleAccount,
    referMultipleState
  } = useLoginMultiple(setLoginWay)

  const [canLoop, setCanLoop] = useState(false) // 允许轮询

  const client = useGuardAuthClient()

  const qrcodeTabsSettings = publicConfig?.qrcodeTabsSettings

  const socialConnections = publicConfig?.socialConnections || []

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

  let publicKey = config?.publicKey as string

  // let autoRegister = props.config?.autoRegister
  let ms = config?.loginMethods

  const firstInputWay = inputWays.filter(way => ms?.includes(way))[0]

  const firstQRcodeWay = qrcodeWays.filter(way => ms?.includes(way))[0]

  let { disableResetPwd, disableRegister } = useDisables({
    config: config,
    loginWay,
    autoRegister: config?.autoRegister
  })

  const hiddenTab = useMemo(() => {
    const scanLogins = ms
      ? ms.filter(method => qrcodeWays.includes(method))
      : [] //取到扫码登录类型
    if (scanLogins.length > 1) {
      // 如果有两个以上的code 类型
      return false
    } else if (!scanLogins.includes(LoginMethods.AppQr)) {
      // 如果只有一个且那一个还不是 app 类型
      if (
        qrcodeTabsSettings &&
        hasMultipleQRLengths(qrcodeTabsSettings, renderQrcodeByIdentify)
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
    if (
      [
        LoginMethods.WechatMpQrcode,
        LoginMethods.WxMinQr,
        LoginMethods.WechatworkCorpQrconnect,
        LoginMethods.DingTalkQrcode,
        LoginMethods.ZJZWFWQrcode
      ].includes(defaultMethod)
    ) {
      const id = qrcodeTabsSettings?.[defaultMethod as LoginMethods]?.find(
        (i: { id: string; title: string; isDefault?: boolean | undefined }) =>
          i.isDefault
      )?.id
      return defaultMethod + id
    } else {
      return defaultMethod
    }
  }, [defaultQrWay, defaultMethod, qrcodeTabsSettings])

  const onLoginSuccess = useCallback(
    (data: any, message?: string) => {
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

  let { switchText, inputNone, qrcodeNone } = useSwitchStates(loginWay)
  //availableAt 0或者null-注册时，1-登录时，2-注册和登录时 注册登录合并时应该登录注册协议全部显示
  const agreements = useMemo(
    () =>
      agreementEnabled
        ? config?.agreements?.filter(
            agree =>
              fallbackLng(i18n.resolvedLanguage).find(lng =>
                lng.includes(agree.lang)
              ) &&
              (config?.autoRegister || !!agree?.availableAt)
          ) ?? []
        : [],
    [
      agreementEnabled,
      config?.autoRegister,
      config?.agreements,
      i18n.resolvedLanguage
    ]
  )

  const verifyLoginMethods = useMemo<VerifyLoginMethods[]>(
    () =>
      publicConfig?.verifyCodeTabConfig?.enabledLoginMethods ?? ['phone-code'],

    [publicConfig?.verifyCodeTabConfig?.enabledLoginMethods]
  )

  const [socialConnectionObjs, enterpriseConnectionObjs, isNoMethod] =
    useMethod({ config, publicConfig })
  const noLoginMethods = !config?.loginMethods?.length

  const { isPhoneMedia } = useMediaSize()

  // 渲染前执行
  useLayoutEffect(() => {
    if (noLoginMethods && !isPhoneMedia) {
      // 无表单登录方式，且不是手机端
      const document = getGuardDocument()
      // pc 下
      const containerDOM =
        document.getElementsByClassName('g2-view-container')?.[0]

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
    const innerContainer = document.querySelector(
      '.g2-view-login>.g2-view-container-inner'
    )
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
  } = publicConfig?.ssoPageComponentDisplay?.loginMethodsI18nDisplaySettings ||
  {}

  const PasswordTab = useMemo(
    () =>
      ms?.includes(LoginMethods.Password) && (
        <Tabs.TabPane
          key={LoginMethods.Password}
          tab={computedTabName(
            passwordI18n?.tab?.i18n?.[i18n.resolvedLanguage!] ||
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

  const CodeTab = useMemo(() => {
    if (!ms?.includes(LoginMethods.PhoneCode)) {
      return <></>
    }

    // 是否开启了国际化短信功能
    const isInternationSms =
      publicConfig?.internationalSmsConfig?.enabled || false

    const tabs = []

    // 开启国际化短信时要将短信和邮箱 tab 拆分，方便下拉选取手机区号
    if (isInternationSms) {
      if (
        publicConfig.verifyCodeTabConfig?.enabledLoginMethods?.includes(
          'phone-code'
        )
      ) {
        tabs.push(
          <Tabs.TabPane
            key={LoginMethods.PhoneCode}
            tab={computedTabName(
              verifyCodeI18n?.tab?.i18n?.[i18n.resolvedLanguage!] ||
                verifyCodeI18n?.tab?.default ||
                t('common.phoneCodeTab')
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
              specifyCodeMethod={SpecifyCodeMethods.Phone}
            />
          </Tabs.TabPane>
        )
      }

      if (
        publicConfig.verifyCodeTabConfig?.enabledLoginMethods?.includes(
          'email-code'
        )
      ) {
        tabs.push(
          <Tabs.TabPane
            key={LoginMethods.EmailCode}
            // TODO 后续需要单独抽出来
            tab={computedTabName(t('common.emailCodeTab'))}
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
              specifyCodeMethod={SpecifyCodeMethods.Email}
            />
          </Tabs.TabPane>
        )
      }

      return tabs
    } else {
      return (
        <Tabs.TabPane
          key={LoginMethods.PhoneCode}
          tab={computedTabName(
            verifyCodeI18n?.tab?.i18n?.[i18n.resolvedLanguage!] ||
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
      )
    }
  }, [
    ms,
    publicConfig?.internationalSmsConfig?.enabled,
    publicConfig.verifyCodeTabConfig?.enabledLoginMethods,
    publicConfig?.verifyCodeLength,
    t,
    config?.autoRegister,
    onBeforeLogin,
    onLoginSuccess,
    onLoginFailed,
    saveIdentify,
    agreements,
    verifyLoginMethods,
    backfillData,
    multipleInstance,
    verifyCodeI18n?.tab?.i18n,
    verifyCodeI18n?.tab?.default
  ])

  const LdapTab = useMemo(
    () =>
      ms?.includes(LoginMethods.LDAP) && (
        <Tabs.TabPane
          key={LoginMethods.LDAP}
          tab={computedTabName(
            ldapI18n?.tab?.i18n?.[i18n.resolvedLanguage!] ||
              ldapI18n?.tab?.default ||
              t('login.ldapLogin')
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
            adI18n?.tab?.i18n?.[i18n.resolvedLanguage!] ||
              adI18n?.tab?.default ||
              t('login.adLogin')
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
        <Tabs.TabPane
          key={LoginMethods.WxMinQr + item.id}
          tab={item.title ?? t('login.scanLogin')}
        >
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

  const ZjQrTab = useCallback(
    (item: QrCodeItem) => {
      return (
        <Tabs.TabPane
          key={LoginMethods.ZJZWFWQrcode + item.id}
          tab={item.title ?? t('login.zjzwScanLogin')}
        >
          <LoginWithZjQrcode
            qrCodeScanOptions={{
              extIdpConnId: item.id
            }}
            qrConfig={item.QRConfig}
            multipleInstance={multipleInstance}
            onLoginSuccess={onLoginSuccess}
            canLoop={canLoop}
          />
        </Tabs.TabPane>
      )
    },
    [canLoop, multipleInstance, onLoginSuccess, t]
  )

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

  const WeComQrTab = useCallback(
    (item: QrCodeItem) => {
      return (
        <Tabs.TabPane
          key={LoginMethods.WechatworkCorpQrconnect + item.id}
          tab={item.title ?? t('login.wecomScanLogin')}
        >
          <LoginWithWeComQrcode
            id={item.id}
            QRConfig={item.QRConfig}
            onLoginSuccess={onLoginSuccess}
            onLoginFailed={onLoginFailed}
          />
        </Tabs.TabPane>
      )
    },
    [canLoop, multipleInstance, onLoginSuccess, t]
  )

  const DTQrTab = useCallback(
    (item: QrCodeItem) => {
      return (
        <Tabs.TabPane
          key={LoginMethods.WechatworkCorpQrconnect + item.id}
          tab={item.title ?? t('login.wecomScanLogin')}
        >
          <LoginWithDingTalkQrcode
            id={item.id}
            QRConfig={item.QRConfig}
            onLoginSuccess={onLoginSuccess}
            onLoginFailed={onLoginFailed}
          />
        </Tabs.TabPane>
      )
    },
    [canLoop, multipleInstance, onLoginSuccess, t]
  )

  const AuthingOtpPushTab = useMemo(() => {
    return (
      ms?.includes(LoginMethods.AuthingOtpPush) && (
        <Tabs.TabPane
          key={LoginMethods.AuthingOtpPush}
          tab={t('login.authingOtpPushLogin')}
        >
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

  // const PasskeyTab = useMemo(
  //   () =>
  //     ms?.includes(LoginMethods.Passkey) && (
  //       <Tabs.TabPane key={LoginMethods.Passkey} tab={'Passkey'}>
  //         <LoginWithPasskey />
  //       </Tabs.TabPane>
  //     ),
  //   [ms]
  // )

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
      const sortedTable = getSortTabs(total, config.defaultLoginMethod ?? '')
      const tabs = sortedTable.map(
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
      return tabs
    }
    return null
  }, [config.defaultLoginMethod, ms, tabMap])

  const QrCodeTabMap = useMemo(() => {
    return {
      [LoginMethods.AppQr]: AppQrTab,
      [LoginMethods.WechatMpQrcode]: WechatMpQrTab,
      [LoginMethods.WxMinQr]: WxMiniQrTab,
      [LoginMethods.WechatworkCorpQrconnect]: WeComQrTab,
      [LoginMethods.DingTalkQrcode]: DTQrTab,
      [LoginMethods.ZJZWFWQrcode]: ZjQrTab
    }
  }, [AppQrTab, WechatMpQrTab, WxMiniQrTab])

  const CodeLoginComponent = useMemo(() => {
    const qrCodeMap: {
      [name: string]: {
        type:
          | LoginMethods.WechatMpQrcode
          | LoginMethods.WxMinQr
          | LoginMethods.WechatworkCorpQrconnect
          | LoginMethods.DingTalkQrcode
          | LoginMethods.ZJZWFWQrcode
        title: string
        id: string
        QRConfig?: {
          corpId: string
          agentId: string
          redirectUrl: string
          identifier: string
          clientId?: string
        }
      }
    } = {}

    Object.keys(qrcodeTabsSettings).forEach(key => {
      qrcodeTabsSettings[key as LoginMethods].forEach(item => {
        qrCodeMap[item.id] = {
          type: key as
            | LoginMethods.WechatMpQrcode
            | LoginMethods.WxMinQr
            | LoginMethods.WechatworkCorpQrconnect
            | LoginMethods.DingTalkQrcode
            | LoginMethods.ZJZWFWQrcode,
          title: item.title,
          id: item.id,
          QRConfig: item.QRConfig
        }
      })
    })

    const loginMethodsSort =
      publicConfig.qrCodeSortConfig?.loginMethodsSort || []

    const sortWithType = (loginMethodsSort || []).map(key => {
      return {
        key,
        type: qrCodeMap[key]?.type || LoginMethods.AppQr
      }
    })

    const position = sortWithType?.findIndex(
      item => item.type === defaultMethod
    )

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

  useEffect(() => {
    const onPostMessage = (evt: MessageEvent) => {
      // 去掉钉钉和企微域下的postmessage处理 由他们内部自己监听的message控制 避免重复触发
      /** 是否存在开启内嵌模式的身份源 */
      const isEmbeddedIdp = socialConnections.filter(conn => conn.embedded)
      /** 处于扫码登录方式 */
      if (isEmbeddedIdp.length > 0 && qrcodeWays.includes(loginWay)) {
        if (
          isEmbeddedIdp.find(
            idp =>
              idp.provider.replaceAll(':', '-') ===
              LoginMethods.WechatworkCorpQrconnect
          ) &&
          isWeComOrigin(evt)
        ) {
          return
        }
        if (
          isEmbeddedIdp.find(
            idp => idp.provider.replaceAll(':', '-') === 'dingtalk'
          ) &&
          isDingTalkOrigin(evt.origin)
        ) {
          return
        }
      }
      const res = onMessage(evt)
      if (!res) return

      // 更新本次登录方式
      multipleInstance && multipleInstance.setLoginWay('input', 'social')

      const { code, data, onGuardHandling, message } = res

      if (code === 200) {
        onLoginSuccess(data)
      } else {
        const handMode = onGuardHandling?.()
        // 向上层抛出错误
        handMode === CodeAction.RENDER_MESSAGE &&
          onLoginFailed(code, data, message)
      }
    }

    const guardWindow = getGuardWindow()
    // 如果有第三方身份源开启监听
    if (
      socialConnectionObjs.length > 0 ||
      enterpriseConnectionObjs.length > 0
    ) {
      guardWindow?.addEventListener('message', onPostMessage)
    }

    return () => {
      guardWindow?.removeEventListener('message', onPostMessage)
    }
  }, [onLoginFailed, multipleInstance, onLoginSuccess, onMessage])

  return (
    <div className="g2-view-container g2-view-login">
      <div className="g2-view-container-inner">
        {isNoMethod ? (
          <>
            <div className="g2-view-header">
              <img src={config?.logo} alt="" className="icon" />
              <div className="title">{config?.title}</div>
              {!!publicConfig?.welcomeMessage && (
                <div className="title-description">
                  {publicConfig?.welcomeMessage[i18n.resolvedLanguage!]}
                </div>
              )}
            </div>
            <div className="no-login-methods-view">
              <IconFont
                type="authing-bianzu"
                style={{ width: 178, height: 120 }}
              />
              <span className="no-login-methods-desc">
                {t('login.noLoginMethodsDesc')}
              </span>
            </div>
          </>
        ) : (
          <>
            {/* 两种方式都需要渲染的时候，才出现切换按钮 */}
            {!isMultipleAccount && renderInputWay && renderQrcodeWay && (
              <div className="g2-qrcode-switch">
                {/* <div className="switch-text">{switchText}</div> */}
                <Popover
                  placement="leftTop"
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
                    <div className="imgae-mask" />
                    <IconFont
                      type="authing-a-erweima22"
                      className={`qrcode-switch-image ${inputNone}`}
                    />
                    <IconFont
                      type="authing-diannao"
                      className={`qrcode-switch-image ${qrcodeNone}`}
                    />
                  </div>
                </Popover>
              </div>
            )}
            <div className="g2-view-header">
              <img src={config?.logo} alt="" className="icon" />
              <div className="title">
                {isMultipleAccount
                  ? t('login.selectLoginAccount')
                  : config?.title}
              </div>
              {!!publicConfig?.welcomeMessage && (
                <div className="title-description">
                  {publicConfig?.welcomeMessage[i18n.resolvedLanguage!]}
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
            </div>
            {isMultipleAccount ? (
              <MultipleAccounts
                multipleInstance={multipleInstance}
                referMultipleState={referMultipleState}
                changeModule={changeModule}
              />
            ) : (
              <>
                {renderInputWay && (
                  <div className={inputNone}>
                    {!isResetPage ? (
                      <div className={'g2-view-tabs'}>
                        <Tabs
                          destroyInactiveTabPane={true}
                          onChange={(k: any) => {
                            setLoginWay(k)
                            message.destroy()
                            events?.onLoginTabChange?.(k)
                          }}
                          activeKey={loginWay}
                        >
                          {GeneralLoginComponent?.flat()}
                        </Tabs>
                      </div>
                    ) : (
                      <ResetAccountName />
                    )}

                    <div className={'g2-tips-line'}>
                      {!disableResetPwd && !isResetPage && (
                        <div>
                          <GuardButton
                            type="link"
                            className="link-like forget-password-link"
                            onClick={() =>
                              changeModule?.(GuardModuleType.FORGET_PWD, {})
                            }
                          >
                            {t('login.forgetPwd')}
                          </GuardButton>
                          {(errorNumber >= 2 || accountLock) && (
                            <span style={{ margin: '0 4px', color: '#EAEBEE' }}>
                              丨
                            </span>
                          )}
                        </div>
                      )}
                      {isResetPage && (
                        <GuardButton
                          type="link"
                          onClick={() => {
                            changeModule?.(GuardModuleType.LOGIN)
                          }}
                        >
                          {t('common.backLoginPage')}
                        </GuardButton>
                      )}
                      {(errorNumber >= 2 || accountLock) && (
                        <Tooltip title={t('common.feedback')}>
                          <div
                            className="touch-tip question-feedback"
                            onClick={() =>
                              changeModule?.(GuardModuleType.ANY_QUESTIONS, {
                                identify: identifyRef.current[loginWay]
                              })
                            }
                          >
                            <IconFont
                              type={'authing-a-question-line1'}
                              style={{ fontSize: 16 }}
                            />
                          </div>
                        </Tooltip>
                      )}

                      {!disableRegister && (
                        <span className="go-to-register">
                          {/* <span className="gray">{t('common.noAccYet')}</span> */}
                          <GuardButton
                            type="link"
                            className="link-like register-link"
                            onClick={() =>
                              changeModule?.(GuardModuleType.REGISTER, {})
                            }
                          >
                            {t('common.registerImmediate')}
                          </GuardButton>
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {renderQrcodeWay && (
                  <div
                    className={`g2-view-tabs ${qrcodeNone} ${
                      hiddenTab && 'hidden_tab'
                    }`}
                  >
                    <Tabs
                      destroyInactiveTabPane={true}
                      defaultActiveKey={defaultQrCodeWay}
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
      <ChangeLanguage
        langRange={config?.langRange}
        onLangChange={events?.onLangChange}
      />
    </div>
  )
}
