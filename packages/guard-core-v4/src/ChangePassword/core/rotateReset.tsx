import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { Form, message } from 'shim-antd'

import SubmitButton from '../../SubmitButton'

import { useGuardAuthClient } from '../../Guard/authClient'

import CustomFormItem from '../../ValidatorRules'

import { fieldRequiredRule } from '../../_utils'

import { InputPassword } from '../../InputPassword'

import { IconFont } from '../../IconFont'

import {
  useGuardInitData,
  useGuardIsAuthFlow,
  useGuardPublicConfig
} from '../../_utils/context'

import { authFlow, ChangePasswordBusinessAction } from '../businessRequest'

import { ApiCode } from '../../_utils/responseManagement/interface'

import { useMediaSize } from '../../_utils/hooks'

import { usePasswordErrorText } from '../../_utils/useErrorText'

const { useRef } = React

interface RotateResetProps {
  onReset: any
  onFinishCallBack?: any
}

export const RotateReset = (props: RotateResetProps) => {
  const { t } = useTranslation()

  const { onReset, onFinishCallBack } = props

  let [form] = Form.useForm()

  const { publicKey } = useGuardPublicConfig()

  let authClient = useGuardAuthClient()

  const { isPhoneMedia } = useMediaSize()

  const encrypt = authClient.options.encryptFunction

  const isAuthFlow = useGuardIsAuthFlow()

  let submitButtonRef = useRef<any>(null)

  const initData = useGuardInitData<{ token: string }>()
  const { getPassWordUnsafeText, setPasswordErrorTextShow } =
    usePasswordErrorText()
  const onFinish = async (values: any) => {
    if (onFinishCallBack instanceof Function) {
      const data = await onFinishCallBack(values)
      if (data.code === ApiCode.UNSAFE_PASSWORD_TIP) {
        message.error(data.message)
        setPasswordErrorTextShow(true)
      }
      return
    }
    let { password, oldPassword } = values
    submitButtonRef?.current?.onSpin(true)

    if (isAuthFlow) {
      const {
        apiCode,
        onGuardHandling,
        message: msg
      } = await authFlow(ChangePasswordBusinessAction.ResetPassword, {
        password: await encrypt!(password, publicKey),
        oldPassword: await encrypt!(oldPassword, publicKey)
      })

      submitButtonRef?.current?.onSpin(false)

      // 重置密码 返回的是流程终止
      if (apiCode === ApiCode.ABORT_FLOW) {
        onReset()
      } else if (apiCode === ApiCode.UNSAFE_PASSWORD_TIP) {
        message.error(msg)
        setPasswordErrorTextShow(true)
      } else {
        submitButtonRef?.current?.onError()
        onGuardHandling?.()
      }
    } else {
      try {
        let res = await authClient.resetPasswordByForceResetToken({
          token: initData.token,
          newPassword: password,
          oldPassword: oldPassword
        })
        props.onReset({ code: 200, data: res })
      } catch (error: any) {
        message.error(error.message)
        submitButtonRef?.current?.onError()
      } finally {
        submitButtonRef?.current?.onSpin(false)
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
        <Form.Item
          validateTrigger={['onBlur', 'onChange']}
          className="authing-g2-input-form"
          name="oldPassword"
          rules={[...fieldRequiredRule(t('common.password'))]}
        >
          <InputPassword
            autoFocus={!isPhoneMedia}
            className="authing-g2-input"
            size="large"
            placeholder={t('user.inputCurrPwd')}
            prefix={
              <IconFont
                type="authing-a-lock-line1"
                style={{ color: '#878A95' }}
              />
            }
          />
        </Form.Item>
        <CustomFormItem.Password
          className="authing-g2-input-form"
          name="password"
        >
          <InputPassword
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
        <CustomFormItem.Password
          className="authing-g2-input-form"
          name="password2"
          rules={[
            {
              validator(_: any, value: any) {
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
        </CustomFormItem.Password>
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
