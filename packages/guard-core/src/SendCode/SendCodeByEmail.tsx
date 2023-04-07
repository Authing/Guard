import { message } from 'shim-antd'

import { React } from 'shim-react'

import './style.less'

import { useTranslation } from 'react-i18next'

import { validate } from '../_utils'

import { InputProps } from 'shim-antd/lib/input'

import { SendCode } from './index'

import { getGuardHttp } from '../_utils/guardHttp'

import { EmailScene } from '../Type'

import { useGuardEvents } from '../_utils/context'

import { useGuardAuthClient } from '../Guard/authClient'

export interface SendCodeByEmailProps extends InputProps {
  data?: string
  form?: any
  onSendCodeBefore?: any // 点击的时候先做这个
  fieldName?: string
  autoSubmit?: boolean //验证码输入完毕是否自动提交
  scene: EmailScene
  name: string
}

export const SendCodeByEmail: React.FC<SendCodeByEmailProps> = props => {
  const { scene, data, form, onSendCodeBefore, fieldName, ...remainProps } = props
  const { t } = useTranslation()
  const events = useGuardEvents()
  const authClient = useGuardAuthClient()
  const { post } = getGuardHttp()
  const sendEmail = async (email: string) => {
    if (!email) {
      message.error(t('login.inputEmail'))
      return {
        status: false,
        error: {
          code: 400,
          message: t('login.inputEmail')
        }
      }
    }
    if (!validate('email', email)) {
      message.error(t('common.emailFormatError'))
      return {
        status: false,
        error: {
          code: 400,
          message: t('common.emailFormatError')
        }
      }
    }
    try {
      const {
        code,
        message: tips,
        apiCode
      } = await post('/api/v2/email/send', {
        email,
        scene
      })
      if (apiCode === 2080) {
        // 一分钟只能发一次邮箱验证码的提示信息，特殊处理
        message.error(tips)
        return {
          status: false,
          error: {
            code: apiCode,
            message: tips
          }
        }
      }
      if (code === 200) {
        return {
          status: true
        }
      } else {
        message.error(t('login.sendCodeTimeout'))
        return {
          status: false,
          error: {
            code,
            message: t('login.sendCodeTimeout')
          }
        }
      }
      // await await authClient.sendEmail(email, scene)
      // onSend?.()
    } catch (error) {
      // onError?.(error)
      return {
        status: false,
        error: {
          message: JSON.stringify(error),
          code: 401
        }
      }
    }
  }

  return (
    <SendCode
      beforeSend={() => {
        return onSendCodeBefore()
          .then(async () => {
            const email = form ? form.getFieldValue(fieldName || 'email') : data
            const { status, error } = await sendEmail(email)
            if (status) {
              events?.onEmailSend?.(authClient, scene)
            } else {
              events?.onEmailSendError?.(error, authClient, scene)
            }
            return status
          })
          .catch((e: any) => {
            events?.onEmailSendError?.(e, authClient, scene)
            return false
          })
      }}
      form={form}
      {...remainProps}
    />
  )
}
