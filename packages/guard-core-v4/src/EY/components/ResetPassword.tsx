import { React } from 'shim-react'

import { Form, message } from 'shim-antd'

import { useTranslation } from 'react-i18next'
// import { useGuardAuthClient } from '../../Guard/authClient'
import { fieldRequiredRule } from '../../_utils'
import SubmitButton from '../../SubmitButton'
import { IconFont } from '../../IconFont'
import { SendCodeByEmail } from '../../SendCode/SendCodeByEmail'
import { FormItemIdentify } from '../../Login/core/withVerifyCode/FormItemIdentify'
import { useMediaSize } from '../../_utils/hooks'
import { EmailScene } from '../../Type'
import { getGuardHttp } from '../../_utils/guardHttp'
import { InputIdentify } from '../../Login/core/withVerifyCode/inputIdentify'
import { GuardLoginInitData } from '../Login'
import { useGuardInitData } from '../../_utils/context'
const { useCallback, useRef } = React
export enum InputMethodMap {
  email = 'email-code',
  phone = 'phone-code'
}
interface ResetPasswordProps {
  publicConfig: any
  setControlShow: any
  setPolicyStrength: any
  setCustomPasswordStrength: any
  setPhoneOrEmailText: any
  setResetToken: React.Dispatch<React.SetStateAction<string>>
  setUserId: React.Dispatch<React.SetStateAction<string>>
}
export const ResetPassword = (props: ResetPasswordProps) => {
  const { t } = useTranslation()

  const initData = useGuardInitData<GuardLoginInitData>()

  let [form] = Form.useForm()

  let submitButtonRef = useRef<any>(null)
  const { isPhoneMedia } = useMediaSize()
  const { post } = getGuardHttp()

  const verifyCodeLength = props.publicConfig.verifyCodeLength ?? 4

  const renderSendCode = useCallback(() => {
    return (
      <Form.Item
        noStyle
        shouldUpdate={(prev, next) => prev.email !== next.email}
      >
        {({ getFieldValue }) => {
          const identify = getFieldValue('identify')

          return (
            <Form.Item
              validateTrigger={['onBlur', 'onChange']}
              className="authing-g2-input-form-sendCode"
              name="code"
              rules={[...fieldRequiredRule(t('common.captchaCode'))]}
            >
              <SendCodeByEmail
                className="authing-g2-input g2-send-code-input"
                autoComplete="off"
                size="large"
                placeholder={
                  t('login.resetPassword.inputFourVerifyCode', {
                    length: verifyCodeLength
                  }) as string
                }
                prefix={
                  <IconFont
                    type="authing-a-shield-check-line1"
                    style={{ color: '#878A95' }}
                  />
                }
                scene={EmailScene.RESET_PASSWORD_VERIFY_CODE}
                maxLength={verifyCodeLength}
                data={identify}
                onSendCodeBefore={async () => {
                  await form.validateFields(['identify'])
                }}
              />
            </Form.Item>
          )
        }}
      </Form.Item>
    )
  }, [form, t, verifyCodeLength])

  const onFinish = async (values: any) => {
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
    context = post(
      '/api/v2/users/password/forget/check-code',
      {
        email: identify,
        code
        // newPassword,
      }
      // config
    )

    context
      .then((r: any) => {
        const { code } = r
        if (code !== 200) {
          message.error(r?.message)
          return
        }
        const passwordStrength = r?.data.passwordStrength
        let customPasswordStrength = {}
        if (r?.data?.customPasswordStrength?.enabled) {
          customPasswordStrength = r?.data?.customPasswordStrength
        }

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
          methods={['email-code']}
          currentMethod={'email-code'}
          /**
           * ey 安全扫描
           */
          // checkExist={true}
          initialValue={initData?.verifyAccount}
        >
          <InputIdentify
            disabled={!!initData?.verifyAccount}
            methods={['email-code']}
            className="authing-g2-input"
            autoComplete="off"
            autoFocus={!isPhoneMedia}
            size="large"
            prefix={
              <IconFont
                type="authing-a-user-line1"
                style={{ color: '#878A95' }}
              />
            }
          />
        </FormItemIdentify>
        {renderSendCode()}

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
