import { getGuardHttp } from '../_utils/guardHttp'

export enum TotpRecoveryCodeBusinessAction {
  RecoveryTotp = 'recovery-totp',
  ConfirmTotpRecoveryCode = 'confirm-totp-recovery-code'
}

export async function authFlow<T>(action: TotpRecoveryCodeBusinessAction, content: any) {
  const { authFlow } = getGuardHttp()

  const res = await authFlow<T>(action, { ...content })

  return res
}
