import { Form, message } from 'shim-antd'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import {
  fieldRequiredRule,
  getDeviceName,
  getUserRegisterParams,
  validate
} from '../../_utils'

import { Agreements } from '../components/Agreements'

import SubmitButton from '../../SubmitButton'

import { IconFont } from '../../IconFont'

import { SceneType } from 'authing-js-sdk'

import { SendCodeByPhone } from '../../SendCode/SendCodeByPhone'

import { InputInternationPhone } from '../../Login/core/withVerifyCode/InputInternationPhone'

import { parsePhone, useMediaSize } from '../../_utils/hooks'

import { useIsChangeComplete } from '../utils'

import {
  useCaptchaCheck,
  useGuardFinallyConfig,
  useGuardModule
} from '../../_utils/context'

import { GuardModuleType } from '../../Guard'

import { useGuardHttp } from '../../_utils/guardHttp'

import { useGuardAuthClient } from '../../Guard/authClient'

import { FormItemIdentify } from '../../Login/core/withVerifyCode/FormItemIdentify'

import { InputIdentify } from '../../Login/core/withVerifyCode/inputIdentify'

import { EmailScene, InputMethod } from '../../Type'

import { SendCodeByEmail } from '../../SendCode/SendCodeByEmail'

import {
  Agreement,
  ApplicationConfig,
  RegisterMethods
} from '../../Type/application'

import { getCaptchaUrl } from '../../_utils/getCaptchaUrl'

import { GraphicVerifyCode } from '../../Login/core/withPassword/GraphicVerifyCode'

const { useCallback, useEffect, useRef, useState } = React

export interface RegisterWithCodeProps {
  // onRegister: Function
  onRegisterSuccess: Function
  onRegisterFailed: Function
  onBeforeRegister?: Function
  agreements: Agreement[]
  publicConfig?: ApplicationConfig
  registeContext?: any
  methods: any[]
}

/**
 * 手机 Code 注册
 * @param param0
 * @returns
 */
export const RegisterWithCode: React.FC<RegisterWithCodeProps> = ({
  onRegisterSuccess,
  onRegisterFailed,
  onBeforeRegister,
  agreements,
  publicConfig,
  registeContext,
  methods = []
}) => {
  const { t } = useTranslation()

  const isPhoneChangeComplete = useIsChangeComplete('phone')

  const isEmailChangeComplete = useIsChangeComplete('email')

  const config = useGuardFinallyConfig()

  const { isPhoneMedia } = useMediaSize()

  const authClient = useGuardAuthClient()

  const { changeModule } = useGuardModule()

  const { post } = useGuardHttp()

  const submitButtonRef = useRef<any>(null)

  const [form] = Form.useForm()

  const [acceptedAgreements, setAcceptedAgreements] = useState(false)

  const acceptedAgreementIds = useRef<(string | number)[]>([])

  const [validated, setValidated] = useState(false)

  // 区号 默认
  const [areaCode, setAreaCode] = useState(
    publicConfig?.internationalSmsConfig?.defaultISOType || 'CN'
  )

  const verifyCodeLength = publicConfig?.verifyCodeLength ?? 4

  const [currentMethod, setCurrentMethod] = useState(methods[0])

  const [identify, setIdentify] = useState('')
  const [captchaCode, setCaptchaCode] = useState('')
  // 是否仅开启国际化短信
  const [isOnlyInternationSms, setInternationSms] = useState(false)
  // 是否开启了国际化短信功能
  const isInternationSms =
    publicConfig?.internationalSmsConfig?.enabled || false

  const captchaCheck = useCaptchaCheck('register')
  const [verifyCodeUrl, setVerifyCodeUrl] = useState('')

  useEffect(() => {
    // 开启国际化配置且登录方式为手机号码时
    if (
      methods.length === 1 &&
      methods[0] === 'phone-code' &&
      publicConfig &&
      publicConfig.internationalSmsConfig?.enabled
    ) {
      setInternationSms(true)
    }
  }, [methods, publicConfig])

  useEffect(() => {
    /** 如果是国外用户池，那么有图形验证码，需要请求图片 */
    if (captchaCheck) {
      setVerifyCodeUrl(getCaptchaUrl(config.host!))
    }
  }, [captchaCheck, config?.host])

  useEffect(() => {
    // 方法发生变化时，图像验证码数据应该清空
    if (captchaCheck) {
      form?.setFieldsValue({ captchaCode: undefined })
    }
  }, [form, currentMethod, captchaCheck])

  const registerByPhoneCode = useCallback(
    async (values: any) => {
      const needPassword =
        config.passwordLoginMethods?.includes('phone-password') &&
        publicConfig?.enableCompletePassword

      submitButtonRef.current?.onSpin(true)

      values.phone = values.identify
      if (onBeforeRegister) {
        try {
          const canRegister = await onBeforeRegister(
            {
              type: RegisterMethods.Phone,
              data: {
                identity: values.phone,
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
          // message.error(t('common.registerProtocolTips'))
          submitButtonRef.current.onError()
          // submitButtonRef.current.onSpin(false)
          return
        }

        const { phone, code } = values

        const context = registeContext ?? {}

        const { phoneNumber, countryCode: phoneCountryCode } = parsePhone(
          isInternationSms,
          phone,
          areaCode
        )

        // 注册
        // const options: any = {
        //   context,
        //   generateToken: true,
        //   // 托管模式下注册携带query上自定义参数login_page_context
        //   params: config?.isHost
        //     ? getUserRegisterParams(['login_page_context'])
        //     : undefined,
        // }

        // if (isInternationSms) {
        //   options.phoneCountryCode = phoneCountryCode
        // }

        const registerContent = {
          phone: phoneNumber,
          code,
          phoneCountryCode: isInternationSms ? phoneCountryCode : undefined,
          // password: undefined, // TODO: 手机号验证码不需要密码
          profile: {
            browser:
              typeof navigator !== 'undefined' ? navigator.userAgent : null,
            device: getDeviceName()
          },
          forceLogin: false,
          generateToken: true,
          clientIp: undefined,
          params: config?.isHost
            ? JSON.stringify(getUserRegisterParams())
            : undefined,
          context: JSON.stringify(context),
          emailToken: undefined,
          agreementIds: agreements.length
            ? acceptedAgreementIds.current
            : undefined
        }
        // onRegisterSuccess 注册成功后需要回到对应的登录页面
        const onRegisterSuccessIntercept = (user: any) => {
          onRegisterSuccess(user, {
            registerFrom: RegisterMethods.Phone,
            account: isInternationSms ? '' : phoneNumber
          })
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
              content: {
                ...registerContent
              },
              isChangeComplete: isPhoneChangeComplete,
              onRegisterSuccess: onRegisterSuccessIntercept,
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
          if (isPhoneChangeComplete) {
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
                content: {
                  ...registerContent
                },
                onRegisterSuccess: onRegisterSuccessIntercept,
                onRegisterFailed
              })
              return
            } else {
              submitButtonRef.current.onError()
              message.error(checkMessage)
              return
            }
          }

          /**
           * 手机号注册接口
           */
          const {
            data,
            statusCode,
            apiCode,
            message: errMessage
          } = await post('/api/v2/register-phone-code', {
            ...registerContent,
            postUserInfoPipeline: false
          })
          if (statusCode === 200) {
            submitButtonRef.current?.onSpin(false)
            onRegisterSuccessIntercept(data)
          } else {
            submitButtonRef.current.onError()
            message.error(errMessage)
            !needPassword && onRegisterFailed(apiCode, data, errMessage)
          }
        }
      } catch (error: any) {
        // TODO 确认无误后 删除 catch
        const { message: errorMessage, code, data } = error
        submitButtonRef.current.onError()
        message.error(errorMessage)
        !needPassword && onRegisterFailed(code, data, errorMessage)
      } finally {
        submitButtonRef.current?.onSpin(false)
      }
    },
    [
      config?.isHost,
      config.passwordLoginMethods,
      onBeforeRegister,
      authClient,
      form,
      agreements?.length,
      acceptedAgreements,
      registeContext,
      isInternationSms,
      areaCode,
      post,
      changeModule,
      isPhoneChangeComplete,
      onRegisterSuccess,
      onRegisterFailed,
      publicConfig?.enableCompletePassword,
      acceptedAgreementIds
    ]
  )

  const registerByEmailCode = useCallback(
    async (values: any) => {
      const needPassword =
        config.passwordLoginMethods?.includes('email-password') &&
        publicConfig?.enableCompletePassword
      submitButtonRef.current.onSpin(true)
      values.email = values.identify
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
          context: JSON.stringify(context),
          generateToken: true,
          // 托管模式下注册携带query上自定义参数login_page_context
          params: config?.isHost
            ? JSON.stringify(getUserRegisterParams()) // 特殊处理 resetful api
            : undefined
        }

        // onRegisterSuccess 注册成功后需要回到对应的登录页面
        const onRegisterSuccessIntercept = (user: any) => {
          onRegisterSuccess(user, {
            registerFrom: RegisterMethods.EmailCode,
            account: email
          })
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
              content: {
                ...registerContent
              },
              isChangeComplete: isEmailChangeComplete,
              onRegisterSuccess: onRegisterSuccessIntercept,
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
          if (isEmailChangeComplete) {
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
                content: {
                  ...registerContent
                },
                onRegisterSuccess: onRegisterSuccessIntercept,
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
            statusCode,
            data,
            apiCode,
            onGuardHandling,
            message: registerMessage
          } = await post('/api/v2/register-email-code', {
            ...registerContent,
            postUserInfoPipeline: false
          })
          submitButtonRef.current.onSpin(false)
          if (statusCode === 200) {
            onRegisterSuccessIntercept(data)
          } else {
            onGuardHandling?.()
            onRegisterFailed(apiCode, data, registerMessage)
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
      config?.isHost,
      config.passwordLoginMethods,
      onBeforeRegister,
      authClient,
      form,
      agreements?.length,
      acceptedAgreements,
      registeContext,
      post,
      changeModule,
      isEmailChangeComplete,
      onRegisterSuccess,
      onRegisterFailed,
      publicConfig?.enableCompletePassword
    ]
  )

  const onFinish = useCallback(
    async (values: any) => {
      if (currentMethod === InputMethod.EmailCode) {
        await registerByEmailCode(values)
      } else if (currentMethod === InputMethod.PhoneCode) {
        await registerByPhoneCode(values)
      }
    },
    [currentMethod, registerByEmailCode, registerByPhoneCode]
  )

  const SendCode = useCallback(
    (props: any) => {
      if (isOnlyInternationSms) {
        return (
          <SendCodeByPhone
            {...props}
            form={form}
            fieldName="identify"
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
            isInternationSms={isInternationSms}
            scene={SceneType.SCENE_TYPE_REGISTER}
            maxLength={verifyCodeLength}
            onSendCodeBefore={async () => {
              await form.validateFields(['identify'])
              await form.validateFields(['captchaCode'])
            }}
          />
        )
      }

      return (
        <>
          {currentMethod === InputMethod.PhoneCode && (
            <SendCodeByPhone
              {...props}
              isInternationSms={isInternationSms}
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
              data={identify}
              captchaCode={captchaCode}
              onSendCodeBefore={async () => {
                await form.validateFields(['identify'])
                await form.validateFields(['captchaCode'])
              }}
            />
          )}
          {currentMethod === InputMethod.EmailCode && (
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
              scene={EmailScene.REGISTER_VERIFY_CODE}
              maxLength={verifyCodeLength}
              data={identify}
              onSendCodeBefore={async () => {
                await form.validateFields(['identify'])
              }}
            />
          )}
        </>
      )
    },
    [
      areaCode,
      currentMethod,
      form,
      identify,
      isInternationSms,
      isOnlyInternationSms,
      t,
      verifyCodeLength,
      captchaCode
    ]
  )

  // 为了 refresh input
  const AreaCodePhoneAccount = useCallback(
    (props: any) => {
      return (
        <InputInternationPhone
          {...props}
          className="authing-g2-input"
          size="large"
          areaCode={areaCode}
          onAreaCodeChange={(value: string) => {
            setAreaCode(value)
            form.getFieldValue(['identify']) &&
              form.validateFields(['identify'])
          }}
        />
      )
    },
    [areaCode, form]
  )

  const onAgreementsChange = (
    value: boolean,
    acceptAgreement: (string | number)[]
  ) => {
    setAcceptedAgreements(value)
    acceptedAgreementIds.current = acceptAgreement
  }

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
        <FormItemIdentify
          name="identify"
          className={
            isOnlyInternationSms
              ? 'authing-g2-input-form remove-padding'
              : 'authing-g2-input-form'
          }
          methods={methods}
          currentMethod={currentMethod}
          areaCode={areaCode}
          checkRepeat={true}
          required={true}
        >
          {isOnlyInternationSms ? (
            <AreaCodePhoneAccount autoFocus={!isPhoneMedia} />
          ) : (
            <InputIdentify
              className="authing-g2-input"
              size="large"
              autoFocus={!isPhoneMedia}
              value={identify}
              methods={methods}
              onChange={(e: any) => {
                let v = e.target.value
                setIdentify(v)
                if (methods.length === 1) return
                if (validate('email', v)) {
                  setCurrentMethod(InputMethod.EmailCode)
                } else {
                  // 放开手机号校验 方便同时开启邮箱和短信国际化手机号通过
                  setCurrentMethod(InputMethod.PhoneCode)
                }
              }}
              prefix={
                <IconFont
                  type="authing-a-user-line1"
                  style={{ color: '#878A95' }}
                />
              }
            />
          )}
        </FormItemIdentify>
        {/* 图形验证码 国外用户池并且是手机号 */}
        {captchaCheck && currentMethod === InputMethod.PhoneCode && (
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
            onChange={onAgreementsChange}
            agreements={agreements}
            showError={validated}
          />
        )}
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
