import { React } from 'shim-react'

import { Form } from 'shim-antd'

import '@antd-es-style/form/style/index.less'

import CustomFormItem from '../../ValidatorRules'

import { InputPassword } from '../../InputPassword'

import { useMediaSize } from '../../_utils/hooks'

import { IconFont } from '../../IconFont'

import { useTranslation } from 'react-i18next'

import SubmitButton from '../../SubmitButton'

import { RegisterCompletePasswordInitData } from '../../CompleteInfo/interface'

import {
  useGuardEvents,
  useGuardInitData,
  useGuardModule,
  useGuardPublicConfig
} from '../../_utils/context'

import { GuardModuleType } from '../../Guard'

import { useGuardAuthClient } from '../../Guard/authClient'

import { getGuardHttp } from '../../_utils/guardHttp'

import { usePasswordErrorText } from '../../_utils/useErrorText'

import { ApiCode } from '../../_utils/responseManagement/interface'

const { useRef, useCallback } = React

export const CompletePassword: React.FC = () => {
  const { t } = useTranslation()

  const events = useGuardEvents()

  const [form] = Form.useForm()

  const { isPhoneMedia } = useMediaSize()

  const { post } = getGuardHttp()
  const {
    businessRequestName,
    content,
    isChangeComplete,
    onRegisterSuccess,
    onRegisterFailed
  } = useGuardInitData<RegisterCompletePasswordInitData>()

  let submitButtonRef = useRef<any>(null)

  const { changeModule } = useGuardModule()
  // 密码加密公钥
  const { publicKey } = useGuardPublicConfig()

  let client = useGuardAuthClient()

  const encrypt = client.options.encryptFunction
  const { getPassWordUnsafeText, setPasswordErrorTextShow } =
    usePasswordErrorText()
  const onFinish = useCallback(
    async (values: any) => {
      // 密码加密处理（邮箱验证码是通过 post 直接发送需要加密 其他通过 sdk 在内部加密了 这一步无需加密）
      const password = await encrypt!(values.password, publicKey)

      submitButtonRef.current?.onSpin(true)

      if (isChangeComplete) {
        // 需要进行信息补全
        changeModule?.(GuardModuleType.REGISTER_COMPLETE_INFO, {
          businessRequestName,
          content: {
            ...content,
            password
          },
          onRegisterSuccess,
          onRegisterFailed
        })
        return
      } else {
        // 直接注册
        try {
          if (businessRequestName === 'registerByEmailCode') {
            const { statusCode, apiCode, data, onGuardHandling, message } =
              await post('/api/v2/register-email-code', {
                ...content,
                password,
                postUserInfoPipeline: false
              })
            submitButtonRef.current.onSpin(false)
            if (statusCode === 200) {
              onRegisterSuccess(data)
              // events?.onRegister?.(data, authClient)
              // changeModule?.(GuardModuleType.LOGIN)
            } else {
              if (statusCode === ApiCode.UNSAFE_PASSWORD_TIP) {
                setPasswordErrorTextShow(true)
              }
              onGuardHandling?.()
              onRegisterFailed(apiCode, data, message)
              events?.onRegisterError?.({
                code: apiCode,
                data,
                message
              })
            }
          } else if (businessRequestName === 'registerByPhoneCode') {
            // TODO: 修改 Rustful
            const { data, statusCode, apiCode, onGuardHandling, message } =
              await post('/api/v2/register-phone-code', {
                ...content,
                password,
                postUserInfoPipeline: false
              })
            if (statusCode === 200) {
              submitButtonRef.current?.onSpin(false)
              onRegisterSuccess(data)
            } else {
              if (apiCode === ApiCode.UNSAFE_PASSWORD_TIP) {
                setPasswordErrorTextShow(true)
              }
              onGuardHandling?.()
              submitButtonRef.current?.onSpin(false)
              onRegisterFailed(apiCode, data, message)
              events?.onRegisterError?.({
                apiCode,
                data,
                message
              })
            }
          }
        } catch (error: any) {
          submitButtonRef.current?.onSpin(false)
          // const { code, message: errorMessage, data } = error
          // if (code === ApiCode.UNSAFE_PASSWORD_TIP) {
          //   setPasswordErrorTextShow(true)
          // }
          // submitButtonRef.current.onError()
          // message.error(errorMessage)
          // onRegisterFailed(code, data, errorMessage)
          // events?.onRegisterError?.({
          //   code,
          //   data,
          //   message,
          // })
        }
      }
    },
    [
      businessRequestName,
      changeModule,
      content,
      encrypt,
      events,
      isChangeComplete,
      onRegisterFailed,
      onRegisterSuccess,
      post,
      publicKey,
      setPasswordErrorTextShow
    ]
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
        <CustomFormItem.Password
          className="authing-g2-input-form"
          name="password"
          required={true}
        >
          <InputPassword
            autoFocus={!isPhoneMedia}
            className="authing-g2-input"
            size="large"
            placeholder={t('login.inputPwd')}
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
