import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { Form, message } from 'shim-antd'

import {
  fieldRequiredRule,
  getCaptchaUrl,
  useSmsCaptchaCheck,
  useEmailCaptchaCheck,
  useGuardFinallyConfig,
  useGuardPublicConfig,
  validate
} from '../../_utils'

import SubmitButton from '../../SubmitButton'

import { IconFont } from '../../IconFont'

import { SceneType } from 'authing-js-sdk'

import { SendCodeByEmail } from '../../SendCode/SendCodeByEmail'

import { SendCodeByPhone } from '../../SendCode/SendCodeByPhone'

import { FormItemIdentify } from '../../Login/core/withVerifyCode/FormItemIdentify'

import { InputIdentify } from './inputIdentify'

import { parsePhone, useAutoFocus } from '../../_utils/hooks'

import { EmailScene } from '../../Type'

import { VerifyLoginMethods } from '../../Type/application'

import { getGuardHttp } from '../../_utils/guardHttp'

import { GraphicVerifyCode } from '../../Login/core/withPassword/GraphicVerifyCode'

const { useCallback, useRef, useState, useEffect, useMemo } = React

// import { useGuardEvents, useGuardPublicConfig } from '../../_utils/context'
export enum InputMethodMap {
  email = 'email-code',
  phone = 'phone-code'
}

interface ResetPasswordProps {
  // onReset: any
  publicConfig: any
  setControlShow: any
  setPolicyStrength: any
  setCustomPasswordStrength: any
  setPhoneOrEmailText: any
  // onSend: (type: 'email' | 'phone') => void
  // onSendError: (type: 'email' | 'phone', error: any) => void
  setResetToken: React.Dispatch<React.SetStateAction<string>>
  setUserId: React.Dispatch<React.SetStateAction<string>>
}

export const ResetPassword = (props: ResetPasswordProps) => {
  const config = useGuardFinallyConfig()

  const { t } = useTranslation()
  let [form] = Form.useForm()
  let [identify, setIdentify] = useState('')
  let submitButtonRef = useRef<any>(null)
  const { autoFocus } = useAutoFocus()
  const { post } = getGuardHttp()

  const smsCaptchaCheck = useSmsCaptchaCheck('forget-password')
  const emailCaptchaCheck = useEmailCaptchaCheck('forget-password')

  const [verifyCodeUrl, setVerifyCodeUrl] = useState('')
  const [captchaCode, setCaptchaCode] = useState('')

  const publicConfig = useGuardPublicConfig()

  const identifyMethods = useMemo<VerifyLoginMethods[]>(() => {
    switch (publicConfig?.resetPwdSelectEmailPhone) {
      case 'email':
        return ['email-code']
      case 'phone':
        return ['phone-code']
      default:
        return ['email-code', 'phone-code']
    }
  }, [publicConfig?.resetPwdSelectEmailPhone])

  const defaultCodeMethod = useMemo<'phone' | 'email'>(() => {
    return identifyMethods.length === 1 && identifyMethods[0] === 'email-code'
      ? 'email'
      : 'phone'
  }, [identifyMethods])

  let [codeMethod, setCodeMethod] = useState<'phone' | 'email'>(
    defaultCodeMethod
  )

  // let authClient = useGuardAuthClient()
  // const events = useGuardEvents()
  // const { publicKey } = useGuardPublicConfig()
  const verifyCodeLength = props.publicConfig.verifyCodeLength ?? 4
  // 是否开启了国际化短信功能
  const isInternationSms =
    props.publicConfig.internationalSmsConfig?.enabled || false
  // const {
  //   // getPassWordUnsafeText,
  //   setPasswordErrorTextShow,
  // } = usePasswordErrorText()
  const onFinish = async (values: any) => {
    submitButtonRef.current?.onSpin(true)
    // 校验手机号和验证码
    let identify = values.identify
    let code = values.code
    // let identify = form.getFieldsValue().identify
    // let code = form.getFieldsValue().code
    // let tempPassword = values.password
    let context = new Promise(() => {})
    // const newPassword = await authClient.options?.encryptFunction?.(
    //   tempPassword,
    //   publicKey
    // )
    if (codeMethod === 'email') {
      context = post(
        '/api/v2/users/password/forget/check-code',
        {
          email: identify,
          code
          // newPassword,
        }
        // config
      )
      // context = client.resetPasswordByEmailCode(identify, code, newPassword)
    }
    if (codeMethod === 'phone') {
      const { phoneNumber: phone, countryCode: phoneCountryCode } = parsePhone(
        isInternationSms,
        identify
      )
      context = post('/api/v2/users/password/forget/check-code', {
        phone,
        code,
        // newPassword,
        phoneCountryCode
      })
    }

    context
      .then((r: any) => {
        const { code } = r
        submitButtonRef.current?.onSpin(false)
        if (code !== 200) {
          // 刷新图形验证码
          if (
            (codeMethod === 'phone' && smsCaptchaCheck) ||
            (codeMethod === 'email' && emailCaptchaCheck)
          ) {
            setVerifyCodeUrl(getCaptchaUrl(config.host!))
          }

          message.error(r?.message)
          return
        }
        const passwordStrength = r?.data.passwordStrength
        let customPasswordStrength = {}
        if (r?.data?.customPasswordStrength?.enabled) {
          customPasswordStrength = r?.data?.customPasswordStrength
        }
        // if (code === ApiCode.UNSAFE_PASSWORD_TIP) {
        //   setPasswordErrorTextShow(true)
        // }
        // props.onSend(codeMethod)
        // props.onReset(r)
        if (code === 200) {
          props.setPhoneOrEmailText(identify)
          props.setPolicyStrength(passwordStrength)
          if (r?.data?.customPasswordStrength?.enabled) {
            props.setCustomPasswordStrength(customPasswordStrength)
          }
          props.setControlShow(false)
          props.setResetToken(r?.data?.resetPasswordToken)
          props.setUserId(r?.data?.userId)
        }
      })
      .catch(e => {
        // submitButtonRef.current.onError()
        // props.onSendError(codeMethod, e)
        message.error(e.message)
        return
        // props.onReset(e)
      })
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
              placeholder={t('login.resetPassword.inputFourVerifyCode', {
                length: verifyCodeLength
              })}
              prefix={
                <IconFont
                  type="authing-a-shield-check-line1"
                  style={{ color: '#6B7280' }}
                />
              }
              captchaCode={captchaCode}
              scene={SceneType.SCENE_TYPE_RESET}
              maxLength={verifyCodeLength}
              data={identify}
              onSendCodeBefore={async () => {
                // closeCheckSendUser 开启时，由 onFinish 统一校验
                if (!publicConfig?.closeCheckSendUser) {
                  await form.validateFields(['identify'])
                }
                await form.validateFields(['captchaCode'])
              }}
              onSendCodeError={() => {
                setVerifyCodeUrl(getCaptchaUrl(config.host!))
              }}
            />
          )}
          {codeMethod === 'email' && (
            <SendCodeByEmail
              {...props}
              className="authing-g2-input g2-send-code-input"
              autoComplete="off"
              size="large"
              placeholder={t('login.resetPassword.inputFourVerifyCode', {
                length: verifyCodeLength
              })}
              prefix={
                <IconFont
                  type="authing-a-shield-check-line1"
                  style={{ color: '#6B7280' }}
                />
              }
              scene={EmailScene.RESET_PASSWORD_VERIFY_CODE}
              captchaCode={captchaCode}
              maxLength={verifyCodeLength}
              data={identify}
              onSendCodeBefore={async () => {
                // closeCheckSendUser 开启时，由 onFinish 统一校验
                if (!publicConfig?.closeCheckSendUser) {
                  await form.validateFields(['identify'])
                }
                await form.validateFields(['captchaCode'])
              }}
              onSendCodeError={() => {
                setVerifyCodeUrl(getCaptchaUrl(config.host!))
              }}
            />
          )}
        </>
      )
    },
    [
      codeMethod,
      form,
      identify,
      isInternationSms,
      t,
      verifyCodeLength,
      captchaCode
    ]
  )

  useEffect(() => {
    setCodeMethod(defaultCodeMethod)
  }, [defaultCodeMethod])

  useEffect(() => {
    // 方法发生变化时，图像验证码数据应该清空
    if (smsCaptchaCheck || emailCaptchaCheck) {
      form?.setFieldsValue({ captchaCode: undefined })
    }
  }, [form, codeMethod, smsCaptchaCheck, emailCaptchaCheck])

  useEffect(() => {
    if (smsCaptchaCheck || emailCaptchaCheck) {
      setVerifyCodeUrl(getCaptchaUrl(config.host!))
    }
  }, [smsCaptchaCheck, emailCaptchaCheck, config?.host])

  return (
    <div className="authing-g2-login-phone-code">
      <Form
        name="rePassword"
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
          methods={identifyMethods}
          currentMethod={InputMethodMap[codeMethod]}
          checkExist={true}
        >
          <InputIdentify
            methods={identifyMethods}
            className="authing-g2-input"
            autoComplete="off"
            autoFocus={autoFocus}
            size="large"
            value={identify}
            onChange={(e: any) => {
              let v = e.target.value
              setIdentify(v)
              if (identifyMethods.length === 1) {
                setCodeMethod(defaultCodeMethod)
              } else if (validate('email', v)) {
                setCodeMethod('email')
              } else {
                setCodeMethod('phone')
              }
            }}
            prefix={
              <IconFont
                type="authing-a-user-line1"
                style={{ color: '#6B7280' }}
              />
            }
          />
        </FormItemIdentify>

        {((smsCaptchaCheck && codeMethod === 'phone') ||
          (codeMethod === 'email' && emailCaptchaCheck)) && (
          <Form.Item
            className="authing-g2-input-form"
            validateTrigger={['onBlur', 'onChange']}
            name="captchaCode"
            rules={fieldRequiredRule(t('common.captchaCode'))}
          >
            <GraphicVerifyCode
              className="authing-g2-input"
              size="large"
              placeholder={t('login.inputCaptchaCode') as string}
              verifyCodeUrl={verifyCodeUrl}
              changeCode={() => setVerifyCodeUrl(getCaptchaUrl(config.host!))}
              onChange={(e: any) => {
                setCaptchaCode(e.target.value)
              }}
            />
          </Form.Item>
        )}

        <Form.Item
          validateTrigger={['onBlur', 'onChange']}
          className="authing-g2-input-form-sendCode"
          name="code"
          rules={[...fieldRequiredRule(t('common.captchaCode'))]}
        >
          <SendCode />
        </Form.Item>
        {/* <CustomFormItem.Password
          className="authing-g2-input-form"
          name="password"
        >
          <InputPassword
            className="authing-g2-input"
            size="large"
            placeholder={t('user.inputNewPwd')}
            prefix={
              <IconFont
                type="authing-a-lock-line1"
                style={{ color: '#6B7280' }}
              />
            }
          />
        </CustomFormItem.Password> */}
        {/* // 这个密码记得加上 */}
        {/* {getPassWordUnsafeText()} */}
        <Form.Item className="authing-g2-sumbit-form submit-form">
          <SubmitButton
            className="validater-account-btn"
            text={t('login.resetPassword.nextStep') as string}
            ref={submitButtonRef}
          />
        </Form.Item>
      </Form>
    </div>
  )
}
