import { Form, Input, message } from 'shim-antd'

import { LoginMethods } from 'authing-js-sdk'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import {
  BackFillMultipleState,
  StoreInstance
} from '../../Guard/core/hooks/useMultipleAccounts'

import { useGuardAuthClient } from '../../Guard/authClient'

import { IconFont } from '../../IconFont'

import { InputPassword } from '../../InputPassword'

import { Agreements } from '../../Register/components/Agreements'

import SubmitButton from '../../SubmitButton'

import { Agreement } from '../../Type/application'

import { getVersion } from '../../_utils'

import { fieldRequiredRule } from '../../_utils'

import {
  useGuardAppId,
  useGuardFinallyConfig,
  useGuardHttpClient,
  useGuardPublicConfig,
  useRobotVerify
} from '../../_utils/context'

import { useMediaSize } from '../../_utils/hooks'

import { requestClient } from '../../_utils/http'

import { i18n } from '../../_utils/locales'

import { CodeAction } from '../../_utils/responseManagement/interface'

import { ErrorCode } from '../../_utils/GuardErrorCode'

import { getCaptchaUrl } from '../../_utils/getCaptchaUrl'

import { GraphicVerifyCode } from './withPassword/GraphicVerifyCode'

const { useEffect, useRef, useState } = React

interface LoginWithADProps {
  // configs
  publicKey: string
  autoRegister?: boolean
  // host?: string

  // events
  // onLogin: any
  onLoginSuccess: any
  onLoginFailed: any
  onBeforeLogin: any
  agreements: Agreement[]
  /**
   * 回填的数据
   */
  backfillData?: BackFillMultipleState
  /**
   * 根据输入的账号 & 返回获得对应的登录方法
   */
  multipleInstance?: StoreInstance
}

export const LoginWithAD = (props: LoginWithADProps) => {
  const { agreements, onLoginFailed, onLoginSuccess } = props

  const [acceptedAgreements, setAcceptedAgreements] = useState(false)

  const [validated, setValidated] = useState(false)

  const robotVerify = useRobotVerify()

  const [showCaptcha, setShowCaptcha] = useState(
    robotVerify === 'always_enable'
  )
  const [verifyCodeUrl, setVerifyCodeUrl] = useState('')

  const publicConfig = useGuardPublicConfig()

  const { host } = useGuardFinallyConfig()

  const appId = useGuardAppId()

  const { responseIntercept } = useGuardHttpClient()

  const { t } = useTranslation()

  const { isPhoneMedia } = useMediaSize()

  let client = useGuardAuthClient()

  // const { post } = useGuardHttpClient()

  const [form] = Form.useForm()

  // useLoginMultipleBackFill({
  //   form,
  //   way: 'ad',
  //   formKey: 'account',
  //   backfillData,
  // })

  let submitButtonRef = useRef<any>(null)

  const onFinish = async (values: any) => {
    setValidated(true)
    if (agreements?.length && !acceptedAgreements) {
      submitButtonRef.current?.onError()
      return
    }
    // onBeforeLogin
    submitButtonRef.current?.onSpin(true)
    let loginInfo = {
      type: LoginMethods.AD,
      data: {
        identity: values.account,
        password: values.password,
        captchaCode: values.captchaCode
      }
    }
    let context = await props.onBeforeLogin(loginInfo)
    if (!context) {
      submitButtonRef.current?.onSpin(false)
      return
    }

    // onLogin
    let username = values.account && values.account.trim()
    let password = values.password
    let captchaCode = values.captchaCode

    const encrypt = client.options.encryptFunction

    const encryptPassword = await encrypt!(password, props.publicKey)

    // 图形验证码出现后，不管是「图形验证码」错了，还是「账号」「密码」错了，都要重新发验证码
    if (verifyCodeUrl) {
      setVerifyCodeUrl(getCaptchaUrl(host))
    }

    // todo
    try {
      const api = `${host}/api/v2/ad/verify-user`

      const version = getVersion()

      const fetchRes = await fetch(api, {
        method: 'POST',
        body: JSON.stringify({
          username,
          password: encryptPassword,
          captchaCode
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          [requestClient.langHeader]: i18n.language,
          'x-authing-userpool-id': publicConfig.userPoolId,
          'x-authing-app-id': appId,
          'x-authing-sdk-version': version,
          'x-authing-request-from': `Guard@${version}`
        }
      })

      const res = await fetchRes.json()

      const {
        code,
        apiCode,
        data,
        onGuardHandling,
        message: tips
      } = responseIntercept(res)

      // // 更新本次登录方式
      // data && multipleInstance && multipleInstance.setLoginWay('input', 'ad')

      submitButtonRef.current?.onSpin(false)

      if (code === 200) {
        onLoginSuccess(data)
      } else {
        // 需要「图形验证码」并且是第一次，就发一次，后面存在的时候会在点击登录，表单校验通过后，不论对错都要重新请求验证码
        if (apiCode === ErrorCode.INPUT_CAPTCHACODE && !verifyCodeUrl) {
          setVerifyCodeUrl(getCaptchaUrl(host))
          setShowCaptcha(true)
        }

        const handMode = onGuardHandling?.()
        // 向上层抛出错误
        handMode === CodeAction.RENDER_MESSAGE &&
          onLoginFailed(code, data, tips)
      }
    } catch (error: any) {
      submitButtonRef.current?.onSpin(false)
      if (error.code === 'ECONNABORTED') {
        message.error(t('common.timeoutAD'))
        onLoginFailed(2333, {}, JSON.stringify(error))
      } else {
        console.log(error)
      }
    }

    // await client
    //   .loginByAd(account, password)
    //   .then((user) => {
    //     // props.onLogin(200, user)
    //     onLoginSuccess(user)
    //   })
    //   .catch((error: any) => {
    //     if (error.code === 'ECONNABORTED') {
    //       message.error(t('common.timeoutAD'))
    //       onLoginFailed(2333, {})
    //     } else {
    //       submitButtonRef.current?.onError()
    //       let parsedMessage: any = {}
    //       try {
    //         parsedMessage = JSON.parse(error.message) || error
    //       } catch {
    //         console.log('message 解析失败')
    //       }
    //       const { code, statusCode, apiCode, message, data } = parsedMessage
    //       // TODO 错误信息返回不符合 AuthingResponse 的格式 暂用 code 替代
    //       const { onGuardHandling } = responseIntercept({
    //         statusCode: statusCode || code,
    //         apiCode,
    //         data,
    //         message,
    //         code,
    //       })

    //       const handMode = onGuardHandling?.()
    //       // 向上层抛出错误
    //       handMode === CodeAction.RENDER_MESSAGE && onLoginFailed(code, data)
    //     }
    //   })
    //   .finally(() => {
    //     submitButtonRef.current?.onSpin(false)
    //   })
  }

  useEffect(() => {
    setShowCaptcha(robotVerify === 'always_enable')
    if (robotVerify === 'always_enable') {
      setVerifyCodeUrl(getCaptchaUrl(host))
    }
  }, [robotVerify, host])

  return (
    <div className="authing-g2-login-ad">
      <Form
        form={form}
        name="adLogin"
        onFinish={onFinish}
        onFinishFailed={() => submitButtonRef.current.onError()}
        autoComplete="off"
      >
        {publicConfig?.ssoPageComponentDisplay.userPasswordInput && (
          <>
            <Form.Item
              className="authing-g2-input-form"
              name="account"
              validateTrigger={['onBlur', 'onChange']}
              rules={fieldRequiredRule(t('common.account'))}
            >
              <Input
                autoFocus={!isPhoneMedia}
                className="authing-g2-input"
                autoComplete="off"
                size="large"
                placeholder={
                  publicConfig?.mergeAdAndAccountPasswordLogin
                    ? (t('common.jobNumber') as string)
                    : (t('login.inputAdUsername') as string)
                }
                prefix={
                  <IconFont
                    type="authing-a-user-line1"
                    style={{ color: '#878A95' }}
                  />
                }
              />
            </Form.Item>
            <Form.Item
              validateTrigger={['onBlur', 'onChange']}
              className="authing-g2-input-form"
              name="password"
              rules={fieldRequiredRule(t('common.password'))}
            >
              <InputPassword
                autoComplete="off"
                className="authing-g2-input"
                size="large"
                placeholder={
                  publicConfig?.mergeAdAndAccountPasswordLogin
                    ? t('login.inputPwd')
                    : t('login.inputAdPwd')
                }
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
                  changeCode={() => setVerifyCodeUrl(getCaptchaUrl(host))}
                />
              </Form.Item>
            )}
            {Boolean(agreements?.length) && (
              <Agreements
                onChange={setAcceptedAgreements}
                agreements={agreements}
                showError={validated}
              />
            )}
            <Form.Item className="authing-g2-sumbit-form">
              <SubmitButton
                // disabled={
                //   !!agreements.find(
                //     (item) => item.required && !acceptedAgreements
                //   )
                // }
                text={t('common.login') as string}
                className="password"
                ref={submitButtonRef}
              />
            </Form.Item>
          </>
        )}
      </Form>
    </div>
  )
}
