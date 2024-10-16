import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { Form, message } from 'shim-antd'

import { useGuardAuthClient } from '../../Guard/authClient'

import SubmitButton from '../../SubmitButton'

import CustomFormItem from '../../ValidatorRules'

import { IconFont } from '../../IconFont'

import { InputPassword } from '../../InputPassword'

import {
  useGuardInitData,
  useGuardIsAuthFlow,
  useGuardPublicConfig
} from '../../_utils/context'

import { authFlow, ChangePasswordBusinessAction } from '../businessRequest'

import { ApiCode } from '../../_utils/responseManagement/interface'

import { useMediaSize } from '../../_utils/hooks'

import { usePasswordErrorText } from '../../_utils/useErrorText'

interface PasswordNotSafeResetProps {
  onReset: any
}

const { useRef } = React

export const PasswordNotSafeReset: React.FC<PasswordNotSafeResetProps> = ({
  onReset
}) => {
  const { t } = useTranslation()

  const initData = useGuardInitData<{ token: string }>()

  const isAuthFlow = useGuardIsAuthFlow()

  const { publicKey } = useGuardPublicConfig()

  let [form] = Form.useForm()

  let client = useGuardAuthClient()

  const encrypt = client.options.encryptFunction

  const { isPhoneMedia } = useMediaSize()

  let submitButtonRef = useRef<any>(null)
  const { getPassWordUnsafeText, setPasswordErrorTextShow } =
    usePasswordErrorText()
  const onFinish = async (values: any) => {
    let newPassword = values.password
    submitButtonRef.current?.onSpin(true)

    if (isAuthFlow) {
      // 重置密码成功不会返回 UserInfo
      const {
        apiCode,
        onGuardHandling,
        message: msg
      } = await authFlow(
        ChangePasswordBusinessAction.ResetPasswordStrengthDetection,
        {
          password: await encrypt!(newPassword, publicKey)
        }
      )
      submitButtonRef.current?.onSpin(false)

      if (apiCode === ApiCode.ABORT_FLOW) {
        onReset()
      } else if (apiCode === ApiCode.UNSAFE_PASSWORD_TIP) {
        message.error(msg)
        setPasswordErrorTextShow(true)
      } else {
        submitButtonRef.current?.onError()
        onGuardHandling?.()
      }
    } else {
      try {
        let res = await client.resetPasswordByFirstLoginToken({
          token: initData.token,
          password: newPassword
        })
        onReset(res)
      } catch (error: any) {
        message.error(error.message)
        submitButtonRef?.current?.onError()
      } finally {
        submitButtonRef.current?.onSpin(false)
      }
    }
  }

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
        <CustomFormItem.Password
          className="authing-g2-input-form"
          name="password"
          required={true}
        >
          <InputPassword
            autoFocus={!isPhoneMedia}
            className="authing-g2-input"
            size="large"
            placeholder={t('login.inputNewPwd')}
            prefix={
              <IconFont
                type="authing-a-lock-line1"
                style={{ color: '#878A95' }}
              />
            }
          />
        </CustomFormItem.Password>
        <Form.Item
          validateTrigger={['onBlur', 'onChange']}
          className="authing-g2-input-form"
          name="password2"
          rules={[
            {
              validator(_, value) {
                let pwd = form.getFieldValue('password')
                if (!value) {
                  return Promise.reject(t('login.inputPwd'))
                }
                if (value !== pwd) {
                  return Promise.reject(t('common.repeatPasswordDoc'))
                }
                return Promise.resolve()
              }
            }
          ]}
        >
          <InputPassword
            className="authing-g2-input"
            size="large"
            placeholder={t('login.inputPwdAgain')}
            prefix={
              <IconFont
                type="authing-a-lock-line1"
                style={{ color: '#878A95' }}
              />
            }
          />
        </Form.Item>
        {getPassWordUnsafeText()}
        <Form.Item className="authing-g2-sumbit-form submit-form">
          <SubmitButton
            className="forget-password"
            text={t('common.confirm') as string}
            ref={submitButtonRef}
          />
        </Form.Item>
      </Form>
    </div>
  )
}
