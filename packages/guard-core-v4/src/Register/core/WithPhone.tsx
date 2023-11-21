import { Form, message } from 'shim-antd'

import '@antd-lib-style/form/style/index.less'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { fieldRequiredRule, getDeviceName } from '../../_utils'

import { Agreements } from '../components/Agreements'

import SubmitButton from '../../SubmitButton'

import { InputNumber } from '../../InputNumber'

import CustomFormItem from '../../ValidatorRules'

import { IconFont } from '../../IconFont'

import { SceneType } from 'authing-js-sdk'

import { SendCodeByPhone } from '../../SendCode/SendCodeByPhone'

import { InputInternationPhone } from '../../Login/core/withVerifyCode/InputInternationPhone'

import { parsePhone, useMediaSize } from '../../_utils/hooks'

import { useIsChangeComplete } from '../utils'

import { useGuardFinallyConfig, useGuardModule } from '../../_utils/context'

import { GuardModuleType } from '../../Guard'

import { useGuardHttp } from '../../_utils/guardHttp'

import { useGuardAuthClient } from '../../Guard/authClient'

import { Agreement, ApplicationConfig } from '../../Type/application'

const { useCallback, useRef, useState } = React

export interface RegisterWithPhoneProps {
  // onRegister: Function
  onRegisterSuccess: Function
  onRegisterFailed: Function
  agreements: Agreement[]
  publicConfig?: ApplicationConfig
  registeContext?: any
}

export const RegisterWithPhone: React.FC<RegisterWithPhoneProps> = ({
  onRegisterSuccess,
  onRegisterFailed,
  agreements,
  publicConfig,
  registeContext
}) => {
  const { t } = useTranslation()

  const isChangeComplete = useIsChangeComplete('phone')

  const config = useGuardFinallyConfig()

  const needPassword = config.passwordLoginMethods?.includes('phone-password')

  const { isPhoneMedia } = useMediaSize()

  const authClient = useGuardAuthClient()

  const { changeModule } = useGuardModule()

  const { post } = useGuardHttp()

  const submitButtonRef = useRef<any>(null)

  const [form] = Form.useForm()

  const [acceptedAgreements, setAcceptedAgreements] = useState(false)

  const [validated, setValidated] = useState(false)

  // 区号 默认
  const [areaCode, setAreaCode] = useState(
    publicConfig?.internationalSmsConfig?.defaultISOType || 'CN'
  )

  const verifyCodeLength = publicConfig?.verifyCodeLength ?? 4

  const isInternationSms =
    publicConfig?.internationalSmsConfig?.enabled || false

  const onFinish = useCallback(
    async (values: any) => {
      try {
        submitButtonRef.current?.onSpin(true)
        await form.validateFields()

        setValidated(true)

        if (agreements?.length && !acceptedAgreements) {
          // message.error(t('common.registerProtocolTips'))
          submitButtonRef.current.onError()
          // submitButtonRef.current.onSpin(false)
          return
        }

        const { phone, password = '', code } = values

        const context = registeContext ?? {}

        const { phoneNumber, countryCode: phoneCountryCode } = parsePhone(
          isInternationSms,
          phone,
          areaCode
        )

        // 注册
        const options: any = {
          context,
          generateToken: true
        }

        if (isInternationSms) {
          options.phoneCountryCode = phoneCountryCode
        }

        const registerContent = {
          phone: phoneNumber,
          code,
          password,
          profile: {
            browser:
              typeof navigator !== 'undefined' ? navigator.userAgent : null,
            device: getDeviceName()
          },
          options
        }

        if (needPassword) {
          // 判断验证码是否正确
          const {
            statusCode: checkCode,
            data: { valid, message: checkMessage }
          } = await post('/api/v2/sms/preCheckCode', {
            phone: phoneNumber,
            phoneCode: code,
            phoneCountryCode
          })
          // 验证码校验通过 进入密码补全流程
          if (checkCode === 200 && valid) {
            changeModule?.(GuardModuleType.REGISTER_PASSWORD, {
              businessRequestName: 'registerByPhoneCode',
              content: registerContent,
              isChangeComplete: isChangeComplete
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
            } = await post('/api/v2/sms/preCheckCode', {
              phone: phoneNumber,
              phoneCode: code,
              phoneCountryCode
            })

            if (checkCode === 200 && valid) {
              changeModule?.(GuardModuleType.REGISTER_COMPLETE_INFO, {
                businessRequestName: 'registerByPhoneCode',
                content: registerContent
              })
              return
            } else {
              submitButtonRef.current.onError()
              message.error(checkMessage)
              return
            }
          }

          const user = await authClient.registerByPhoneCode(
            phoneNumber,
            code,
            password,
            {
              browser:
                typeof navigator !== 'undefined' ? navigator.userAgent : null,
              device: getDeviceName()
            },
            options
          )

          submitButtonRef.current?.onSpin(false)
          onRegisterSuccess(user)
        }
      } catch (error: any) {
        const { message: errorMessage, code, data } = error
        submitButtonRef.current.onError()
        message.error(errorMessage)
        !needPassword && onRegisterFailed(code, data, errorMessage)
      } finally {
        submitButtonRef.current?.onSpin(false)
      }
    },
    [
      form,
      agreements?.length,
      acceptedAgreements,
      registeContext,
      isInternationSms,
      areaCode,
      needPassword,
      post,
      changeModule,
      isChangeComplete,
      authClient,
      onRegisterSuccess,
      onRegisterFailed
    ]
  )

  const PhoenAccount = useCallback(
    (props: any) => {
      if (publicConfig && publicConfig.internationalSmsConfig?.enabled) {
        return (
          <InputInternationPhone
            {...props}
            className="authing-g2-input"
            size="large"
            areaCode={areaCode}
            onAreaCodeChange={(value: string) => {
              setAreaCode(value)
              form.getFieldValue(['phone']) && form.validateFields(['phone'])
            }}
            maxLength={20}
          />
        )
      } else {
        return (
          <InputNumber
            {...props}
            className="authing-g2-input"
            size="large"
            placeholder={t('login.inputPhone')}
            prefix={
              <IconFont
                type="authing-a-user-line1"
                style={{ color: '#878A95' }}
              />
            }
            maxLength={11}
          />
        )
      }
    },
    [areaCode, form, publicConfig, t]
  )

  const SendCode = useCallback(
    (props: any) => {
      if (isInternationSms) {
        return (
          <SendCodeByPhone
            {...props}
            isInternationSms={isInternationSms}
            form={form}
            fieldName="phone"
            className="authing-g2-input g2-send-code-input"
            autoComplete="off"
            size="large"
            placeholder={t('common.inputFourVerifyCode', {
              length: verifyCodeLength
            })}
            areaCode={areaCode}
            prefix={
              <IconFont
                type="authing-a-shield-check-line1"
                style={{ color: '#878A95' }}
              />
            }
            scene={SceneType.SCENE_TYPE_REGISTER}
            maxLength={verifyCodeLength}
            onSendCodeBefore={async () => {
              await form.validateFields(['phone'])
            }}
          />
        )
      } else {
        return (
          <SendCodeByPhone
            {...props}
            form={form}
            fieldName="phone"
            className="authing-g2-input g2-send-code-input"
            autoComplete="off"
            size="large"
            placeholder={t('common.inputFourVerifyCode', {
              length: verifyCodeLength
            })}
            maxLength={verifyCodeLength}
            scene={SceneType.SCENE_TYPE_REGISTER}
            prefix={
              <IconFont
                type="authing-a-shield-check-line1"
                style={{ color: '#878A95' }}
              />
            }
            onSendCodeBefore={async () => {
              await form.validateFields(['phone'])
            }}
          />
        )
      }
    },
    [areaCode, form, isInternationSms, t, verifyCodeLength]
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
        <CustomFormItem.Phone
          key="phone"
          name="phone"
          className={
            publicConfig?.internationalSmsConfig?.enabled
              ? 'authing-g2-input-form remove-padding'
              : 'authing-g2-input-form'
          }
          validateFirst={true}
          form={form}
          checkRepeat={true}
          required={true}
          areaCode={areaCode}
        >
          <PhoenAccount autoFocus={!isPhoneMedia} />
        </CustomFormItem.Phone>
        <Form.Item
          key="code"
          name="code"
          validateTrigger={['onBlur', 'onChange']}
          rules={fieldRequiredRule(t('common.captchaCode'))}
          className="authing-g2-input-form"
          validateFirst={true}
        >
          <SendCode />
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
