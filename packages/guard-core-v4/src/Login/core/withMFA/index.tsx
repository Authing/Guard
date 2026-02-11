import { React } from 'shim-react'
import { Form } from 'shim-antd'
import { useTranslation } from 'react-i18next'
import {
  useGuardPublicConfig,
  useGuardFinallyConfig,
  useGuardInitData,
  useGuardHttpClient
} from '../../../_utils/context'
import { parsePhone, useAutoFocus } from '../../../_utils/hooks'
import { LoginMethods } from '../../../Type/application'
import { MFAInputMethod } from '../../../Type'
import { CodeAction, validate } from '../../../_utils'
import { useLoginAccountBackFill } from '../../hooks/useLoginMultiple'
import { InputInternationPhone } from '../withVerifyCode/InputInternationPhone'
import { MFAFormItemIdentify } from './MFAFormItemIdentify'
import { InputIdentify } from './MFAInputIdentify'
import { Agreements } from '../../../Register/components/Agreements'
import SubmitButton from '../../../SubmitButton'
import { GuardLoginInitData } from '../../interface'

const { useCallback, useEffect, useMemo, useRef, useState } = React

const LoginWithMFA = (props: any) => {
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
    specifyMFAMethod,
    loginHint
  } = props

  const { post } = useGuardHttpClient()

  const { autoFocus } = useAutoFocus()

  // 是否开启了国际化短信功能
  const isInternationSms =
    publicConfig?.internationalSmsConfig?.enabled || false

  const acceptedAgreements = useRef(false)

  const acceptedAgreementIds = useRef<(string | number)[]>([])

  const [validated, setValidated] = useState(false)

  const [identify, setIdentify] = useState('')

  const [currentMethod, setCurrentMethod] = useState<MFAInputMethod>(
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

  const [verifyCodeUrl, setVerifyCodeUrl] = useState('')

  let [form] = Form.useForm()

  const changeMethod = useCallback(
    (v: string) => {
      if (methods.length === 1) return
      if (validate('email', v)) {
        setCurrentMethod(MFAInputMethod.EmailMfa)
      } else {
        // 放开手机号校验 方便同时开启邮箱和短信国际化手机号通过
        setCurrentMethod(MFAInputMethod.PhoneMfa)
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

  useLoginAccountBackFill({
    form,
    way: methods,
    formKey: 'identify',
    backfillData,
    isOnlyInternationSms,
    setAreaCode,
    cancelBackfill: specifyDefaultLoginMethod === LoginMethods.MFA,
    changeCurrentMethod,
    loginHint
  })

  let submitButtonRef = useRef<any>(null)
  const { t } = useTranslation()

  const mfaTabConfig = publicConfig?.mfaTabConfig

  const validLoginMethods = useMemo(() => {
    return mfaTabConfig?.validLoginMethods ?? ['phone-mfa', 'email-mfa']
  }, [mfaTabConfig])

  console.log('methods', methods)
  useEffect(() => {
    // 只开启国际化短信
    if (
      methods.length === 1 &&
      methods[0] === 'phone-mfa' &&
      isInternationSms
    ) {
      setInternationSms(true)
      setIsOnlyEmailCode(false)
    } else if (methods.length === 1 && methods[0] === 'email-mfa') {
      setIsOnlyEmailCode(true)
      setInternationSms(false)
    } else {
      setInternationSms(false)
      setIsOnlyEmailCode(false)
    }
  }, [methods, isInternationSms])

  const loginByPhoneMfa = async (values: any) => {
    const reqContent: any = {
      phone: values.phoneNumber,
      code: values.code,
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
    } = await post('/api/v2/login/phone-mfa', reqContent)

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
  const loginByEmailMfa = async (values: any) => {
    const reqContent = {
      email: values.identify,
      code: values.code,
      autoRegister: autoRegister,
      withCustomData: false,
      agreementIds: agreements.length ? acceptedAgreementIds.current : undefined
    }
    const {
      code,
      data,
      onGuardHandling,
      message: tips
    } = await post('/api/v2/login/email-mfa', reqContent)

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
    if (!acceptedAgreements.current && agreements?.length) {
      submitButtonRef.current?.onError()
      return
    }

    const { phoneNumber, countryCode: phoneCountryCode } = parsePhone(
      isInternationSms,
      values.identify,
      areaCode
    )

    submitButtonRef.current?.onSpin(true)

    let loginInfo: any = {
      type: currentMethod,
      data: {
        identity:
          currentMethod === MFAInputMethod.EmailMfa
            ? values.identify
            : phoneNumber,
        phoneCountryCode
      }
    }

    let context = await props.onBeforeLogin?.(loginInfo)

    if (!context && !!props.onBeforeLogin) {
      submitButtonRef.current?.onSpin(false)
      return
    }

    // 保存用户输入的手机号、邮箱
    // saveIdentify && saveIdentify(LoginMethods.MFA, values.identify)

    if (currentMethod === 'phone-mfa') {
      await loginByPhoneMfa({ ...values, phoneNumber, phoneCountryCode })
    } else {
      await loginByEmailMfa(values)
    }
  }

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

  const FormFields = useCallback(
    ({ currentMethod }: { currentMethod: MFAInputMethod }) => {
      return (
        <MFAFormItemIdentify
          name="identify"
          className={
            isOnlyInternationSms
              ? 'authing-g2-input-form remove-padding'
              : 'authing-g2-input-form'
          }
          form={form}
          currentMethod={currentMethod}
          methods={methods}
          required={true}
          areaCode={areaCode}
        >
          {isOnlyInternationSms ? (
            <AreaCodePhoneAccount autoFocus={autoFocus} />
          ) : (
            <InputIdentify
              className="authing-g2-input"
              size="large"
              autoFocus={autoFocus}
              value={identify}
              methods={isOnlyEmailCode ? ['email-mfa'] : methods}
              onChange={(e: any) => {
                let v = e.target.value
                changeMethod(v)
              }}
              onBlur={(e: any) => {
                let v = e.target.value
                changeMethod(v)
              }}
            />
          )}
        </MFAFormItemIdentify>
      )
    },
    [
      areaCode,
      autoFocus,
      form,
      isInternationSms,
      isOnlyInternationSms,
      isOnlyEmailCode,
      identify,
      methods,
      changeMethod,
      setAreaCode,
      t
    ]
  )

  const formValuesChange = (changedValues: Record<string, any>) => {
    if (changedValues?.identify && saveIdentify) {
      saveIdentify(LoginMethods.PhoneCode, changedValues?.identify)
    }
  }

  return (
    <div className="g2-login-container">
      <Form
        name="mfa"
        form={form}
        onFinish={onFinish}
        onFinishFailed={() => submitButtonRef.current?.onError()}
        autoComplete="off"
        onValuesChange={formValuesChange}
      >
        <FormFields currentMethod={currentMethod} />

        {/* <GraphicVerifyCode
          verifyCodeUrl={verifyCodeUrl}
        setVerifyCodeUrl={setVerifyCodeUrl}
        form={form}
        scene="login"
        /> */}

        <Agreements
          onChange={(accept: boolean, agreementIds: (string | number)[]) => {
            acceptedAgreements.current = accept
            acceptedAgreementIds.current = agreementIds
          }}
          agreements={agreements}
          showError={false}
        />

        <Form.Item className="authing-g2-sumbit-form">
          <SubmitButton
            text={t('common.login') as string}
            className="mfa"
            ref={submitButtonRef}
          />
        </Form.Item>
      </Form>
    </div>
  )
}

export { LoginWithMFA }
