import { getDefaultG2Config, IG2Config, IG2Events, IG2FCProps } from '../Type'

import { AuthenticationClient, User } from 'authing-js-sdk'

export interface MFAConfig extends IG2Config {
  autoRegister: boolean
}

const defaultConfig: MFAConfig = {
  ...getDefaultG2Config(),
  autoRegister: false
}

export const getDefaultMFAConfig = (): MFAConfig => ({
  ...getDefaultG2Config(),
  ...defaultConfig
})

export interface MFAEvents extends IG2Events {
  onLogin?: (user: User, authClient: AuthenticationClient) => void
}

export enum MFAType {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  TOTP = 'OTP',
  FACE = 'FACE',
  PASSKEY = 'PASSKEY',
  NINGDON = 'NINGDON'
}

export interface GuardMFAInitData {
  mfaToken: string
  applicationMfa: {
    mfaPolicy: MFAType
    sort: number
    status: 0 | 1
  }[]
  phoneCountryCode?: string
  faceMfaEnabled: boolean
  totpMfaEnabled: boolean
  ningDonMfaEnable: boolean
  email?: string
  phone?: string
  avatar?: string
  nickme?: string
  username?: string
  current?: MFAType
  mfaPhoneCountryCode?: string
  mfaPhone?: string
  mfaEmail?: string
}

export interface GuardMFAProps extends IG2FCProps, MFAEvents {
  config: Partial<MFAConfig>
  initData: GuardMFAInitData
}

export interface GuardMFAViewProps extends GuardMFAProps {
  config: MFAConfig
  initData: GuardMFAInitData
}
