import { Avatar, message } from 'shim-antd'

import qs from 'qs'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { getGuardWindow } from '../../../Guard/core/useAppendConfig'

import { GuardButton } from '../../../GuardButton'

import { IconFont } from '../../../IconFont'

import { Protocol } from '../../../Type/application'

import { getVersion } from '../../../_utils'

import { isSpecialBrowser, popupCenter } from '../../../_utils'

import { useGuardTenantId } from '../../../_utils/context'

import { SocialConnectionEvent } from '../../../_utils/hooks'

import { i18n } from '../../../_utils/locales'

const { useCallback } = React

const baseLoginPathMapping: Partial<Record<Protocol, string | null>> = {
  [Protocol.OIDC]: '/connections/oidc/init',
  [Protocol.SAML]: '/connections/saml/init',
  [Protocol.CAS]: '/connections/cas/init',
  [Protocol.OAUTH]: '/connections/oauth2/init',
  [Protocol.AZURE_AD]: '/connections/azure-ad/init',
  [Protocol.AD_KERBEROS]: '/connections/ad-kerberos/init'
}

const loginUrlFieldMapping: Partial<Record<Protocol, string>> = {
  [Protocol.OIDC]: 'oidcConnectionLoginUrl',
  [Protocol.SAML]: 'samlRequest',
  [Protocol.CAS]: 'casConnectionLoginUrl',
  [Protocol.OAUTH]: 'authUrl',
  [Protocol.AZURE_AD]: 'authorizationUrl',
  [Protocol.AD_KERBEROS]: 'authorizationUrl'
}

export const IdpButton = (props: any) => {
  // TODO: 能不能加个类型
  const { i, appId, appHost, isHost } = props

  const { t } = useTranslation()

  const tenantId = useGuardTenantId()

  const version = getVersion()

  const renderBtn = useCallback(() => {
    const query: Record<string, any> = {
      from_guard: '1',
      app_id: appId,
      guard_version: `Guard@${version}`,
      ...(tenantId && { tenant_id: tenantId })
    }

    if (isHost) {
      delete query.from_guard
      query.from_hosted_guard = '1'

      if (isSpecialBrowser()) {
        query.redirected = '1'

        const guardWindow = getGuardWindow()
        if (guardWindow) {
          // 如果 isHost 是 true，则从 url 获取 finish_login_url 作为 social.authorize 方法的 targetUrl 参数
          query.redirect_url = qs.parse(guardWindow.location.search)?.[
            'finish_login_url'
          ]
        }
      }
    }

    if (i?.provider) {
      // 社交身份源
      const iconType = `authing-${i.provider.replace(/:/g, '-')}`

      const onLogin = () => {
        if (i.action === SocialConnectionEvent.Message) {
          message.error(
            t('login.socialConnectionMessage', {
              provider:
                i.displayName ??
                (i18n.resolvedLanguage === 'zh-CN' ? i.name : i.name_en) ??
                i.provider
            })
          )
        } else if (i.action === SocialConnectionEvent.Auth) {
          const initUrl = `${appHost}/connections/social/${
            i.identifier
          }?${qs.stringify(query)}`
          if (query.redirected) {
            window.location.replace(initUrl)
          } else {
            popupCenter(initUrl)
          }
        }
      }

      return (
        <GuardButton
          key={i.identifier}
          className="g2-guard-third-login-btn"
          block
          size="large"
          icon={
            <IconFont
              type={`${iconType}-fill`}
              style={{ fontSize: 20, marginRight: 8 }}
            />
          }
          onClick={onLogin}
        >
          {t('login.loginBy', {
            name: i.displayName
          })}
        </GuardButton>
      )
    } else {
      let initUrl: string

      if (isHost) {
        // 托管登录页，直接写死登录 URL
        query.identifier = i.identifier

        const basePath = baseLoginPathMapping[i.protocol as Protocol]
        if (!basePath) {
          return null
        }

        initUrl = `${appHost}${basePath}?${qs.stringify(query)}`
      } else {
        const field = loginUrlFieldMapping[i.protocol as Protocol]
        if (!field) {
          return null
        }

        // 嵌入式组件，从配置字段获取登录 URL
        initUrl = i.config[field]
      }

      return (
        <GuardButton
          key={i.identifier}
          className="g2-guard-third-login-btn"
          block
          size="large"
          icon={<Avatar size={20} src={i.logo} style={{ marginRight: 8 }} />}
          onClick={() => {
            if (query.redirected) {
              window.location.replace(initUrl)
            } else {
              popupCenter(initUrl)
            }
          }}
        >
          {t('login.loginBy', {
            name: i.displayName
          })}
        </GuardButton>
      )
    }
  }, [appId, i, t, isHost, appHost, tenantId])
  return renderBtn()
}
