import { GuardModuleType } from '../Guard'

import { IG2Config, IG2Events, IG2FCViewProps } from '../Type'

export interface SubmitSuccessEvents extends IG2Events {}

export interface SubmitSuccessConfig extends IG2Config {}

export interface SubmitSuccessInitData {
  title?: string
  message?: string
  text?: string
  countDesc?: string
  changeModule?: GuardModuleType
  needBack?: boolean
  goBack?: () => void
}

export interface GuardNewSubmitSuccessViewProps extends IG2FCViewProps, SubmitSuccessEvents {
  config: SubmitSuccessConfig
  initData?: SubmitSuccessInitData
}
