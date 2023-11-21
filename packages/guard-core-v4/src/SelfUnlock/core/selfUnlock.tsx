import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { Form } from 'shim-antd'

import '@antd-lib-style/form/style/index.less'

import { fieldRequiredRule, validate, getPasswordIdentify } from '../../_utils'

import SubmitButton from '../../SubmitButton'

import { IconFont } from '../../IconFont'

import { InputPassword } from '../../InputPassword'

import { SceneType } from 'authing-js-sdk'

import { SendCodeByEmail } from '../../SendCode/SendCodeByEmail'

import { SendCodeByPhone } from '../../SendCode/SendCodeByPhone'

import { FormItemIdentify } from '../../Login/core/withVerifyCode/FormItemIdentify'

import { InputIdentify } from '../../Login/core/withVerifyCode/inputIdentify'

import { parsePhone, useMediaSize } from '../../_utils/hooks'

import { EmailScene } from '../../Type'

import { useGuardHttp } from '../../_utils/guardHttp'

import { useGuardAuthClient } from '../../Guard/authClient'

import {
  useGuardEvents,
  useGuardInitData,
  useGuardPublicConfig
} from '../../_utils/context'

const { useCallback, useEffect, useRef, useState } = React

export enum InputMethodMap {
  email = 'email-code',
  phone = 'phone-code'
}
export const SelfUnlock = ({
  identifyRef
}: {
  identifyRef?: React.MutableRefObject<string>
}) => {
  const { t } = useTranslation()
  let [form] = Form.useForm()
  let [identify, setIdentify] = useState('')
  let [codeMethod, setCodeMethod] = useState<'phone' | 'email'>('phone')
  let submitButtonRef = useRef<any>(null)
  const { isPhoneMedia } = useMediaSize()
  let authClient = useGuardAuthClient()
  const events = useGuardEvents()

  const initData = useGuardInitData<{
    defaultEmail: 'string'
    defaultPhone: 'string'
  }>()

  useEffect(() => {
    if (initData.defaultEmail) {
      setIdentify(initData.defaultEmail)
      form.setFieldsValue({
        identify: initData.defaultEmail
      })
      setCodeMethod('email')
    }
    if (initData.defaultPhone) {
      setIdentify(initData.defaultPhone)
      form.setFieldsValue({
        identify: initData.defaultPhone
      })
      setCodeMethod('phone')
    }
  }, [initData, form])

  useEffect(() => {
    if (identifyRef) {
      identifyRef.current = getPasswordIdentify(identify)
    }
  }, [identify, identifyRef])

  const { authFlow } = useGuardHttp()

  const {
    publicKey,
    verifyCodeLength,
    internationalSmsConfig,
    selfUnlockStrategy = 'password-captcha' // 'captcha' | 'password-captcha'
  } = useGuardPublicConfig()

  // 是否开启了国际化短信功能
  const isInternationSms = internationalSmsConfig?.enabled || false

  const onFinish = async (values: any) => {
    let identify = values.identify

    let code = values.code

    let password = values.password || ''

    const encryptPassWord = await authClient.options?.encryptFunction?.(
      password,
      publicKey
    )
    // 密码，经过加密后的, 仅“验证码”时不传 password 字段
    password =
      selfUnlockStrategy === 'password-captcha' ? encryptPassWord : undefined

    if (codeMethod === 'email') {
      const { isFlowEnd, data, onGuardHandling } = await authFlow(
        'unlock-account-by-email',
        {
          email: identify, // 用户输入的邮箱
          code, // 验证码
          password
        }
      )
      submitButtonRef.current?.onSpin(false)
      if (isFlowEnd) {
        events?.onLogin?.(data, authClient!) // 登录成功
      } else {
        onGuardHandling?.()
      }
    }
    if (codeMethod === 'phone') {
      const { phoneNumber } = parsePhone(isInternationSms, identify)
      const { isFlowEnd, data, onGuardHandling } = await authFlow(
        'unlock-account-by-phone',
        {
          phone: phoneNumber, // 用户输入的邮箱
          code, // 验证码
          password
        }
      )
      submitButtonRef.current?.onSpin(false)
      if (isFlowEnd) {
        events?.onLogin?.(data, authClient!) // 登录成功
      } else {
        onGuardHandling?.()
      }
    }
  }

  const SendCode = useCallback(
    (props: any) => {
      return (
        <>
          {codeMethod === 'phone' && (
            <SendCodeByPhone
              {...props}
              isInternationSms={isInternationSms}
              className="authing-g2-input g2-send-code-input"
              autoComplete="off"
              size="large"
              placeholder={t('common.inputFourVerifyCode', {
                length: verifyCodeLength
              })}
              prefix={
                <IconFont
                  type="authing-a-shield-check-line1"
                  style={{ color: '#878A95' }}
                />
              }
              scene={SceneType.SCENE_TYPE_RESET}
              maxLength={verifyCodeLength}
              data={identify}
              onSendCodeBefore={async () => {
                await form.validateFields(['identify'])
              }}
            />
          )}
          {codeMethod === 'email' && (
            <SendCodeByEmail
              {...props}
              className="authing-g2-input g2-send-code-input"
              autoComplete="off"
              size="large"
              placeholder={t('common.inputFourVerifyCode', {
                length: verifyCodeLength
              })}
              prefix={
                <IconFont
                  type="authing-a-shield-check-line1"
                  style={{ color: '#878A95' }}
                />
              }
              scene={EmailScene.SELF_UNLOCKING_VERIFY_CODE}
              maxLength={verifyCodeLength}
              data={identify}
              onSendCodeBefore={async () => {
                await form.validateFields(['identify'])
              }}
              value={identify}
            />
          )}
        </>
      )
    },
    [codeMethod, form, identify, isInternationSms, t, verifyCodeLength]
  )

  return (
    <div className="authing-g2-login-phone-code">
      <Form
        name="resetPassword"
        form={form}
        onFinish={onFinish}
        onFinishFailed={() => {
          submitButtonRef?.current?.onError()
        }}
        autoComplete="off"
      >
        <FormItemIdentify
          name="identify"
          className="authing-g2-input-form"
          methods={['email-code', 'phone-code']}
          currentMethod={InputMethodMap[codeMethod]}
        >
          <InputIdentify
            methods={['email-code', 'phone-code']}
            className="authing-g2-input"
            autoComplete="off"
            autoFocus={!isPhoneMedia}
            size="large"
            value={identify}
            onChange={(e: any) => {
              let v = e.target.value
              setIdentify(v)
              if (validate('email', v)) {
                setCodeMethod('email')
              } else {
                setCodeMethod('phone')
              }
            }}
            prefix={
              <IconFont
                type="authing-a-user-line1"
                style={{ color: '#878A95' }}
              />
            }
          />
        </FormItemIdentify>

        <Form.Item
          validateTrigger={['onBlur', 'onChange']}
          className="authing-g2-input-form"
          name="code"
          rules={[...fieldRequiredRule(t('common.captchaCode'))]}
        >
          <SendCode />
        </Form.Item>
        {selfUnlockStrategy === 'password-captcha' && (
          <Form.Item
            validateTrigger={['onBlur', 'onChange']}
            className="authing-g2-input-form"
            name="password"
            rules={[...fieldRequiredRule(t('common.password'))]}
          >
            <InputPassword
              className="authing-g2-input"
              size="large"
              placeholder={t('user.inputOldPwd')}
              prefix={
                <IconFont
                  type="authing-a-lock-line1"
                  style={{ color: '#878A95' }}
                />
              }
            />
          </Form.Item>
        )}
        <Form.Item className="authing-g2-sumbit-form submit-form">
          <SubmitButton
            className="forget-password"
            text={t('common.unlock') as string}
            ref={submitButtonRef}
          />
        </Form.Item>
      </Form>
    </div>
  )
}
