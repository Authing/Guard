import { AvatarProps } from 'shim-antd'

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
  isJoin?: boolean // 加入租户按钮
}

/** 租户门户相关事件 */
export interface TenantPortalEvents extends IG2Events {
  onLogin?: (user: User, authClient: AuthenticationClient) => void
  /** 租户门户选择回调 */
  onTenantSelect?: (data?: TenantPortalSelectType) => void
}

export type TenantView = 'default' | 'join' | 'create'

export interface TenantButtonProps {
  className?: string
  onClick?: () => void
  style?: React.CSSProperties
  icon: string
  text: string
}

export interface BackProps {
  onBack: () => void
}

export interface CreateTenantProps extends BackProps {}

export interface JoinTenantProps extends BackProps {}

export enum JoinTenantStepEnum {
  InputTenantCode = 'inputTenantCode',
  InputEnterpriseEmail = 'inputEnterpriseEmail',
  VerifyEmailCode = 'verifyEmailCode',
  NoEnterpriseDomain = 'noEnterpriseDomain',
  JoinSuccess = 'joinSuccess',
  JoinFailed = 'joinFailed'
}
