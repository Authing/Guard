import { useGuardIsAuthFlow } from '../_utils/context'

import { getGuardHttp } from '../_utils/guardHttp'

export enum TenantBusinessAction {
  JoinTenant = 'join-tenant-portal',
  CreateTenant = 'create-tenant-portal'
}

export const authFlow = async (action: TenantBusinessAction, content: any) => {
  const { authFlow } = getGuardHttp()

  const res = await authFlow(action, { ...content })

  return res
}

export const getTenantInfoByCode = async (code: string) => {
  const { get } = getGuardHttp()
  return await get('/api/v3/get-tenant-public-info-by-code', {
    code
  })
}
