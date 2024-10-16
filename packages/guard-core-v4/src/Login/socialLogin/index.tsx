import { message, Space, Tooltip } from 'shim-antd'

import { Lang } from 'authing-js-sdk/build/main/types'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { i18n } from '../../_utils/locales'

import { popupCenter } from '../../_utils'

import querystring from 'query-string'

import { IconFont } from '../../IconFont'

import './style.less'

import { useMediaSize, SocialConnectionEvent } from '../../_utils/hooks'

import {
  useGuardPublicConfig,
  useGuardTenantId,
  useIsSpecialBrowser
} from '../../_utils/context'

import { IdpButton } from './IdpButton'

import { getVersion } from '../../_utils'

import { GuardLocalConfig } from '../../Guard'

import { getGuardWindow } from '../../Guard/core/useAppendConfig'

import { GuardButton } from '../../GuardButton'

import { ApplicationConfig, SocialConnectionItem } from '../../Type/application'

import { StoreInstance } from '../../Guard/core/hooks/useMultipleAccounts'

import { PasskeyButton } from './PasskeyButton'
export interface SocialLoginProps {
  appId: string
  config: GuardLocalConfig
  // onLogin: any
  onLoginFailed: any
  onLoginSuccess: any
  enterpriseConnectionObjs: ApplicationConfig['identityProviders']
  socialConnectionObjs: SocialConnectionItem[]
  /**
   * 根据输入的账号 & 返回获得对应的登录方法
   */
  multipleInstance?: StoreInstance
}

export const SocialLogin: React.FC<SocialLoginProps> = ({
  appId,
  config,
  enterpriseConnectionObjs,
  socialConnectionObjs,
  onLoginSuccess,
  onLoginFailed
}) => {
  const noLoginMethods = !config?.loginMethods?.length

  const publicConfig = useGuardPublicConfig()

  const userPoolId = publicConfig?.userPoolId

  const { t } = useTranslation()

  const { isPhoneMedia } = useMediaSize()

  const tenantId = useGuardTenantId()

  const isSpecialBrowser = useIsSpecialBrowser()

  const idpButtons = enterpriseConnectionObjs.map((i: any) => {
    return (
      <IdpButton
        key={i.identifier}
        i={i}
        appId={appId}
        appHost={config?.host}
        userPoolId={userPoolId}
        isHost={config?.isHost}
      />
    )
  })

  const socialLoginButtons = socialConnectionObjs.map((item: any) => {
    let iconType = `authing-${item.provider.replace(/:/g, '-')}`

    const version = getVersion()

    const query: Record<string, any> = {
      from_guard: '1',
      app_id: appId,
      guard_version: `Guard@${version}`
    }

    if (tenantId) {
      query.tenant_id = tenantId
    }

    if (config?.isHost) {
      query.from_hosted_guard = '1'

      if (isSpecialBrowser) {
        query.redirected = '1'

        const guardWindow = getGuardWindow()
        if (guardWindow) {
          // 如果 isHost 是 true，则从 url 获取 finish_login_url 作为 social.authorize 方法的 targetUrl 参数
          query.redirect_url = querystring.parse(guardWindow.location.search)?.[
            'finish_login_url'
          ]
        }
      }
    }

    const onLogin = () => {
      if (item.action === SocialConnectionEvent.Message) {
        message.error(
          t('login.socialConnectionMessage', {
            provider:
              item.displayName ??
              (i18n.resolvedLanguage === 'zh-CN' ? item.name : item.name_en) ??
              item.provider
          })
        )
      } else if (item.action === SocialConnectionEvent.Auth) {
        const initUrl = `${config.host}/connections/social/${
          item.identifier
        }?${querystring.stringify(query)}`

        if (query.redirected) {
          window.location.replace(initUrl)
        } else {
          popupCenter(initUrl)
        }
      }
    }

    const shape = config.socialConnectionsBtnShape
    if (shape === 'button') {
      return (
        <GuardButton
          key={item.id}
          block
          size="large"
          className="g2-guard-third-login-btn"
          icon={
            <IconFont
              type={`${iconType}-fill`}
              style={{ fontSize: 20, marginRight: 8 }}
            />
          }
          onClick={onLogin}
          style={{
            marginBottom: 8
          }}
        >
          {item.displayName ??
            (i18n.resolvedLanguage === 'zh-CN' ? item.name : item.name_en) ??
            item.provider}
        </GuardButton>
      )
    } else if (shape === 'icon') {
      return isPhoneMedia ? (
        <GuardButton
          className="g2-social-login-item"
          onClick={onLogin}
          icon={<IconFont type={`${iconType}-fill`} />}
        ></GuardButton>
      ) : (
        <Tooltip
          key={item.id}
          title={item.tooltip?.[i18n.resolvedLanguage as Lang] || item.name}
          trigger={['hover', 'click', 'contextMenu']}
        >
          <GuardButton
            className="g2-social-login-item"
            onClick={onLogin}
            icon={<IconFont type={`${iconType}-fill`} />}
          ></GuardButton>
        </Tooltip>
      )
    } else {
      return noLoginMethods ? (
        <GuardButton
          key={item.id}
          block
          size="large"
          className="g2-guard-third-login-btn"
          icon={
            <IconFont
              type={`${iconType}-fill`}
              style={{ fontSize: 20, marginRight: 8 }}
            />
          }
          onClick={onLogin}
        >
          {item.displayName ??
            (i18n.resolvedLanguage === 'zh-CN' ? item.name : item.name_en) ??
            item.provider}
        </GuardButton>
      ) : isPhoneMedia ? (
        <GuardButton
          className="g2-social-login-item"
          onClick={onLogin}
          key={item.id}
          icon={<IconFont type={`${iconType}-fill`} />}
        ></GuardButton>
      ) : (
        <Tooltip
          overlayStyle={{ fontFamily: 'sans-serif' }}
          key={item.id}
          title={
            item.displayName ||
            item.tooltip?.[i18n.resolvedLanguage as Lang] ||
            item.name
          }
          trigger={['hover', 'click', 'contextMenu']}
        >
          <GuardButton
            className="g2-social-login-item"
            onClick={onLogin}
            icon={<IconFont type={`${iconType}-fill`} />}
          ></GuardButton>
        </Tooltip>
      )
    }
  })
  const idp = enterpriseConnectionObjs.length ? (
    <>
      {!noLoginMethods && (
        <div className="g2-social-login-title">
          {i18n.t('login.otherLoginWay')}
        </div>
      )}
      <div className="g2-social-login-list g2-enterprise-connection-space">
        {idpButtons}
      </div>
    </>
  ) : null

  const socialLogin =
    socialLoginButtons.length > 0 && noLoginMethods ? (
      <Space
        size={noLoginMethods ? 0 : 12}
        className="g2-guard-full-width-space no-login-methods"
        direction="vertical"
      >
        {socialLoginButtons}
      </Space>
    ) : (
      socialLoginButtons.length > 0 && (
        <>
          <div className="g2-social-login-title">
            {t('login.thridAccLogin')}
          </div>
          <div className="g2-social-login-list g2-social-connection-space">
            {socialLoginButtons}
          </div>
        </>
      )
    )

  const otherLogin = (
    <div
      className="g2-social-login-list"
      style={{
        marginTop: -8
      }}
    >
      <PasskeyButton
        onLoginSuccess={onLoginSuccess}
        onLoginFailed={onLoginFailed}
      />
    </div>
  )

  return (
    <>
      {!noLoginMethods && (
        <div
          style={{
            flex: 1,
            minHeight: 16
          }}
        />
      )}
      <Space
        size={noLoginMethods ? 0 : 8}
        direction="vertical"
        className="g2-guard-full-width-space"
      >
        {!publicConfig?.ssoPageComponentDisplay.idpBtns || idp}
        {otherLogin}
        {!publicConfig?.ssoPageComponentDisplay.socialLoginBtns || socialLogin}
      </Space>
    </>
  )
}
