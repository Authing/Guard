import { AvatarProps } from 'shim-antd/lib/avatar'

import { AuthenticationClient, IG2Events, User } from '../Type'

export interface TenantPortalListType {
  tenantName: string
  tenantId: string
  tenantLogo: string
  host: string
  description: string
  /** 是否为用户池 */
  isUserPool: boolean
  userName?: string
}

export interface TenantPortalSelectType
  extends Omit<TenantPortalListType, 'userName'> {}

/** 租户门户选择状态机返回数据类型 */
export interface TenantPortalDataType {
  title: string
  description: string
  logo: string
  list: TenantPortalListType[]
}

export interface TenantPortalDataItem extends TenantPortalListType {
  avatar?: AvatarProps
  extra?: React.ReactNode
  title?: string
}

/** 租户门户相关事件 */
export interface TenantPortalEvents extends IG2Events {
  onLogin?: (user: User, authClient: AuthenticationClient) => void
  /** 租户门户选择回调 */
  onTenantSelect?: (data?: TenantPortalSelectType) => void
}
