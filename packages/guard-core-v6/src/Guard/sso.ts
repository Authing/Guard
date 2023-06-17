import { User } from 'authing-js-sdk'

import { getGuardHttp } from '../_utils/guardHttp'

export interface SessionData {
  session: null | {
    _id: string
    cookie: {
      originalMaxAge: number
      expires: Date
      secure: boolean
      httpOnly: boolean
      path: string
      sameSite: string
    }
    appId?: string
    type: string
    userId: string
  }
  userInfo?: User
}

export const trackSession = async () => {
  const { get } = getGuardHttp()
  return await get<SessionData>('/cas/session', {})
}
