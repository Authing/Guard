import { message } from 'shim-antd'

import { React } from 'shim-react'

import { SceneType } from 'authing-js-sdk'

import './style.less'

import { useTranslation } from 'react-i18next'

import { useGuardAuthClient } from '../Guard/authClient'

import { InputProps } from 'shim-antd'

import { SendCode } from './index'

import { parsePhone } from '../_utils/hooks'

import { useGuardAppId, useGuardEvents } from '../_utils/context'

import { useGuardHttp } from '../_utils/guardHttp'

export interface SendCodeByPhoneProps extends InputProps {
  data?: string
  form?: any
  onSendCodeBefore?: any // 点击的时候先做这个
  fieldName?: string
  autoSubmit?: boolean //验证码输入完毕是否自动提交
  scene: SceneType
  areaCode?: string //国际区号
  isInternationSms?: boolean //是否是国际短信
  codeFieldName?: string
  captchaCode?: string
}

export const SendCodeByPhone: React.FC<SendCodeByPhoneProps> = props => {
  const {
    scene,
    data,
    form,
    areaCode,
    onSendCodeBefore,
    fieldName,
    isInternationSms = false,
    codeFieldName,
    captchaCode,
    ...remainProps
  } = props
  const { t } = useTranslation()

  const authClient = useGuardAuthClient()
  const appId = useGuardAppId()

  const events = useGuardEvents()
  const { post } = useGuardHttp()

  const sendPhone = async (
    phone: string,
    countryCode?: string,
    captchaCode?: string
  ) => {
    try {
      // await authClient.sendSmsCode(phone, countryCode, scene)
      /**
       * 这个 post 方法请求时，接口报错或者超时 code 会返回 -1、-2，这个时候全局会给出提示，并且不会抛错
       * 会继续走下面逻辑，不走 catch
       * post 方法：packages/react-components/components/_utils/http.ts
       * 响应拦截：packages/react-components/components/_utils/responseManagement/index.ts
       */
      // 根据 scene 区分接口请求
      let url, pAppId

      switch (scene) {
        case SceneType.SCENE_TYPE_LOGIN:
          url = '/api/v2/sms/send-login'
          pAppId = appId
          break
        case SceneType.SCENE_TYPE_REGISTER:
          url = '/api/v2/sms-register'
          pAppId = appId
          break
        default:
          url = '/api/v2/sms/send'
          break
      }

      const data = await post(url, {
        phone,
        phoneCountryCode: countryCode,
        scene,
        captchaCode,
        appId: pAppId
      })
      const { code, statusCode, message: msg } = data
      // 200 表示请求成功，不报错
      if (statusCode === 200 || code === 200) {
        return { status: true }
      } else {
        // 由于使用项目中 post 方法进行请求，外层进行了处理，不会抛错，catch 不会走，在这对 code 进行针对处理
        // 'ECONNABORTED' 不知道是不是只有 sdk 报错，所以我在接口这也写了，防止接口也会1报这个错
        if ((code as any) === 'ECONNABORTED') {
          message.error(t('login.sendCodeTimeout'))
          return {
            status: false,
            error: data
          }
        }
        // code 不是 -1、-2 时，并且 msg 存在， 那么进行报错
        if (!(code === -1 || code === -2)) {
          msg && message.error(msg)
        }
        // 这里看之前 sdk catch 中把整个 error对象传递的，所以报错时我就把整个返回值当作 error 对象传递了，而不是单独传递 message
        // 看的本文件 117行 onPhoneSendError 函数接受的 error 类型是一个对象「只包含 code、message」
        return { status: false, error: data }
      }
      // return { status: true }
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        message.error(t('login.sendCodeTimeout'))
        return {
          status: false,
          error
        }
      }
      const { message: msg } = JSON.parse(error.message)
      message.error(msg)
      return {
        status: false,
        error
      }
    }
  }

  return (
    <>
      <SendCode
        beforeSend={() => {
          return onSendCodeBefore()
            .then(async (b: any) => {
              let fieldValue = form
                ? form.getFieldValue(fieldName || 'phone')
                : data
              const { phoneNumber, countryCode } = parsePhone(
                isInternationSms,
                fieldValue,
                areaCode
              )

              const code = form
                ? form?.getFieldValue(codeFieldName || 'captchaCode')
                : captchaCode

              const { status, error } = await sendPhone(
                phoneNumber,
                countryCode,
                code
              )
              if (status) {
                events?.onPhoneSend?.(authClient, scene)
              } else {
                events?.onPhoneSendError?.(error, authClient, scene)
              }
              return status
            })
            .catch((e: any) => {
              events?.onPhoneSendError?.(e, authClient, scene)
              return false
            })
        }}
        form={form}
        {...remainProps}
      />
    </>
  )
}
