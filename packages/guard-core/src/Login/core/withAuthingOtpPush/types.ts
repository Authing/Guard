import { BackFillMultipleState, StoreInstance } from '../../../Guard/core/hooks/useMultipleAccounts'

import { Agreement } from '../../../Type'

export interface OnPushSuccessProps {
  pushCodeId: string
}

export interface CheckPushCodeStatusProps {
  pushCodeId: string
}

export interface OnLoginProps {
  account: string
}

export type LoginStatus = 'before' | 'pending'

export interface LoginWithAuthingOtpPushProps {
  onLoginSuccess?: any
  multipleInstance?: StoreInstance
  initData?: BackFillMultipleState
  agreements: Agreement[]
}

export interface PushLoginGudeModalProps {
  visible: boolean
  onClose: () => void
}

export type Selector = 'howUsePushLogin' | 'howBindClient' | 'howGetAppLoginUrl'

export interface SelectorOption {
  value: Selector
  label: string
}

export type SelectorOptions = SelectorOption[]
