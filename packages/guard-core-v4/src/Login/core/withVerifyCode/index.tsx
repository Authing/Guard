import { React } from 'shim-react'

import { Form } from 'shim-antd'

import { useTranslation } from 'react-i18next'

import {
  fieldRequiredRule,
  getUserRegisterParams,
  validate,
  getPhoneInLoginPageContext
} from '../../../_utils'

import SubmitButton from '../../../SubmitButton'

import { IconFont } from '../../../IconFont'

import { Agreements } from '../../../Register/components/Agreements'

import { SceneType } from 'authing-js-sdk'

import { SendCodeByPhone } from '../../../SendCode/SendCodeByPhone'

import {
  useCaptchaCheck,
  useGuardFinallyConfig,
  useGuardHttpClient,
  useGuardInitData,
  useGuardPublicConfig
} from '../../../_utils/context'

import { SendCodeByEmail } from '../../../SendCode/SendCodeByEmail'

import { FormItemIdentify } from './FormItemIdentify'

import { InputIdentify } from './inputIdentify'

import './styles.less'

import { InputInternationPhone } from './InputInternationPhone'

import { parsePhone, useMediaSize } from '../../../_utils/hooks'

import { EmailScene, InputMethod } from '../../../Type'

import { CodeAction } from '../../../_utils/responseManagement/interface'

import { GuardLoginInitData } from '../../interface'

import { LoginMethods, RegisterMethods } from '../../../Type/application'

import { useLoginMultipleBackFill } from '../../hooks/useLoginMultiple'

import { GraphicVerifyCode } from '../withPassword/GraphicVerifyCode'

import { getCaptchaUrl } from '../../../_utils/getCaptchaUrl'

export enum SpecifyCodeMethods {
  Phone = 'phone',
  Email = 'email'
}

const { useCallback, useEffect, useMemo, useRef, useState } = React

const LoginWithVerifyCode = (props: any) => {
  const publicConfig = useGuardPublicConfig()

  const config = useGuardFinallyConfig()

  const {
    _firstItemInitialValue = '',
    specifyDefaultLoginMethod,
    _lockMethod
  } = useGuardInitData<GuardLoginInitData>()
  const {
    agreements,
    methods,
    autoRegister,
    submitButText,
    onLoginFailed,
    onLoginSuccess,
    saveIdentify,
    multipleInstance,
    backfillData,
    specifyCodeMethod
  } = props

  const verifyCodeLength = publicConfig?.verifyCodeLength ?? 4

  const { post } = useGuardHttpClient()

  const { isPhoneMedia } = useMediaSize()

  // 是否开启了国际化短信功能
  const isInternationSms =
    publicConfig?.internationalSmsConfig?.enabled || false

  const acceptedAgreements = useRef(false)

  const acceptedAgreementIds = useRef<(string | number)[]>([])

  const [validated, setValidated] = useState(false)

  const [identify, setIdentify] = useState('')

  const [currentMethod, setCurrentMethod] = useState<InputMethod>(
    specifyDefaultLoginMethod ? _lockMethod ?? methods[0] : methods[0]
  )
  // 是否仅开启国际化短信
  const [isOnlyInternationSms, setInternationSms] = useState(false)
  // 是否仅使用邮箱验证码
  const [isOnlyEmailCode, setIsOnlyEmailCode] = useState(false)
  // 区号 默认
  const [areaCode, setAreaCode] = useState(
    publicConfig?.internationalSmsConfig?.defaultISOType || 'CN'
  )

  const captchaCheck = useCaptchaCheck('login')
  const [verifyCodeUrl, setVerifyCodeUrl] = useState('')

  let [form] = Form.useForm()

  const changeMethod = useCallback(
    (v: string) => {
      if (methods.length === 1) return
      if (validate('email', v)) {
        setCurrentMethod(InputMethod.EmailCode)
      } else {
        // 放开手机号校验 方便同时开启邮箱和短信国际化手机号通过
        setCurrentMethod(InputMethod.PhoneCode)
      }
    },
    [methods.length]
  )

  const changeCurrentMethod = useCallback(
    (v: string) => {
      setIdentify(v)
      changeMethod(v)
    },
    [changeMethod]
  )

  useLoginMultipleBackFill({
    form,
    way: LoginMethods.PhoneCode,
    formKey: 'identify',
    backfillData,
    isOnlyInternationSms,
    setAreaCode,
    cancelBackfill: specifyDefaultLoginMethod === LoginMethods.PhoneCode,
    changeCurrentMethod
  })

  let submitButtonRef = useRef<any>(null)
  const { t } = useTranslation()

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
            scene={SceneType.SCENE_TYPE_LOGIN}
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
              scene={SceneType.SCENE_TYPE_LOGIN}
              maxLength={verifyCodeLength}
              form={form}
              fieldName={'identify'}
              data={identify}
              codeFieldName={'captchaCode'}
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
              form={form}
              fieldName={'identify'}
              scene={EmailScene.LOGIN_VERIFY_CODE}
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
      verifyCodeLength
    ]
  )

  useEffect(() => {
    // 开启国际化配置且登录方式为手机号码时
    if (
      (methods.length === 1 &&
        methods[0] === 'phone-code' &&
        publicConfig?.internationalSmsConfig?.enabled) ||
      specifyCodeMethod === SpecifyCodeMethods.Phone
    ) {
      setInternationSms(true)
      setCurrentMethod(InputMethod.PhoneCode)
    }
    // 指定了只用邮箱验证码
    if (specifyCodeMethod === SpecifyCodeMethods.Email) {
      setIsOnlyEmailCode(true)
      setCurrentMethod(InputMethod.EmailCode)
    }
  }, [publicConfig, methods, specifyCodeMethod])

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

  const loginByPhoneCode = async (values: any) => {
    let keyValueArray = getUserRegisterParams() || []

    const customData = keyValueArray.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value
      return acc
    }, {})
    const reqContent: any = {
      phone: values.phoneNumber,
      code: values.code,
      customData: config?.isHost ? customData : undefined,
      autoRegister: autoRegister,
      withCustomData: false,
      agreementIds: agreements.length ? acceptedAgreementIds.current : undefined
    }

    if (publicConfig && publicConfig.internationalSmsConfig?.enabled)
      reqContent.phoneCountryCode = values.phoneCountryCode

    const {
      code,
      data,
      onGuardHandling,
      message: tips
    } = await post('/api/v2/login/phone-code', reqContent)

    submitButtonRef.current?.onSpin(false)

    if (code === 200) {
      // props.onLogin(200, data)
      onLoginSuccess(data)
    } else {
      const handMode = onGuardHandling?.()
      // 向上层抛出错误
      handMode === CodeAction.RENDER_MESSAGE && onLoginFailed(code, data, tips)
    }
  }

  // 邮箱验证码登录
  const loginByEmailCode = async (values: any) => {
    let keyValueArray = getUserRegisterParams() || []

    const customData = keyValueArray.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value
      return acc
    }, {})
    const reqContent = {
      email: values.identify,
      code: values.code,
      customData: config?.isHost ? customData : undefined,
      autoRegister: autoRegister,
      withCustomData: false,
      agreementIds: agreements.length ? acceptedAgreementIds.current : undefined
    }
    const {
      code,
      data,
      onGuardHandling,
      message: tips
    } = await post('/api/v2/login/email-code', reqContent)

    submitButtonRef.current?.onSpin(false)

    if (code === 200) {
      // props.onLogin(200, data)
      onLoginSuccess(data)
    } else {
      const handMode = onGuardHandling?.()
      // 向上层抛出错误
      handMode === CodeAction.RENDER_MESSAGE && onLoginFailed(code, data, tips)
    }
  }

  const onFinish = async (values: any) => {
    setValidated(true)
    if (agreements?.length && !acceptedAgreements.current) {
      // message.error(t('common.loginProtocolTips'))
      submitButtonRef.current.onError()
      return
    }
    // 解析手机号码 ==> 输出 phoenNumber 和 phoneCountryCode
    const { phoneNumber, countryCode: phoneCountryCode } = parsePhone(
      isInternationSms,
      values.identify,
      areaCode
    )
    // onBeforeLogin
    submitButtonRef.current?.onSpin(true)

    let loginInfo = {
      type: currentMethod,
      data: {
        identity:
          currentMethod === InputMethod.EmailCode
            ? values.identify
            : phoneNumber,
        code: values.code,
        phoneCountryCode
      }
    }

    let context = await props.onBeforeLogin?.(loginInfo)

    if (!context && !!props.onBeforeLogin) {
      submitButtonRef.current?.onSpin(false)
      return
    }
    // 身份源绑定
    if (!!props.onLoginRequest) {
      const res = await props.onLoginRequest?.(loginInfo)
      const { code, apiCode, data, onGuardHandling, message: tips } = res

      submitButtonRef.current?.onSpin(false)
      if (code === 200) {
        onLoginSuccess(data)
      } else {
        const handMode = onGuardHandling?.()
        // 向上层抛出错误 执行绑定失败钩子
        handMode === CodeAction.RENDER_MESSAGE &&
          onLoginFailed(apiCode ?? code, data, tips)
      }
      return
    }

    // 其实这里应该是保存两个 一个是 countryCode 一个是对应的 code
    multipleInstance &&
      multipleInstance.setLoginWay(
        'input',
        currentMethod === 'phone-code' ? 'phone-code' : 'email-code',
        undefined,
        isInternationSms
          ? {
              phoneCountryCode,
              areaCode
            }
          : undefined
      )

    if (currentMethod === 'phone-code') {
      await loginByPhoneCode({ ...values, phoneNumber, phoneCountryCode })
    } else {
      await loginByEmailCode(values)
    }
  }

  const submitText = useMemo(() => {
    if (submitButText) return submitButText

    return autoRegister &&
      !publicConfig.registerDisabled &&
      config.registerMethods?.filter(item =>
        // @ts-ignore
        [RegisterMethods.Phone, RegisterMethods.EmailCode].includes(item)
      )?.length
      ? `${t('common.login')} / ${t('common.register')}`
      : t('common.login')
  }, [
    autoRegister,
    submitButText,
    t,
    config.registerMethods,
    publicConfig.registerDisabled
  ])
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

  const formValuesChange = (changedValues: Record<string, any>) => {
    if (changedValues?.identify && saveIdentify) {
      saveIdentify(LoginMethods.PhoneCode, changedValues?.identify)
    }
  }

  const onAgreementsChange = (
    value: boolean,
    acceptAgreement: (string | number)[]
  ) => {
    acceptedAgreements.current = value
    acceptedAgreementIds.current = acceptAgreement
  }

  const phone = getPhoneInLoginPageContext()

  return (
    <div className="authing-g2-login-phone-code">
      <Form
        name="phoneCode"
        form={form}
        onFinish={onFinish}
        onFinishFailed={() => submitButtonRef.current.onError()}
        autoComplete="off"
        onValuesChange={formValuesChange}
      >
        <FormItemIdentify
          initialValue={
            specifyDefaultLoginMethod === LoginMethods.PhoneCode
              ? _firstItemInitialValue
              : (specifyCodeMethod === 'phone' || !isInternationSms) && phone
              ? phone
              : ''
          }
          name="identify"
          className={
            isOnlyInternationSms
              ? 'authing-g2-input-form remove-padding'
              : 'authing-g2-input-form'
          }
          methods={methods}
          checkExist={!autoRegister}
          currentMethod={currentMethod}
          areaCode={areaCode}
        >
          {isOnlyInternationSms ? (
            <AreaCodePhoneAccount autoFocus={!isPhoneMedia} />
          ) : (
            <InputIdentify
              className="authing-g2-input"
              size="large"
              autoFocus={!isPhoneMedia}
              value={identify}
              methods={isOnlyEmailCode ? ['email-code'] : methods}
              onChange={e => {
                let v = e.target.value
                changeMethod(v)
              }}
              onBlur={e => {
                let v = e.target.value
                changeMethod(v)
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
            />
          </Form.Item>
        )}
        <Form.Item
          validateTrigger={['onBlur', 'onChange']}
          className="authing-g2-input-form"
          name="code"
          rules={[...fieldRequiredRule(t('common.captchaCode'))]}
        >
          <SendCode />
        </Form.Item>
        {Boolean(agreements?.length) && (
          <Agreements
            // onChange={val => {
            //   acceptedAgreements.current = val
            // }}
            onChange={onAgreementsChange}
            agreements={agreements}
            showError={validated}
          />
        )}
        <Form.Item className="authing-g2-sumbit-form">
          <SubmitButton
            text={submitText}
            className="password"
            ref={submitButtonRef}
          />
        </Form.Item>
      </Form>
    </div>
  )
}

export { LoginWithVerifyCode }
