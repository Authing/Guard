import { message as messageNote } from 'shim-antd'
import { useCallback } from 'react'
import { GuardModuleType } from '../Guard/module'
import { useGuardAuthClient } from '../Guard/authClient'
import { Lang } from '../Type'
import {
  useGuardEvents,
  useGuardHttpClient,
  useGuardModule
} from '../_utils/context'
import { getGuardHttp } from '../_utils/guardHttp'

export interface InviteContext {
  // autoLogin: boolean
  token: string
  email: string | null
  ticket: string
  enabledIdentifierCodeConfig: boolean
  enabledInfoFill: boolean
  // enabledExtIdpBind: boolean
  allowSkipBindExtIdp: boolean
  sendVerifyCodeMethod: 'prioritySMS' | 'priorityEmail'
  // receiverType: 'emailCode' | 'phoneCode'
  phoneCountryCode: string | null
  phone: string | null
  username: string | null
  name: string | null
  // verifyCodeMaxLength: number
  verifyCodeMaxErrCount: number
  extendsFieldsI18n?: {
    [key: string]: Record<Lang, { enabled: boolean; value: string }>
  }
  extendsFieldsOptions?: {
    key: string
    options: {
      value: string
      label: string
    }[]
  }[]
  extendsFields: any
  // qrCodeBindMethods: Record<
  //   string,
  //   { QRConfig: any; id: string; isDefault: boolean; title: string }[]
  // >
  // socialConnections: any[]
  registerInfoFillMsg?: string
  // 身份源绑定提示信息
  // extIdpBindMsg?: string
}

export interface GuardInviteLoginInitData extends Partial<InviteContext> {
  canBack?: boolean
  verifyAccount: string
  context: any
  originModule: GuardModuleType
  originContext: any
}

export interface GuardInviteCompleteInitData
  extends Partial<GuardInviteLoginInitData> {
  metaData: any
}
export interface GuardInviteIdentityBindInitData
  extends Partial<GuardInviteLoginInitData> {
  weComConfig: {
    QRConfig: any
    id: string
    isDefault: boolean
    title: string
  }

  isNew: boolean // 是否是新版服务提供商

  socialConnections: any[]
}

export interface EyGuardProtocolInitData {
  onAcceptHandle: () => void
  onRejectHandle: () => void
  mode: 'Guard' | 'Portal'
}

export interface EyLoginProps {
  onBeforeLogin?: (loginInfo: any) => void
  onLoginSuccess?: (data: any, message?: string) => void
  onLoginFailed?: (code: number, data: any, message?: string) => void
}

export const useRegisterHandleHook = (
  initData: any,
  submitButtonRef?: {
    current: { onSpin: (arg0: boolean) => void }
  }
) => {
  const authClient = useGuardAuthClient()

  const events = useGuardEvents()

  const { post } = useGuardHttpClient()

  const { authFlow } = getGuardHttp()

  const { changeModule } = useGuardModule()

  // 核心注册接口
  const onRegisterHandle = useCallback(
    async context => {
      const onBeforeRegister = events?.onBeforeRegister
      if (onBeforeRegister) {
        try {
          const canRegister = await onBeforeRegister(
            {
              type: context.verifyType,
              data: context
            },
            authClient
          )
          if (!canRegister) {
            submitButtonRef?.current?.onSpin(false)
            return
          }
        } catch (e: any) {
          if (typeof e === 'string') {
            messageNote.error(e)
          } else {
            messageNote.error(e?.message)
          }
          submitButtonRef?.current?.onSpin(false)
          return
        }
      }

      const res = await post('/api/v3/join-by-invitation', context)
      const { statusCode, code, apiCode, data, onGuardHandling, message } = res
      if (statusCode === 200) {
        events?.onRegister?.(data, authClient)
        changeModule?.(GuardModuleType.INVITE_SUCCESS)
      } else {
        onGuardHandling?.()
        events?.onRegisterError?.({
          code,
          data,
          message
        })
      }
    },
    [authClient, authFlow, changeModule, events, post, submitButtonRef]
  )
  return onRegisterHandle
}
