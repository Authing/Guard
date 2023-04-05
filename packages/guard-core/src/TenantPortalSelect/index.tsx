import './styles.less'

import omit from 'lodash/omit'

import { React } from 'shim-react'

import {
  useGuardCurrentModule,
  useGuardEvents,
  useGuardHttpClient,
  useGuardInitData
} from '../_utils/context'

import { useGuardAuthClient } from '../Guard/authClient'

import { GuardFace } from '../GuardFace'

import { GuardSelect } from '../GuardSelect'

import { IconFont } from '../IconFont'

import { TenantPortalDataItem, TenantPortalDataType, TenantPortalSelectType } from './interface'

import { useGuardView } from '../Guard/core/hooks/useGuardView'

const { useCallback, useMemo } = React

export const GuardTenantPortalSelectView = () => {
  const { moduleName } = useGuardCurrentModule()
  const { list, title, description, logo } = useGuardInitData<TenantPortalDataType>()
  const events = useGuardEvents()
  const authClient = useGuardAuthClient()
  const http = useGuardHttpClient()

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
      if (item?.host) {
        http.setBaseUrl(item?.host)
      }
      const { isFlowEnd, onGuardHandling, data } = await http.authFlow(moduleName)
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
        title: it.tenantName!,
        description: it.userName!,
        avatar: { size: 40, src: it.tenantLogo! },
        extra: (
          <IconFont
            type="authing-arrow-left-s-line" // 没有右箭头，使用左箭头旋转
            className="authing-gaurd-select-extra-icon"
          />
        )
      })) as TenantPortalDataItem[],
    [list]
  )
  return (
    <div className="g2-view-container">
      <div className="g2-view-container-inner">
        <GuardFace title={title} description={description} avatar={logo} />
        {!!dataSource?.length && <GuardSelect dataSource={dataSource} onSelect={handleSelect} />}
      </div>
    </div>
  )
}
