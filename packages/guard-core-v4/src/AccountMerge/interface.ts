export interface BriefUserInfo {
  displayName: string // 显示名称
  avatar: string // 头像
  phone: string // 手机号
  email: string // 邮箱
  username: string // 用户名
  name: string // 姓名
}

export interface GuardAccountMergeInitData {
  currentUserInfo: BriefUserInfo // 当前正在登录的用户
  existingUserInfo: BriefUserInfo // 已经存在的另一个用户
  mergeToken?: string // 自用在非 AuthFlow 的情况下，作为临时 Token
}

export interface UserRadioProps {
  currentUserInfo: BriefUserInfo
  existingUserInfo: BriefUserInfo
  onChange?: (value: any) => void
  value?: any
}

export interface UserRadioItemProps extends BriefUserInfo {
  value: boolean
  selected: boolean
  onClick: (value: boolean) => void
}

export enum AuthFlowAction {
  MERGE = 'confirm-account-merge'
}
