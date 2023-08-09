import { AuthenticationClient, CommonMessage, User } from 'authing-js-sdk'

import {
  getDefaultG2Config,
  IG2Config,
  IG2Events,
  IG2FCProps,
  Lang
} from '../Type'

export interface CompleteInfoConfig extends IG2Config {}

const defaultConfig: CompleteInfoConfig = {
  ...getDefaultG2Config()
}

export const getDefaultCompleteInfoConfig = (): CompleteInfoConfig => ({
  ...getDefaultG2Config(),
  ...defaultConfig
})

export interface CompleteInfoEvents extends IG2Events {
  onRegisterInfoCompleted?: (
    user: User,
    udfs: {
      key: any
      value: any
    }[],
    authClient: AuthenticationClient
  ) => void
  onRegisterInfoCompletedError?: (
    error: CommonMessage,
    udfs: {
      key: any
      value: any
    }[],
    authClient: AuthenticationClient
  ) => void
}

export interface GuardCompleteInfoProps extends IG2FCProps, CompleteInfoEvents {
  config: Partial<CompleteInfoConfig>
}

export interface GuardCompleteInfoViewProps extends GuardCompleteInfoProps {
  config: CompleteInfoConfig
  initData: any
  onLogin?: any
}

export type ExtendsFieldType = 'user' | 'internal'

export interface ExtendsField {
  type: ExtendsFieldType
  name: string
  label: string
  inputType: string
  required: boolean
  validateRules: any[]
}

export enum FormValidateRule {
  NONE = 'none',
  EMAIL = 'email',
  PHONE = 'phone',
  IS_NUMBER = 'isNumber',
  REG_EXP = 'regExp'
}

export interface CompleteInfoRule {
  type: FormValidateRule
  content: string
  errorMessage?: string
  i18n?: {
    errorMessage: Record<Lang, []>
  }
}

export interface CompleteInfoSelectOption {
  value: string
  label: string
}

export interface CompleteInfoMetaData {
  type: CompleteInfoBaseControls | CompleteInfoExtendsControls
  label: string
  name: string
  required: boolean
  validateRules: CompleteInfoRule[]
  options?: CompleteInfoSelectOption[]
}

export enum CompleteInfoBaseControls {
  USERNAME = 'username',
  PHONE = 'phone',
  EMAIL = 'email'
}

export enum CompleteInfoExtendsControls {
  IMAGE = 'image',
  NUMBER = 'number',
  DATE = 'date',
  DATE_TIME = 'datetime',
  SELECT = 'select',
  DROPDOWN = 'dropdown',
  BOOLEAN = 'boolean',
  STRING = 'string',
  TEXT = 'text',
  GENDER = 'gender',
  COUNTRY = 'country'
}

export interface CompleteInfoInitData {
  skip: boolean
  metaData: CompleteInfoMetaData[]
}

export interface RegisterCompleteInfoInitData {
  content: any
  businessRequestName:
    | 'registerByEmail'
    | 'registerByPhoneCode'
    | 'registerByEmailCode'
  onRegisterFailed: Function
  onRegisterSuccess: Function
}

export interface RegisterCompletePasswordInitData
  extends RegisterCompleteInfoInitData {
  isChangeComplete: boolean
}
export interface CompleteInfoRequest {
  fieldValues: {
    name: string
    value: string
    code?: string
  }[]
}

export enum OmitCompleteInfo {
  'registerByEmail' = 'email',
  'registerByPhoneCode' = 'phone',
  'registerByEmailCode' = 'email',
  'phone-password' = 'phone'
}
