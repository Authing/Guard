import { React } from 'shim-react'

import { Form } from 'shim-antd'

import { useTranslation } from 'react-i18next'

import { useGuardHttp } from '../../../_utils/guardHttp'

import { useGuardAuthClient } from '../../../Guard/authClient'

import {
  fieldRequiredRule,
  getSortLabels,
  getUserRegisterParams
} from '../../../_utils'

import { ErrorCode } from '../../../_utils/GuardErrorCode'

import SubmitButton from '../../../SubmitButton'

import { FormItemAccount } from './FormItemAccount'

import { InputAccount } from './InputAccount'

import { GraphicVerifyCode } from './GraphicVerifyCode'

import { IconFont } from '../../../IconFont'

import { InputPassword } from '../../../InputPassword'

import { Agreements } from '../../../Register/components/Agreements'

import { AuthingGuardResponse, AuthingResponse } from '../../../_utils/http'

import { CodeAction } from '../../../_utils/responseManagement/interface'

import { useMediaSize } from '../../../_utils/hooks'

import {
  useGuardDefaultLanguage,
  useGuardFinallyConfig,
  useGuardInitData,
  useGuardPublicConfig,
  useRobotVerify
} from '../../../_utils/context'

import { GuardLoginInitData } from '../../interface'

import {
  Agreement,
  LoginMethods,
  TabFieldsI18nItem,
  RegisterMethods
} from '../../../Type/application'

import {
  BackFillMultipleState,
  StoreInstance
} from '../../../Guard/core/hooks/useMultipleAccounts'

import { useLoginMultipleBackFill } from '../../hooks/useLoginMultiple'

import { getCaptchaUrl } from '../../../_utils/getCaptchaUrl'

const { useCallback, useEffect, useMemo, useRef, useState } = React

interface LoginWithPasswordProps {
  // configs
  publicKey: string
  autoRegister?: boolean
  host?: string

  // events
  // onLogin: any
  onBeforeLogin?: any
  onLoginSuccess?: any
  onLoginFailed?: any
  // 越过 login 正常的请求，返回一个 res
  onLoginRequest?: (loginInfo: any) => Promise<AuthingResponse>
  passwordLoginMethods: string[]

  agreements: Agreement[]
  loginWay?: LoginMethods
  submitButText?: string
  saveIdentify?: (type: LoginMethods, identity: string) => void
  /**
   * 根据输入的账号 & 返回获得对应的登录方法
   */
  multipleInstance?: StoreInstance
  /**
   * 多账号回填的数据
   */
  backfillData?: BackFillMultipleState
}

export const LoginWithPassword = (props: LoginWithPasswordProps) => {
  const {
    agreements,
    onLoginFailed,
    onLoginSuccess,
    saveIdentify,
    multipleInstance,
    backfillData,
    passwordLoginMethods
  } = props

  const [form] = Form.useForm()

  const { _firstItemInitialValue = '', specifyDefaultLoginMethod } =
    useGuardInitData<GuardLoginInitData>()

  useLoginMultipleBackFill({
    form,
    way: LoginMethods.Password,
    formKey: 'account',
    backfillData,
    cancelBackfill: LoginMethods.Password === specifyDefaultLoginMethod
  })

  const [acceptedAgreements, setAcceptedAgreements] = useState(false)
  const acceptedAgreementIds = useRef<(string | number)[]>([])

  const { isPhoneMedia } = useMediaSize()
  const [validated, setValidated] = useState(false)

  let { t, i18n } = useTranslation()
  let { post } = useGuardHttp()
  let client = useGuardAuthClient()

  const publicConfig = useGuardPublicConfig()
  const config = useGuardFinallyConfig()
  const defaultLanguageConfig = useGuardDefaultLanguage()
  const robotVerify = useRobotVerify()

  let submitButtonRef = useRef<any>(null)

  const [showCaptcha, setShowCaptcha] = useState(
    robotVerify === 'always_enable'
  )
  const [verifyCodeUrl, setVerifyCodeUrl] = useState('')
  const [remainCount, setRemainCount] = useState(0)
  const [accountLock, setAccountLock] = useState(false)

  const encrypt = client.options.encryptFunction

  const loginRequest = useCallback(
    async (loginInfo: any): Promise<AuthingGuardResponse> => {
      if (!!props.onLoginRequest) {
        const res = await props.onLoginRequest(loginInfo)
        return res
      }

      // onLogin
      const { data: loginData } = loginInfo
      let url = publicConfig?.mergeAdAndAccountPasswordLogin
        ? '/api/v2/login/ad-all-in-one'
        : '/api/v2/login/account'
      let account = loginData.identity && loginData.identity.trim()
      let password = loginData.password
      let captchaCode = loginData.captchaCode && loginData.captchaCode.trim()

      let keyValueArray = getUserRegisterParams() || []

      const customData = keyValueArray.reduce((acc: any, curr) => {
        acc[curr.key] = curr.value
        return acc
      }, {})

      let body = {
        account: account,
        password: await encrypt!(password, props.publicKey),
        captchaCode,
        customData: config?.isHost ? customData : undefined,
        autoRegister: props.autoRegister,
        withCustomData: false,
        agreementIds: agreements.length
          ? acceptedAgreementIds.current
          : undefined
      }
      const res = await post(url, body)

      return res
    },
    [
      config?.isHost,
      encrypt,
      post,
      props,
      publicConfig?.mergeAdAndAccountPasswordLogin,
      acceptedAgreementIds,
      agreements
    ]
  )

  const onFinish = async (values: any) => {
    setValidated(true)
    if (agreements?.length && !acceptedAgreements) {
      submitButtonRef.current.onError()
      return
    }
    setRemainCount(0)

    setAccountLock(false)

    // onBeforeLogin
    submitButtonRef?.current?.onSpin(true)
    let loginInfo = {
      type: LoginMethods.Password,
      data: {
        identity: values.account,
        password: values.password,
        captchaCode: values.captchaCode
      }
    }
    let context = await props.onBeforeLogin?.(loginInfo)
    if (!context && !!props.onBeforeLogin) {
      submitButtonRef?.current?.onSpin(false)
      return
    }

    // 图形验证码出现后，不管是「图形验证码」错了，还是「账号」「密码」错了，都要重新发验证码
    if (verifyCodeUrl) {
      setVerifyCodeUrl(getCaptchaUrl(props.host!))
    }
    const res = await loginRequest(loginInfo)

    onLoginRes(res, values.account)
  }

  const onLoginRes = (res: AuthingGuardResponse, account: string) => {
    const { code, apiCode, message: msg, data, onGuardHandling } = res
    submitButtonRef?.current?.onSpin(false)
    // 更新本次登录方式
    data &&
      multipleInstance &&
      multipleInstance.setLoginWayByHttpData(account, data)

    if (code === 200) {
      onLoginSuccess(data, msg)
    } else {
      // 需要「图形验证码」并且是第一次，就发一次，后面存在的时候会在点击登录，表单校验通过后，不论对错都要重新请求验证码
      if (apiCode === ErrorCode.INPUT_CAPTCHACODE && !verifyCodeUrl) {
        setVerifyCodeUrl(getCaptchaUrl(props.host!))
        setShowCaptcha(true)
      }

      if (apiCode === ErrorCode.PASSWORD_ERROR) {
        if ((data as any)?.remainCount ?? false) {
          setRemainCount((data as any)?.remainCount ?? 0)
          submitButtonRef?.current?.onSpin(false)
          // TODO 临时拦截密码错误限制不报 message
          // props.onLogin(9999, data, msg)
          onLoginFailed?.(9999, data, msg)
          return
        }
      }

      if (
        apiCode === ErrorCode.ACCOUNT_LOCK ||
        apiCode === ErrorCode.MULTIPLE_ERROR_LOCK
      ) {
        // 账号锁定
        setAccountLock(true)
      }

      // 响应拦截器处理通用错误以及changeModule
      // 本次请求成功 && 当前请求
      const handMode = onGuardHandling?.()
      if (handMode) {
      }
      // 向上层抛出错误
      handMode === CodeAction.RENDER_MESSAGE && onLoginFailed?.(code, data, msg)
    }
  }

  useEffect(() => {
    setRemainCount(0)
    setAccountLock(false)
  }, [props.loginWay])

  useEffect(() => {
    setShowCaptcha(robotVerify === 'always_enable')
    if (robotVerify === 'always_enable') {
      setVerifyCodeUrl(getCaptchaUrl(props.host!))
    }
  }, [robotVerify, props.host])

  const submitText = useMemo(() => {
    if (props.submitButText) return props.submitButText

    return props.autoRegister &&
      !publicConfig.registerDisabled &&
      config.registerMethods?.filter(
        item =>
          // @ts-ignore
          ![RegisterMethods.Phone, RegisterMethods.EmailCode].includes(item)
      )?.length
      ? `${t('common.login')} / ${t('common.register')}`
      : t('common.login')
  }, [props, t, publicConfig.registerDisabled, config.registerMethods])

  const formValuesChange = (changedValues: Record<string, any>) => {
    if (changedValues?.account && saveIdentify) {
      saveIdentify(LoginMethods.Password, changedValues?.account)
    }
  }

  const i18nFields = useMemo(() => {
    const i18nMap = new Map<string, TabFieldsI18nItem>()
    publicConfig.tabMethodsFields.forEach(item => {
      i18nMap.set(item.key, item)
    })
    return i18nMap
  }, [publicConfig.tabMethodsFields])

  const placeholder = useMemo(() => {
    // 登录注册合并
    if (config?.autoRegister) {
      // 密码 placeholder
      const methods = [...passwordLoginMethods]
      return t('login.inputAccount', {
        text: getSortLabels(methods, i18nFields, defaultLanguageConfig)
      })
    }
    // 登录注册分页
    return t('login.inputAccount', {
      text: getSortLabels(
        [...passwordLoginMethods],
        i18nFields,
        defaultLanguageConfig
      )
    })
  }, [
    config?.autoRegister,
    i18n,
    i18nFields,
    defaultLanguageConfig,
    passwordLoginMethods,
    t
  ])

  const onAgreementsChange = (
    value: boolean,
    acceptAgreement: (string | number)[]
  ) => {
    setAcceptedAgreements(value)
    acceptedAgreementIds.current = acceptAgreement
  }

  return (
    <div className="authing-g2-login-password">
      <Form
        name="passworLogin"
        onFinish={onFinish}
        onFinishFailed={() => submitButtonRef.current.onError()}
        autoComplete="off"
        form={form}
        onValuesChange={formValuesChange}
      >
        <FormItemAccount
          name="account"
          className="authing-g2-input-form"
          validPasswordLoginMethods={
            publicConfig?.passwordTabConfig?.validLoginMethods || []
          }
          initialValue={
            specifyDefaultLoginMethod === LoginMethods.Password
              ? _firstItemInitialValue
              : ''
          }
          // TODO
          // 开启国际化手机号场景且只有手机号情况下 不应再根据区号去验证手机号
        >
          <InputAccount
            className="authing-g2-input"
            autoComplete="off"
            size="large"
            autoFocus={!isPhoneMedia}
            prefix={
              <IconFont
                type="authing-a-user-line1"
                style={{ color: '#878A95' }}
              />
            }
            passwordLoginMethods={passwordLoginMethods}
            placeholder={placeholder}
          />
        </FormItemAccount>
        <Form.Item
          name="password"
          validateTrigger={['onBlur', 'onChange']}
          className="authing-g2-input-form"
          rules={fieldRequiredRule(t('common.password'))}
        >
          <InputPassword
            className="authing-g2-input"
            size="large"
            placeholder={t('login.inputLoginPwd')}
            prefix={
              <IconFont
                type="authing-a-lock-line1"
                style={{ color: '#878A95' }}
              />
            }
          />
        </Form.Item>
        {/* 图形验证码 */}
        {showCaptcha && (
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
              changeCode={() => setVerifyCodeUrl(getCaptchaUrl(props.host!))}
            />
          </Form.Item>
        )}
        {remainCount !== 0 && !accountLock && (
          <span
            style={{
              marginBottom: 23,
              fontSize: 12,
              color: '#E8353E',
              display: 'block'
            }}
          >
            {t('common.loginFailCheck', {
              number: remainCount
            })}
          </span>
        )}
        {accountLock && (
          <span
            style={{
              marginBottom: 23,
              fontSize: 12,
              color: '#E8353E',
              display: 'block'
            }}
          >
            {t('common.accountLock')}
          </span>
        )}

        {Boolean(agreements?.length) && (
          <Agreements
            onChange={onAgreementsChange}
            agreements={agreements}
            showError={validated}
          />
        )}
        <Form.Item className="authing-g2-sumbit-form">
          <SubmitButton
            // TODO 产品还没想好 暂时不上
            // disabled={
            //   !!agreements.find((item) => item.required && !acceptedAgreements)
            // }
            text={submitText}
            className="password"
            ref={submitButtonRef}
          />
        </Form.Item>
      </Form>
    </div>
  )
}
