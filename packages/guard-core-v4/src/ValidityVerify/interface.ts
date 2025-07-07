import { GuardModuleType } from '../Guard'

import { IG2Config, IG2Events, IG2FCViewProps } from '../Type'

export interface ValidityVerifyInitData {
  email?: string
  ticket?: string
}

export interface GuardSubmitSuccessViewProps extends IG2FCViewProps {
  initData?: ValidityVerifyInitData
}
