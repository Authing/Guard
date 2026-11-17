import { Avatar, message, Input, Tooltip } from 'shim-antd'

import qs from 'qs'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { getGuardWindow } from '../../../Guard/core/useAppendConfig'

import { GuardButton } from '../../../GuardButton'

import { IconFont } from '../../../IconFont'

import { ApplicationConfig, Protocol } from '../../../Type/application'

import { getVersion } from '../../../_utils'

import { popupCenter } from '../../../_utils'

import { useGuardTenantId, useIsSpecialBrowser } from '../../../_utils/context'

import { SocialConnectionEvent, useDebounce } from '../../../_utils/hooks'

import { i18n } from '../../../_utils/locales'

import { baseLoginPathMapping, loginUrlFieldMapping } from '../../interface'

import { useDeviceId } from '../../../Guard/core/hooks/useDeviceId'

import classNames from 'classnames'

import {
  useGuardAppId,
  useGuardPublicConfig,
  useGuardFinallyConfig
} from '../../../_utils/context'

const { useCallback, useState, useEffect, useMemo } = React

const allSymbol = Symbol('all')

export const IdpButton = (props: any) => {
  // TODO: 能不能加个类型
  const {
    i,
    appId,
    appHost,
    isHost,
    isLastLogin,
    beforeLogin,
    status = true,
    iconOnly = false
  } = props

  const deviceId = useDeviceId()

  const { t } = useTranslation()

  const tenantId = useGuardTenantId()

  const version = getVersion()

  const isSpecialBrowser = useIsSpecialBrowser()

  const renderBtn = useCallback(() => {
    const loginLabel = t('login.loginBy', { name: i.displayName })
    const renderButton = (icon: React.ReactNode, onLogin: () => void) => {
      const button = (
        <GuardButton
          key={i.identifier}
          className={
            iconOnly ? 'g2-social-login-item' : 'g2-guard-third-login-btn'
          }
          block={!iconOnly}
          size="large"
          style={iconOnly ? { padding: 0 } : undefined}
          aria-label={loginLabel}
          icon={icon}
          onClick={() => {
            if (beforeLogin && !beforeLogin()) return
            onLogin()
          }}
        >
          {!iconOnly && loginLabel}
          {!status && (
            <IconFont
              type="authing-error-warning-line1"
              style={
                iconOnly
                  ? {
                      color: '#FB9926',
                      fontSize: 12,
                      position: 'absolute',
                      top: 2,
                      right: 2
                    }
                  : { color: '#FB9926', fontSize: 16, marginLeft: 8 }
              }
            />
          )}
          {!iconOnly && isLastLogin && (
            <div className="last-login-tag">{t('common.lastUsed')}</div>
          )}
        </GuardButton>
      )

      return iconOnly ? (
        <Tooltip
          title={
            isLastLogin ? `${loginLabel} (${t('common.lastUsed')})` : loginLabel
          }
          trigger={['hover', 'focus']}
        >
          {button}
        </Tooltip>
      ) : (
        button
      )
    }

    const query: Record<string, any> = {
      from_guard: '1',
      app_id: appId,
      guard_version: `Guard@${version}`,
      ...(tenantId && { tenant_id: tenantId }),
      ...(deviceId && { device_id: deviceId })
    }

    if (isHost) {
      delete query.from_guard
      query.from_hosted_guard = '1'

      if (isSpecialBrowser) {
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

      return renderButton(
        <IconFont
          type={`${iconType}-fill`}
          style={{
            fontSize: iconOnly ? 24 : 20,
            marginRight: iconOnly ? 0 : 8
          }}
        />,
        onLogin
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

      return renderButton(
        <Avatar
          size={iconOnly ? 32 : 20}
          src={i.logo}
          style={{ marginRight: iconOnly ? 0 : 8 }}
        />,
        () => {
          if (query.redirected) {
            window.location.replace(initUrl)
          } else {
            popupCenter(initUrl)
          }
        }
      )
    }
  }, [
    appId,
    i,
    t,
    isHost,
    appHost,
    tenantId,
    deviceId,
    iconOnly,
    isLastLogin,
    beforeLogin,
    status,
    version,
    isSpecialBrowser
  ])
  return renderBtn()
}

export const MoreIdpButton = (props: {
  idps: ApplicationConfig['identityProviders']
  beforeLogin?: () => boolean
}) => {
  const { idps, beforeLogin } = props

  const { t } = useTranslation()

  const resolvedLanguage = i18n.resolvedLanguage ?? i18n.language

  const appId = useGuardAppId()

  const config = useGuardFinallyConfig()

  const publicConfig = useGuardPublicConfig()

  const customMoreI18n =
    publicConfig.ssoPageComponentDisplay?.idpLayout?.customMoreI18n

  const [filterTag, setFilterTag] = useState<any>(allSymbol)

  const [filterKey, setFilterKey] = useState<string>('')

  const userPoolId = publicConfig?.userPoolId

  const [open, setOpen] = useState(false)

  const tagsSet = useMemo(() => {
    return [...new Set(idps.flatMap(item => item.tags || []))]
  }, [])

  const renderIdps = useMemo(() => {
    return idps.filter(idp => {
      // 检查 tag 过滤
      const matchTag =
        filterTag === allSymbol || idp.tags?.some(tag => tag === filterTag)
      // 检查关键词过滤
      const matchKey = idp.displayName.includes(filterKey)
      return matchTag && matchKey
    })
  }, [filterTag, idps, filterKey])

  const handleSearch = useDebounce((value: string) => {
    setFilterKey(value)
  }, 500)

  const more = useMemo(() => {
    return (
      (customMoreI18n?.i18n?.[resolvedLanguage].enabled
        ? customMoreI18n?.i18n?.[resolvedLanguage]?.value
        : customMoreI18n?.default) ?? t('common.more')
    )
  }, [customMoreI18n, resolvedLanguage])

  // 点击非 g2-guard-more-idp-wrapper 区域关闭弹窗
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.g2-guard-more-idp-wrapper')) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('click', handleClickOutside)
    } else {
      document.removeEventListener('click', handleClickOutside)
    }
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [open])

  return (
    <>
      <GuardButton
        className="g2-guard-third-login-btn"
        block
        size="large"
        onClick={() => setOpen(true)}
      >
        {more}
      </GuardButton>
      <section className={classNames('g2-guard-more-idp-wrapper', { open })}>
        <div className="g2-guard-more-idp-container">
          <div className="g2-guard-more-idp-ops">
            <div className="g2-guard-more-idp-header">
              <div>{t('common.moreIdps')}</div>
              <div
                className="g2-guard-more-idp-header-arrow-icon"
                onClick={() => setOpen(false)}
              >
                <IconFont type="authing-arrow-down-s-line" />
              </div>
            </div>
            <div>
              <Input.Search
                enterButton={false}
                prefix={<IconFont type="authing-search-line" />}
                addonAfter={false}
                addonBefore={false}
                className="g2-guard-search-input authing-g2-input"
                placeholder="搜索"
                onChange={e => handleSearch(e.target.value)}
              />
            </div>
            <div className="g2-guard-tag-list">
              {/* tags */}
              <div
                className={classNames('g2-guard-tag-item', {
                  active: filterTag === allSymbol
                })}
                onClick={() => setFilterTag(allSymbol)}
              >
                {t('common.all')}
              </div>
              {tagsSet.map(tags => {
                return (
                  <div
                    className={classNames('g2-guard-tag-item', {
                      active: filterTag === tags
                    })}
                    onClick={() => setFilterTag(tags)}
                  >
                    {tags}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="g2-guard-more-idp-list">
            {/* idp 列表 */}
            {renderIdps.map(i => {
              return (
                <IdpButton
                  status={i.tagsStatus}
                  key={i.identifier}
                  i={i}
                  appId={appId}
                  appHost={config?.host}
                  userPoolId={userPoolId}
                  isHost={config?.isHost}
                  beforeLogin={beforeLogin}
                />
              )
            })}
            {filterKey && renderIdps.length === 0 && (
              <div className="g2-tags-empty-filter">
                {t('common.noFindIdps', [filterKey])}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
