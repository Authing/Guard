import './styles.less'

import omit from 'lodash/omit'

import { React } from 'shim-react'

import {
  useGuardAppId,
  useGuardCurrentModule,
  useGuardEvents,
  useGuardHttpClient,
  useGuardInitData,
  useGuardPublicConfig
} from '../_utils/context'

import { useGuardAuthClient } from '../Guard/authClient'

import { GuardFace } from '../GuardFace'

import { GuardSelect } from '../GuardSelect'

import { IconFont } from '../IconFont'

import {
  TenantPortalDataItem,
  TenantPortalDataType,
  TenantPortalSelectType,
  TenantView
} from './interface'

import { useGuardView } from '../Guard/core/hooks/useGuardView'
import { JoinTenantView } from './core/JoinTenant'
import { useTranslation } from 'react-i18next'
import { JoinButton } from './JoinButton'
import { CreateButton } from './CreateButton'
import { CreateTenantView } from './core/CreateTenant'
import { Tag } from 'shim-antd'

const { useCallback, useMemo, useState } = React

export const GuardTenantPortalSelectView = () => {
  const { t } = useTranslation()
  const { moduleName } = useGuardCurrentModule()
  const { list, title, description, logo } =
    useGuardInitData<TenantPortalDataType>()
  const events = useGuardEvents()
  const authClient = useGuardAuthClient()
  const http = useGuardHttpClient()
  const publicConfig = useGuardPublicConfig()
  const appId = useGuardAppId()

  const [active, setActive] = useState<TenantView>('default')

  useGuardView()

  const handleSelect = useCallback(
    async (item?: TenantPortalDataItem) => {
      const metaData = omit<TenantPortalDataItem>(item, [
        'avatar',
        'extra',
        'userName',
        'title'
      ]) as TenantPortalSelectType
      events?.onTenantSelect?.(metaData)
      if (item?.host && appId !== publicConfig.defaultAppId) {
        http.setBaseUrl(item?.host)
      }
      if (!item?.isUserPool && item?.tenantId) {
        http.setTenantId(item?.tenantId)
      } else {
        http.setTenantId('') //使用前重置，防止其他环境设置污染，便于状态可控
      }

      const { isFlowEnd, onGuardHandling, data } = await http.authFlow(
        moduleName
      )
      if (isFlowEnd) {
        setTimeout(() => events?.onLogin?.(data, authClient)) // 让选择事件先行，登录成功宏任务异步，方便异步并发
      } else {
        onGuardHandling?.()
      }
    },
    [authClient, events, http, moduleName]
  )

  const dataSource = useMemo<TenantPortalDataItem[]>(
    () =>
      list?.map?.(it => ({
        ...it,
        title: it.isUserPool ? (
          <>
            {it.tenantName!}
            <Tag className="authing-tag blue">{t('common.visitor')}</Tag>
          </>
        ) : (
          it.tenantName!
        ),
        // description: it.userName!,
        avatar: {
          size: 40,
          src: it.tenantLogo!,
          style: {
            borderRadius: 4
          }
        },
        extra: (
          <div className="authing-gaurd-select-extra">
            <span>{t('common.enter')}</span>
            <IconFont
              type="authing-arrow-left-s-line" // 没有右箭头，使用左箭头旋转
              className="authing-gaurd-select-extra-icon"
            />
          </div>
        )
      })) as TenantPortalDataItem[],
    [list]
  )
  const TenantViewMap: { [key in TenantView]: React.ReactNode } = {
    default: (
      <div className="g2-view-container">
        <div className="g2-view-container-inner">
          <GuardFace title={title} description={description} avatar={logo} />
          {!!dataSource?.length ? (
            <>
              <GuardSelect
                dataSource={dataSource}
                onSelect={handleSelect}
                className="g2-view-container-tenant"
                gap={8}
              />
              <div className="g2-view-container-tenant">
                <JoinButton
                  style={{
                    padding: '8px 16px ',
                    marginTop: 8
                  }}
                  onClick={() => {
                    setActive('join')
                  }}
                />
              </div>
            </>
          ) : (
            <div className="g2-error-content g2-error-content-tenant">
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  style={{
                    width: 240,
                    height: 160,
                    backgroundImage:
                      'url(https://authing-files.oss-cn-zhangjiakou.aliyuncs.com/authing-guard/authing_error.svg)',
                    backgroundSize: 'contain'
                  }}
                />
              </div>
              <span
                className="g2-error-message-text"
                dangerouslySetInnerHTML={{ __html: t('common.noTenant') }}
              />
              <JoinButton
                className="authing-tenant-join"
                onClick={() => {
                  setActive('join')
                }}
              />
            </div>
          )}
        </div>
        <CreateButton onClick={() => setActive('create')} />
        {/* <VisitorButton
          onClick={() => {
            handleSelect(list[0])
          }}
        /> */}
      </div>
    ),
    join: (
      <JoinTenantView
        onBack={() => {
          setActive('default')
        }}
      />
    ),
    create: (
      <CreateTenantView
        onBack={() => {
          setActive('default')
        }}
      />
    )
  }
  return <>{TenantViewMap[active]}</>
}
