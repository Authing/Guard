import { getGuardHttp } from '../../_utils/guardHttp'

export const enum ResetAccountBusinessAction {
  ResetName = 'reset-username-before-auth'
}

export const authFlow = async (
  action: ResetAccountBusinessAction,
  content: {
    username: string
  }
) => {
  const { authFlow } = getGuardHttp()

  const res = await authFlow(action, { ...content })

  return res
}
