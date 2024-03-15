import { User } from 'authing-js-sdk'

import { getGuardHttp } from '../_utils/guardHttp'

import { CompleteInfoRequest, RegisterCompleteInfoInitData } from './interface'

export enum CompleteInfoAuthFlowAction {
  Complete = 'complete-completion',
  Skip = 'skip-completion'
}

export const authFlow = async (
  action: CompleteInfoAuthFlowAction,
  data?: CompleteInfoRequest
) => {
  const { authFlow } = getGuardHttp()

  const res = await authFlow(action, data)

  return res
}

const registerMethod = (
  fnName: RegisterCompleteInfoInitData['businessRequestName'] | string,
  content: any,
  profile: any
) => {
  const { post } = getGuardHttp()

  if (fnName === 'registerByEmail') {
    const phoneToken = profile.phoneToken

    delete profile.phoneToken

    return post('/api/v2/register-email', {
      ...content,
      profile: {
        ...content.profile,
        ...profile
      },
      phoneToken,
      postUserInfoPipeline: true
    })
  } else if (fnName === 'registerByPhoneCode') {
    const emailToken = profile?.emailToken

    delete profile?.emailToken
    return post('/api/v2/register-phone-code', {
      ...content,
      profile: {
        ...content.profile,
        ...profile
      },
      emailToken,
      postUserInfoPipeline: true
    })
  } else if (fnName === 'registerByEmailCode') {
    const phoneToken = profile.phoneToken

    delete profile.phoneToken
    return post('/api/v2/register-email-code', {
      ...content,
      profile: {
        ...content.profile,
        ...profile
      },
      phoneToken,
      postUserInfoPipeline: true
    }) as Promise<User>
  } else {
    const phoneToken = profile.phoneToken ?? content?.phoneToken
    const emailToken = profile.emailToken ?? content?.emailToken

    delete profile.phoneToken
    delete profile.emailToken
    return post(`/api/v2/register-${fnName.split('-')[0]}`, {
      ...content,
      profile: {
        ...content.profile,
        ...profile
      },
      postUserInfoPipeline: true,
      phoneToken,
      emailToken
    })
  }
}

export const registerSkipMethod = (
  fnName: RegisterCompleteInfoInitData['businessRequestName'] | string,
  content: any
) => {
  const { post } = getGuardHttp()

  if (fnName === 'registerByEmail') {
    return post('/api/v2/register-email', content)
  } else if (fnName === 'registerByPhoneCode') {
    return post('/api/v2/register-phone-code', content)
  } else if (fnName === 'registerByEmailCode') {
    return post('/api/v2/register-email-code', content)
  } else {
    return post(`/api/v2/register-${fnName.split('-')[0]}`, content)
  }
}

export const registerRequest = async (
  action: CompleteInfoAuthFlowAction,
  registerFnName: RegisterCompleteInfoInitData['businessRequestName'],
  registerContent: any,
  registerProfile?: any
) => {
  if (action === CompleteInfoAuthFlowAction.Skip) {
    return await registerSkipMethod(registerFnName, registerContent)
  } else if (action === CompleteInfoAuthFlowAction.Complete) {
    return await registerMethod(
      registerFnName,
      registerContent,
      registerProfile
    )
  }
}
