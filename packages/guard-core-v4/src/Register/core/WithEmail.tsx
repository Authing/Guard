import { Form, Input, message } from 'shim-antd'

import { RegisterMethods } from 'authing-js-sdk'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { useAsyncFn } from 'react-use'

import { useGuardAuthClient } from '../../Guard/authClient'

import { getDeviceName, getUserRegisterParams } from '../../_utils'

import { Agreements } from '../components/Agreements'

import SubmitButton from '../../SubmitButton'

import CustomFormItem from '../../ValidatorRules'

import { IconFont } from '../../IconFont'

import { InputPassword } from '../../InputPassword'

import { InputNumber } from '../../InputNumber'

import { useIsChangeComplete } from '../utils'

import {
  useGuardFinallyConfig,
  useGuardHttpClient,
  useGuardModule
} from '../../_utils/context'

import { GuardModuleType } from '../../Guard'

import { parsePhone, useMediaSize } from '../../_utils/hooks'

import { ApiCode } from '../../_utils/responseManagement/interface'

import { usePasswordErrorText } from '../../_utils/useErrorText'

import { Agreement, ApplicationConfig } from '../../Type/application'

import { InputInternationPhone } from '../../Login/core/withVerifyCode/InputInternationPhone'

const { useRef, useState, useCallback, useMemo } = React

export interface RegisterWithEmailProps {
  // onRegister: Function
  onRegisterSuccess: Function
  onRegisterFailed: Function
  onBeforeRegister?: Function
  publicConfig?: ApplicationConfig
  agreements: Agreement[]
  registeContext?: any
  label?: string
  method?: string
}

export const RegisterWithEmail: React.FC<RegisterWithEmailProps> = ({
  label,
  method,
  onRegisterSuccess,
  onRegisterFailed,
  onBeforeRegister,
  agreements,
  registeContext,
  publicConfig
}) => {
  const { t } = useTranslation()
  const submitButtonRef = useRef<any>(null)
  const { isPhoneMedia } = useMediaSize()
  const authClient = useGuardAuthClient()
  const [form] = Form.useForm()
  const config = useGuardFinallyConfig()
  const isChangeComplete = useIsChangeComplete('email')
  const { changeModule } = useGuardModule()
  const { post } = useGuardHttpClient()

  const [acceptedAgreements, setAcceptedAgreements] = useState(false)
  const [validated, setValidated] = useState(false)

  // 区号 默认
  const [areaCode, setAreaCode] = useState(
    publicConfig?.internationalSmsConfig?.defaultISOType || 'CN'
  )
  const isInternationSms =
    publicConfig?.internationalSmsConfig?.enabled || false

  const { getPassWordUnsafeText, setPasswordErrorTextShow } =
    usePasswordErrorText()
  const [, onFinish] = useAsyncFn(
    async (values: any) => {
      submitButtonRef.current?.onSpin(true)

      if (onBeforeRegister) {
        try {
          const canRegister = await onBeforeRegister(
            {
              type: RegisterMethods.Email,
              data: {
                identity: values.email || values.account,
                password: values.password,
                code: values.code
              }
            },
            authClient
          )
          if (!canRegister) {
            submitButtonRef.current?.onSpin(false)
            return
          }
        } catch (e: any) {
          if (typeof e === 'string') {
            message.error(e)
          } else {
            message.error(e?.message)
          }
          submitButtonRef.current?.onSpin(false)
          return
        }
      }

      await form.validateFields()
      setValidated(true)

      if (agreements?.length && !acceptedAgreements) {
        submitButtonRef.current.onError()
        return
      }
      let { email, password, account } = values

      // 加密密码
      const encrypt = authClient.options.encryptFunction
      const encryptPassword = await encrypt!(password, config.publicKey!)

      const context = registeContext ?? {}

      let phoneCountryCode

      if (method === 'phone-password') {
        const { phoneNumber, countryCode } = parsePhone(
          isInternationSms,
          account,
          areaCode
        )
        account = phoneNumber
        phoneCountryCode = countryCode
      }

      // 注册使用的详情信息
      const registerContent = {
        account, // 自定义字段登录用户名
        email,
        password: encryptPassword,
        phoneCountryCode,
        profile: {
          browser:
            typeof navigator !== 'undefined' ? navigator.userAgent : null,
          device: getDeviceName()
        },
        forceLogin: false,
        generateToken: true,
        clientIp: undefined,
        params: config?.isHost
          ? JSON.stringify(getUserRegisterParams(['login_page_context']))
          : undefined,
        context: JSON.stringify(context),
        phoneToken: undefined
      }

      // onRegisterSuccess 注册成功后需要回到对应的登录页面
      const onRegisterSuccessIntercept = (user: any) => {
        onRegisterSuccess(user, {
          registerFrom: RegisterMethods.Email,
          account: email || account
        })
      }
      if (isChangeComplete) {
        changeModule?.(GuardModuleType.REGISTER_COMPLETE_INFO, {
          businessRequestName: method || 'registerByEmail',
          content: {
            ...registerContent
          },
          onRegisterSuccess: onRegisterSuccessIntercept,
          onRegisterFailed
        })

        return
      }

      const {
        statusCode,
        data,
        message: errorMessage,
        apiCode
      } = await post(`/api/v2/register-${(method || 'email').split('-')[0]}`, {
        ...registerContent,
        postUserInfoPipeline: false
      })

      if (statusCode === 200) {
        onRegisterSuccessIntercept(data)
      } else {
        if (apiCode === ApiCode.UNSAFE_PASSWORD_TIP) {
          setPasswordErrorTextShow(true)
        }
        submitButtonRef.current.onError()
        onRegisterFailed(apiCode, data, errorMessage)
        message.error(errorMessage)
      }
    },
    [form, acceptedAgreements],
    { loading: false }
  )

  const PhoneAccount = useCallback(
    props => {
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

  const AccountForm = useMemo(() => {
    if (!method) return null

    if (method === 'phone-password') {
      return (
        <CustomFormItem.Phone
          key="account"
          name="account"
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
          <PhoneAccount autoFocus={!isPhoneMedia} />
        </CustomFormItem.Phone>
      )
    }
    return (
      <CustomFormItem.CustomName
        method={method?.split('-')[0]}
        key={method}
        name="account"
        className="authing-g2-input-form"
        validateFirst={true}
        form={form}
        checkRepeat={true}
        required={true}
      >
        <Input
          maxLength={50}
          autoFocus={!isPhoneMedia}
          className="authing-g2-input"
          autoComplete="off"
          size="large"
          placeholder={
            t('login.inputAccount', {
              text: label
            }) as string
          }
          prefix={
            <IconFont
              type="authing-a-user-line1"
              style={{ color: '#878A95' }}
            />
          }
        ></Input>
      </CustomFormItem.CustomName>
    )
  }, [
    PhoneAccount,
    method,
    isPhoneMedia,
    areaCode,
    label,
    t,
    form,
    publicConfig?.internationalSmsConfig?.enabled
  ])
  return (
    <div className="authing-g2-register-email">
      <Form
        form={form}
        name="emailRegister"
        autoComplete="off"
        onSubmitCapture={() => submitButtonRef.current.onSpin(true)}
        onFinish={(values: any) => {
          onFinish(values)
        }}
        onFinishFailed={() => submitButtonRef.current.onError()}
        onValuesChange={(_: any, values: any) => {
          if (values['password'] && values['new-password']) {
            form.validateFields(['new-password'])
          }
        }}
      >
        {/* 新建自定义注册 */}
        {method && label ? (
          AccountForm
        ) : (
          <CustomFormItem.Email
            key="email"
            name="email"
            className="authing-g2-input-form"
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
              // prefix={<UserOutlined style={{ color: '#878A95' }} />}
              prefix={
                <IconFont
                  type="authing-a-user-line1"
                  style={{ color: '#878A95' }}
                />
              }
            />
          </CustomFormItem.Email>
        )}

        <CustomFormItem.Password
          key="password"
          name="password"
          className="authing-g2-input-form"
          validateFirst={true}
        >
          <InputPassword
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
        <CustomFormItem.Password
          key="new-password"
          name="new-password"
          fieldRequiredRuleMessage={t('common.repeatPasswordDoc') as string}
          rules={[
            {
              validateTrigger: 'onBlur',
              validator: (_: any, value: any) => {
                if (value !== form.getFieldValue('password') && value) {
                  return Promise.reject(t('common.repeatPasswordDoc'))
                } else {
                  return Promise.resolve()
                }
              }
            }
          ]}
          className="authing-g2-input-form"
          validateFirst={true}
        >
          <InputPassword
            className="authing-g2-input"
            size="large"
            placeholder={t('common.passwordAgain')}
            // prefix={<LockOutlined style={{ color: '#878A95' }} />}
            prefix={
              <IconFont
                type="authing-a-lock-line1"
                style={{ color: '#878A95' }}
              />
            }
          />
        </CustomFormItem.Password>
        {Boolean(agreements?.length) && (
          <Agreements
            onChange={setAcceptedAgreements}
            agreements={agreements}
            showError={validated}
          />
        )}
        {getPassWordUnsafeText()}
        <Form.Item className="authing-g2-sumbit-form">
          <SubmitButton
            // disabled={
            //   !!agreements.find((item) => item.required && !acceptedAgreements)
            // }
            text={t('common.register') as string}
            ref={submitButtonRef}
          />
        </Form.Item>
      </Form>
    </div>
  )
}
