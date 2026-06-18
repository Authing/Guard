import { Avatar, message, Input } from 'shim-antd'

import qs from 'qs'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { getGuardWindow } from '../../../Guard/core/useAppendConfig'

import { GuardButton } from '../../../GuardButton'

import { IconFont } from '../../../IconFont'

import { ApplicationConfig, Protocol } from '../../../Type/application'

import { getVersion } from '../../../_utils'

import { popupCenter, larkPopupCenter } from '../../../_utils'

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
  const { i, appId, appHost, isHost, isLastLogin, status = true } = props

  const deviceId = useDeviceId()

  const { t } = useTranslation()

  const tenantId = useGuardTenantId()

  const version = getVersion()

  const isSpecialBrowser = useIsSpecialBrowser()

  const renderBtn = useCallback(() => {
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
            if (i.provider === 'lark-internal') {
              larkPopupCenter(initUrl)
            } else {
              popupCenter(initUrl)
            }
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
          {!status && (
            <IconFont
              type="authing-error-warning-line1"
              style={{ color: '#305EE8', fontSize: 16, marginLeft: 8 }}
            />
          )}
          {isLastLogin && (
            <div className="last-login-tag">{t('common.lastUsed')}</div>
          )}
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
          {!status && (
            <IconFont
              type="authing-error-warning-line1"
              style={{ color: '#305EE8', fontSize: 16, marginLeft: 8 }}
            />
          )}
          {isLastLogin && (
            <div className="last-login-tag">{t('common.lastUsed')}</div>
          )}
        </GuardButton>
      )
    }
  }, [appId, i, t, isHost, appHost, tenantId, deviceId])
  return renderBtn()
}

export const MoreIdpButton = (props: {
  idps: ApplicationConfig['identityProviders']
}) => {
  const { idps } = props

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
                className="g2-guard-search-input genauth-g2-input"
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
