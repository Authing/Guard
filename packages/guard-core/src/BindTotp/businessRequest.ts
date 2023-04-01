import { getGuardHttp } from '../_utils/guardHttp'

export enum BindTotpBusinessAction {
  VerifyTotpFirstTime = 'verify-totp-first-time',
  ConfirmTotpRecoveryCode = 'confirm-totp-recovery-code'
}

export const authFlow = async (action: BindTotpBusinessAction, content: any) => {
  const { authFlow } = getGuardHttp()

  const res = await authFlow(action, { ...content })

  return res
}
