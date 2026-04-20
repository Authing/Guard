import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { Form, message } from 'shim-antd'

import { fieldRequiredRule, validate } from '../../_utils'

import SubmitButton from '../../SubmitButton'

import { IconFont } from '../../IconFont'

import { SceneType } from 'authing-js-sdk'

import { SendCodeByEmail } from '../../SendCode/SendCodeByEmail'

import { SendCodeByPhone } from '../../SendCode/SendCodeByPhone'

import { FormItemIdentify } from '../../Login/core/withVerifyCode/FormItemIdentify'

import { InputIdentify } from './inputIdentify'

import { parsePhone, useAutoFocus, useTencentCaptcha } from '../../_utils/hooks'

import { EmailScene } from '../../Type'

import { getGuardHttp } from '../../_utils/guardHttp'

import { useCaptchaCheck, useGuardFinallyConfig } from '../../_utils/context'

import { GraphicVerifyCode } from '../../Login/core/withPassword/GraphicVerifyCode'

import { getCaptchaUrl } from '../../_utils/getCaptchaUrl'

const { useCallback, useEffect, useRef, useState } = React

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
  const { t } = useTranslation()
  let [form] = Form.useForm()
  let [identify, setIdentify] = useState('')
  let [codeMethod, setCodeMethod] = useState<'phone' | 'email'>('phone')
  let submitButtonRef = useRef<any>(null)
  const { autoFocus } = useAutoFocus()
  const config = useGuardFinallyConfig()

  const { post } = getGuardHttp()
  // let authClient = useGuardAuthClient()
  // const events = useGuardEvents()
  // const { publicKey } = useGuardPublicConfig()
  const verifyCodeLength = props.publicConfig.verifyCodeLength ?? 4
  // 是否开启了国际化短信功能
  const isInternationSms =
    props.publicConfig.internationalSmsConfig?.enabled || false

  // 腾讯验证码相关
  const { captchaCheck, type, appId } = useCaptchaCheck('forget-password')
  const isTencentCaptcha = captchaCheck && type === 'Tencent'
  const [verifyCodeUrl, setVerifyCodeUrl] = useState('')

  const { setTencentCaptchaFields, resetTencentCaptchaFields } =
    useTencentCaptcha({
      enabled: isTencentCaptcha && codeMethod === 'phone',
      appId,
      form
    })

  const handleTencentCaptchaBeforeSend = useCallback(async () => {
    await setTencentCaptchaFields()
  }, [setTencentCaptchaFields])

  useEffect(() => {
    /** 如果是国外用户池，那么有图形验证码，需要请求图片 */
    if (captchaCheck && !isTencentCaptcha) {
      setVerifyCodeUrl(getCaptchaUrl(config.host!))
    }
  }, [captchaCheck, config?.host, isTencentCaptcha])

  useEffect(() => {
    // 方法发生变化时，图像验证码数据应该清空
    if (captchaCheck) {
      resetTencentCaptchaFields()
      form?.setFieldsValue({
        captchaCode: undefined
      })
    }
  }, [form, codeMethod, captchaCheck, resetTencentCaptchaFields])
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
      // context = client.resetPasswordByPhoneCode(
      //   phoneNumber,
      //   code,
      //   newPassword,
      //   countryCode
      // )
    }

    context
      .then((r: any) => {
        const { code } = r
        submitButtonRef.current?.onSpin(false)
        if (code !== 200) {
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
                  style={{ color: '#878A95' }}
                />
              }
              scene={SceneType.SCENE_TYPE_RESET}
              maxLength={verifyCodeLength}
              data={identify}
              form={form}
              fieldName={'identify'}
              codeFieldName={'captchaCode'}
              onSendCodeBefore={async () => {
                await form.validateFields(['identify'])
                if (isTencentCaptcha) {
                  await handleTencentCaptchaBeforeSend()
                  return
                }
                await form.validateFields(['captchaCode'])
              }}
              onSendCodeAfter={() => {
                if (!isTencentCaptcha) {
                  setVerifyCodeUrl(getCaptchaUrl(config.host!))
                }
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
                  style={{ color: '#878A95' }}
                />
              }
              scene={EmailScene.RESET_PASSWORD_VERIFY_CODE}
              maxLength={verifyCodeLength}
              data={identify}
              form={form}
              fieldName={'identify'}
              onSendCodeBefore={async () => {
                await form.validateFields(['identify'])
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
      isTencentCaptcha,
      handleTencentCaptchaBeforeSend,
      t,
      verifyCodeLength,
      config?.host
    ]
  )

  return (
    // .map((item, index) => (index === 0 ? `「${item}」` : item))

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
          methods={['email-code', 'phone-code']}
          currentMethod={InputMethodMap[codeMethod]}
          checkExist={true}
        >
          <InputIdentify
            methods={['email-code', 'phone-code']}
            className="authing-g2-input"
            autoComplete="off"
            autoFocus={autoFocus}
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

        {/* 腾讯验证码隐藏字段 */}
        {isTencentCaptcha && (
          <>
            <Form.Item name="ticket" hidden>
              <input type="hidden" />
            </Form.Item>
            <Form.Item name="randstr" hidden>
              <input type="hidden" />
            </Form.Item>
          </>
        )}

        {/* 图形验证码 国外用户池并且是手机号 */}
        {captchaCheck && !isTencentCaptcha && codeMethod === 'phone' && (
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
                style={{ color: '#878A95' }}
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
