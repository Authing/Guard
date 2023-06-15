import { getGuardHttp } from '../_utils/guardHttp'

export enum ChangePasswordBusinessAction {
  ResetPassword = 'reset-password-first-time',
  FirstLoginReset = 'reset-password-forced',
  ResetPasswordStrengthDetection = 'reset-password-strength-detection'
}

export const authFlow = async (
  action: ChangePasswordBusinessAction,
  content: {
    password: string
    oldPassword?: string
  }
) => {
  const { authFlow } = getGuardHttp()

  const res = await authFlow(action, { ...content })

  return res
}
