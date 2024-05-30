import {
  CredentialCreationOptionsJSON,
  CredentialRequestOptionsJSON,
  PublicKeyCredentialWithAssertionJSON,
  PublicKeyCredentialWithAttestationJSON
} from '@github/webauthn-json'
import { AuthingGuardResponse } from '../_utils/http'
import { useGuardIsAuthFlow } from '../_utils/context'

import { getGuardHttp } from '../_utils/guardHttp'

export enum MfaBusinessAction {
  VerifyEmail = 'verify-email',
  VerifySms = 'verify-sms',
  VerifyTotp = 'verify-totp',
  VerifyNington = 'verify-nington',
  VerifyFace = 'verify-face',
  AssociateFace = 'associate-face',
  PasskeyBind = 'passkey-bind',
  PasskeyVerify = 'passkey-verify'
}

export const authFlow = async (action: MfaBusinessAction, content: any) => {
  const { authFlow } = getGuardHttp()

  const res = await authFlow(action, { ...content })

  return res
}

interface VerifySmsContent {
  phone: string
  code: string
  mfaToken?: string
  phoneCountryCode?: string
}

interface VerifyEmailContent {
  email: string
  code: string
  mfaToken?: string
}

interface VerifyTotpContent {
  totp: string
  mfaToken?: string
}
interface VerifyNingtonContent {
  totp: string
  mfaToken?: string
}

interface VerifyFaceContent {
  photo: string
  mfaToken?: string
}

interface AssociateFaceContent {
  photoA: string
  photoB: string
  isExternalPhoto?: boolean
  mfaToken?: string
}

type BindPasskeyContent = PublicKeyCredentialWithAttestationJSON

interface VerifyPasskeyContent {
  credential: PublicKeyCredentialWithAssertionJSON
  ticket: string
}

interface GetPasskeyBindChallengeParams {
  mfaToken: string
}

interface GetPasskeyVerifyChallengeParams {
  mfaToken: string
}

export const VerifyEmail = async (content: VerifyEmailContent) => {
  const { email, code, mfaToken } = content
  const { post } = getGuardHttp()

  return await post(
    '/api/v2/applications/mfa/email/verify',
    {
      email,
      code
    },
    {
      headers: {
        authorization: `Bearer ${mfaToken}`
      }
    }
  )
}

export const VerifySms = async (content: VerifySmsContent) => {
  const { phone, code, mfaToken, phoneCountryCode } = content
  const { post } = getGuardHttp()

  return await post(
    '/api/v2/applications/mfa/sms/verify',
    {
      phone,
      code,
      phoneCountryCode
    },
    {
      headers: {
        authorization: `Bearer ${mfaToken}`
      }
    }
  )
}

export const VerifyTotp = async (content: VerifyTotpContent) => {
  const { totp, mfaToken } = content
  const { post } = getGuardHttp()

  return await post(
    '/api/v2/applications/mfa/totp/verify',
    {
      totp
    },
    {
      headers: {
        authorization: `Bearer ${mfaToken}`
      }
    }
  )
}
export const VerifyNington = async (content: VerifyNingtonContent) => {
  const { totp, mfaToken } = content
  const { post } = getGuardHttp()

  return await post(
    '/api/v2/applications/mfa/totp/verify',
    {
      totp
    },
    {
      headers: {
        authorization: `Bearer ${mfaToken}`
      }
    }
  )
}

export const VerifyFace = async (content: VerifyFaceContent) => {
  const { photo, mfaToken } = content
  const { post } = getGuardHttp()

  return await post(
    '/api/v2/applications/mfa/face/verify',
    {
      photo
    },
    {
      headers: {
        authorization: `Bearer ${mfaToken}`
      }
    }
  )
}

export const AssociateFace = async (content: AssociateFaceContent) => {
  const { photoA, photoB, isExternalPhoto, mfaToken } = content
  const { post } = getGuardHttp()

  return await post(
    '/api/v2/mfa/face/associate',
    {
      photoA,
      photoB,
      isExternalPhoto
    },
    {
      headers: {
        authorization: `Bearer ${mfaToken}`
      }
    }
  )
}

export const GetPasskeyBindChallenge = async (
  content: GetPasskeyBindChallengeParams
): Promise<AuthingGuardResponse<CredentialCreationOptionsJSON>> => {
  const { mfaToken } = content
  const { post } = getGuardHttp()

  return await post(
    '/api/v3/webauthn/mfa-bind/initialize',
    {},
    {
      headers: {
        authorization: `Bearer ${mfaToken}`
      }
    }
  )
}

export const GetPasskeyVerifyChallenge = async (
  content: GetPasskeyVerifyChallengeParams
): Promise<
  AuthingGuardResponse<
    CredentialRequestOptionsJSON & {
      ticket: string
    }
  >
> => {
  const { mfaToken } = content
  const { post } = getGuardHttp()

  return await post(
    '/api/v3/webauthn/mfa-verify/initialize',
    {},
    {
      headers: {
        authorization: `Bearer ${mfaToken}`
      }
    }
  )
}

export const useMfaBusinessRequest = () => {
  const isFlow = useGuardIsAuthFlow()

  const request = {
    [MfaBusinessAction.VerifyEmail]: (content: VerifyEmailContent) => {
      if (isFlow) {
        return authFlow(MfaBusinessAction.VerifyEmail, content)
      }

      return VerifyEmail(content)
    },
    [MfaBusinessAction.VerifySms]: (content: VerifySmsContent) => {
      if (isFlow) {
        return authFlow(MfaBusinessAction.VerifySms, content)
      }

      return VerifySms(content)
    },
    [MfaBusinessAction.VerifyTotp]: (content: VerifyTotpContent) => {
      if (isFlow) {
        return authFlow(MfaBusinessAction.VerifyTotp, content)
      }

      return VerifyTotp(content)
    },
    [MfaBusinessAction.VerifyFace]: (content: VerifyFaceContent) => {
      if (isFlow) {
        return authFlow(MfaBusinessAction.VerifyFace, content)
      }

      return VerifyFace(content)
    },
    [MfaBusinessAction.AssociateFace]: (content: AssociateFaceContent) => {
      if (isFlow) {
        return authFlow(MfaBusinessAction.AssociateFace, content)
      }

      return AssociateFace(content)
    },

    [MfaBusinessAction.PasskeyBind]: (content: BindPasskeyContent) => {
      if (isFlow) {
        return authFlow(MfaBusinessAction.PasskeyBind, content)
      }

      // return AssociateFace(content)
      return null
    },
    [MfaBusinessAction.PasskeyVerify]: (content: VerifyPasskeyContent) => {
      if (isFlow) {
        return authFlow(MfaBusinessAction.PasskeyVerify, content)
      }

      // return AssociateFace(content)
      return null
    },
    [MfaBusinessAction.VerifyNington]: (content: VerifyNingtonContent) => {
      if (isFlow) {
        return authFlow(MfaBusinessAction.VerifyNington, content)
      }

      return VerifyNington(content)
    }
  }

  return request
}
