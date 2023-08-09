import { Form, Input, message } from 'shim-antd'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { useGuardAuthClient } from '../../Guard/authClient'

import { fieldRequiredRule, getDeviceName } from '../../_utils'

import { Agreements } from '../components/Agreements'

import SubmitButton from '../../SubmitButton'

import CustomFormItem from '../../ValidatorRules'

import { IconFont } from '../../IconFont'

import { useIsChangeComplete } from '../utils'

import { useGuardFinallyConfig, useGuardModule } from '../../_utils/context'

import { GuardModuleType } from '../../Guard'

import { SendCodeByEmail } from '../../SendCode/SendCodeByEmail'

import { getGuardHttp } from '../../_utils/guardHttp'

import { EmailScene } from '../../Type'

import { useMediaSize } from '../../_utils/hooks'

import {
  Agreement,
  ApplicationConfig,
  LoginMethods,
  RegisterMethods
} from '../../Type/application'

const { useCallback, useRef, useState } = React

// ! 废弃 🚒
export interface RegisterWithEmailCodeProps {
  // onRegister: Function
  onRegisterSuccess: Function
  onRegisterFailed: Function
  onBeforeRegister?: Function
  agreements: Agreement[]
  publicConfig?: ApplicationConfig
  registeContext?: any
}

export const RegisterWithEmailCode: React.FC<RegisterWithEmailCodeProps> = ({
  onRegisterSuccess,
  onRegisterFailed,
  onBeforeRegister,
  agreements,
  publicConfig,
  registeContext
}) => {
  const { t } = useTranslation()

  const isChangeComplete = useIsChangeComplete('email')

  const config = useGuardFinallyConfig()

  const needPassword = config.passwordLoginMethods?.includes('email-password')

  const { changeModule } = useGuardModule()

  const submitButtonRef = useRef<any>(null)

  const { isPhoneMedia } = useMediaSize()

  const authClient = useGuardAuthClient()

  const [form] = Form.useForm()

  const [acceptedAgreements, setAcceptedAgreements] = useState(false)

  const [validated, setValidated] = useState(false)

  const verifyCodeLength = publicConfig?.verifyCodeLength ?? 4

  const { post } = getGuardHttp()

  const onFinish = useCallback(
    async (values: any) => {
      submitButtonRef.current.onSpin(true)

      if (onBeforeRegister) {
        try {
          const canRegister = await onBeforeRegister(
            {
              type: RegisterMethods.EmailCode,
              data: {
                identity: values.email,
                password: values.password,
                code: values.code
              }
            },
            authClient
          )
          if (!canRegister) {
            submitButtonRef.current.onSpin(false)
            return
          }
        } catch (e: any) {
          if (typeof e === 'string') {
            message.error(e)
          } else {
            message.error(e?.message)
          }
          submitButtonRef.current.onSpin(false)
          return
        }
      }

      try {
        await form.validateFields()
        setValidated(true)

        if (agreements?.length && !acceptedAgreements) {
          submitButtonRef.current.onError()
          return
        }
        const { email, code } = values

        const context = registeContext ?? {}
        // 注册使用的详情信息
        const registerContent = {
          email,
          code,
          profile: {
            browser:
              typeof navigator !== 'undefined' ? navigator.userAgent : null,
            device: getDeviceName()
          },
          options: {
            context: JSON.stringify(context),
            generateToken: true
            // params: getUserRegisterParams(),
          }
        }

        if (needPassword) {
          // 判断验证码是否正确
          const {
            statusCode: checkCode,
            data: { valid, message: checkMessage }
          } = await post('/api/v2/email/preCheckCode', {
            email: email,
            emailCode: code
          })
          // 验证码校验通过 进入密码补全流程
          if (checkCode === 200 && valid) {
            changeModule?.(GuardModuleType.REGISTER_PASSWORD, {
              businessRequestName: 'registerByEmailCode', //用于判断后续使用哪个注册api
              content: registerContent,
              isChangeComplete: isChangeComplete,
              onRegisterSuccess,
              onRegisterFailed
            })
            return
          } else {
            submitButtonRef.current.onError()
            message.error(checkMessage)
            return
          }
        } else {
          // 看看是否要跳转到 信息补全
          if (isChangeComplete) {
            // 判断验证码是否正确
            const {
              statusCode: checkCode,
              data: { valid, message: checkMessage }
            } = await post('/api/v2/email/preCheckCode', {
              email: email,
              emailCode: code
            })
            if (checkCode === 200 && valid) {
              changeModule?.(GuardModuleType.REGISTER_COMPLETE_INFO, {
                businessRequestName: 'registerByEmailCode', //用于判断后续使用哪个注册api
                content: registerContent,
                onRegisterSuccess,
                onRegisterFailed
              })
              return
            } else {
              submitButtonRef.current.onError()
              message.error(checkMessage)
              return
            }
          }
          // 注册
          const {
            code: resCode,
            data,
            onGuardHandling,
            message: registerMessage
          } = await post('/api/v2/register-email-code', {
            email: registerContent.email,
            code: registerContent.code,
            profile: registerContent.profile,
            ...registerContent.options
          })
          submitButtonRef.current.onSpin(false)
          if (resCode === 200) {
            onRegisterSuccess(data, {
              specifyDefaultLoginMethod: LoginMethods.PhoneCode
            })
          } else {
            onGuardHandling?.()
            onRegisterFailed(code, data, registerMessage)
          }
        }
      } catch (error: any) {
        const { message: errorMessage, code, data } = error
        submitButtonRef.current.onError()
        message.error(errorMessage)
        !needPassword && onRegisterFailed(code, data, message)
      } finally {
        submitButtonRef.current?.onSpin(false)
      }
    },
    [
      onBeforeRegister,
      authClient,
      form,
      agreements?.length,
      acceptedAgreements,
      registeContext,
      post,
      needPassword,
      changeModule,
      isChangeComplete,
      onRegisterSuccess,
      onRegisterFailed
    ]
  )

  return (
    <div className="authing-g2-register-email">
      <Form
        form={form}
        name="emailRegister"
        autoComplete="off"
        onSubmitCapture={() => submitButtonRef.current.onSpin(true)}
        onFinish={onFinish}
        onFinishFailed={() => submitButtonRef.current.onError()}
      >
        <CustomFormItem.Email
          key="email"
          name="email"
          className={'authing-g2-input-form'}
          validateFirst={true}
          form={form}
          checkRepeat={true}
          required={true}
        >
          <Input
            autoFocus={!isPhoneMedia}
            className="authing-g2-input"
            autoComplete="off"
            size="large"
            placeholder={t('login.inputEmail') as string}
            prefix={
              <IconFont
                type="authing-a-user-line1"
                style={{ color: '#878A95' }}
              />
            }
          />
        </CustomFormItem.Email>
        <Form.Item
          key="code"
          name="code"
          validateTrigger={['onBlur', 'onChange']}
          rules={fieldRequiredRule(t('common.captchaCode'))}
          className="authing-g2-input-form"
          validateFirst={true}
        >
          <SendCodeByEmail
            className="authing-g2-input g2-send-code-input"
            autoComplete="off"
            size="large"
            placeholder={
              t('common.inputFourVerifyCode', {
                length: verifyCodeLength
              }) as string
            }
            prefix={
              <IconFont
                type="authing-a-shield-check-line1"
                style={{ color: '#878A95' }}
              />
            }
            scene={EmailScene.REGISTER_VERIFY_CODE}
            maxLength={verifyCodeLength}
            fieldName={'email'}
            form={form}
            onSendCodeBefore={async () => {
              await form.validateFields(['email'])
            }}
          />
        </Form.Item>
        {Boolean(agreements?.length) && (
          <Agreements
            onChange={setAcceptedAgreements}
            agreements={agreements}
            showError={validated}
          />
        )}
        <Form.Item className="authing-g2-sumbit-form">
          <SubmitButton
            text={t('common.register') as string}
            ref={submitButtonRef}
          />
        </Form.Item>
      </Form>
    </div>
  )
}
