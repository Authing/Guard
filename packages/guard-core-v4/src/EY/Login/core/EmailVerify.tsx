import { Form, Tooltip } from 'shim-antd'
import { React } from 'shim-react'
import { useTranslation } from 'react-i18next'
import { GuardLoginInitData } from '..'
import {
  ApiCode,
  CodeAction,
  EmailScene,
  GuardModuleType,
  LoginMethods
} from '../../..'
import { useGuardAuthClient } from '../../../Guard/authClient'
import { GuardButton } from '../../../GuardButton'
import { IconFont } from '../../../IconFont'
import { InputPassword } from '../../../InputPassword'
import { useDisables } from '../../../Login'
import { codeMap } from '../../../Login/codemap'

import { Agreements } from '../../../Register/components/Agreements'
import { SendCodeByEmail } from '../../../SendCode/SendCodeByEmail'
import SubmitButton from '../../../SubmitButton'
import { fieldRequiredRule } from '../../../_utils'
import {
  useGuardFinallyConfig,
  useGuardHttpClient,
  useGuardInitData,
  useGuardModule,
  useGuardPublicConfig,
  useRobotVerify
} from '../../../_utils/context'
import { ErrorCode } from '../../../_utils/GuardErrorCode'
import { getGuardHttp } from '../../../_utils/guardHttp'
import { useMediaSize } from '../../../_utils/hooks'
import { fallbackLng, i18n } from '../../../_utils/locales'
import { EmailFormItem } from '../../components/EmailFormItem'
import { EyLoginProps } from '../../interface'
import { signRequestParams } from '../../../_utils/signRequestParams'
import { GraphicVerifyCode } from '../../../Login/core/withPassword/GraphicVerifyCode'
import { getCaptchaUrl } from '../../../_utils/getCaptchaUrl'
const { useCallback, useEffect, useMemo, useRef, useState } = React

interface EmailVerifySceneProps extends EyLoginProps {
  scene: 'password' | 'verifyCode'
}

export const EmailVerifyScene: React.FC<EmailVerifySceneProps> = props => {
  const { t } = useTranslation()

  const initData = useGuardInitData<GuardLoginInitData>()

  const { isPhoneMedia } = useMediaSize()

  const { changeModule } = useGuardModule()

  const { post } = useGuardHttpClient()

  const { authFlow } = getGuardHttp()

  const config = useGuardFinallyConfig()

  const publicConfig = useGuardPublicConfig()

  let authClient = useGuardAuthClient()

  const encrypt = authClient.options.encryptFunction

  const robotVerify = useRobotVerify()

  const [showCaptcha, setShowCaptcha] = useState(
    robotVerify === 'always_enable'
  )

  const [verifyCodeUrl, setVerifyCodeUrl] = useState('')

  const [form] = Form.useForm()

  let submitButtonRef = useRef<any>(null)

  let { disableResetPwd } = useDisables({
    config: config,
    loginWay: 'password',
    autoRegister: config?.autoRegister
  })

  const agreementEnabled = config?.agreementEnabled

  const [acceptedAgreements, setAcceptedAgreements] = useState(false)

  const [remainCount, setRemainCount] = useState(0)

  const [accountLock, setAccountLock] = useState(false)

  const [validated, setValidated] = useState(false)

  const [errorNumber, setErrorNumber] = useState(0)

  const verifyCodeLength = publicConfig?.verifyCodeLength ?? 4

  const agreements = useMemo(
    () =>
      agreementEnabled
        ? config?.agreements?.filter(
            agree =>
              fallbackLng(i18n.language).find(lng =>
                lng.includes(agree.lang)
              ) &&
              (config?.autoRegister || !!agree?.availableAt)
          ) ?? []
        : [],
    [agreementEnabled, config?.autoRegister, config?.agreements, i18n.language]
  )

  const onFinishHandle = async (formValue: any) => {
    try {
      setValidated(true)
      // 接受协议
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
        data: formValue
      }
      let context = await props.onBeforeLogin?.(loginInfo)
      if (!context && !!props.onBeforeLogin) {
        submitButtonRef?.current?.onSpin(false)
        return
      }

      let params: any = {}
      if (props.scene === 'verifyCode') {
        params = {
          connection: 'PASSCODE',
          passCodePayload: {
            passCode: formValue.code,
            email: formValue.email
          },
          options: {
            captchaCode: formValue.captchaCode
          }
        }
      } else {
        let password = await encrypt!(
          formValue.password,
          config?.publicKey as string
        )
        params = {
          connection: 'PASSWORD',
          passwordPayload: {
            password,
            email: formValue.email
          },
          options: {
            passwordEncryptType: 'rsa',
            autoRegister: false,
            captchaCode: formValue.captchaCode
          }
        }
      }

      // 图形验证码出现后，不管是「图形验证码」错了，还是「账号」「密码」错了，都要重新发验证码
      if (verifyCodeUrl) {
        setVerifyCodeUrl(getCaptchaUrl(config.host!))
      }

      const res = await post(
        '/api/v3/sign-in-invitation-user',
        signRequestParams(params)
      )

      const { code, data, apiCode, onGuardHandling, message: msg } = res

      submitButtonRef?.current?.onSpin(false)

      if (code === 200) {
        props?.onLoginSuccess?.(data, msg)
      } else {
        if (apiCode === ErrorCode.INPUT_CAPTCHACODE && !verifyCodeUrl) {
          setVerifyCodeUrl(getCaptchaUrl(config.host!))
          setShowCaptcha(true)
        }

        if (apiCode === ErrorCode.PASSWORD_ERROR) {
          if ((data as any)?.remainCount ?? false) {
            setRemainCount((data as any)?.remainCount ?? 0)
            submitButtonRef?.current?.onSpin(false)
            // TODO 临时拦截密码错误限制不报 message
            // props.onLogin(9999, data, msg)
            props?.onLoginFailed?.(9999, data, msg)
            return
          }
        }

        const codeAction = codeMap[apiCode!]

        if (codeAction?.action === 'message') {
          setErrorNumber(errorNumber + 1)
        }

        if (codeAction?.action === 'accountLock') {
          setAccountLock(true)
        }

        let context = {}
        if (apiCode === ApiCode.EY_PROTOCOLS) {
          context = {
            onAcceptHandle: async () => {
              const res = await authFlow('terms-and-agreements', {
                agree: true
              })
              const { isFlowEnd, onGuardHandling, message: msg, data } = res

              if (isFlowEnd) {
                props?.onLoginSuccess?.(data, msg)
              } else {
                onGuardHandling?.()
              }
            },
            onRejectHandle: async () => {
              const res = await authFlow('terms-and-agreements', {
                agree: false
              })
              const { isFlowEnd, onGuardHandling, apiCode } = res
              if (isFlowEnd || apiCode === ApiCode.ABORT_FLOW) {
                changeModule?.(GuardModuleType.EY_PRE_CHECK_EMAIL, initData)
              } else {
                onGuardHandling?.()
              }
            }
          }
        }

        const handMode = onGuardHandling?.(context)
        if (handMode) {
          // 向上层抛出错误
          handMode === CodeAction.RENDER_MESSAGE &&
            props?.onLoginFailed?.(apiCode!, data, msg)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  const renderVerify = useCallback(() => {
    if (props.scene === 'verifyCode') {
      return (
        <Form.Item
          noStyle
          shouldUpdate={(prev, next) => prev.email !== next.email}
        >
          {({ getFieldValue }) => {
            const identify = getFieldValue('email')

            return (
              <Form.Item
                validateTrigger={['onBlur', 'onChange']}
                className="authing-g2-input-form"
                name="code"
                rules={[...fieldRequiredRule(t('common.captchaCode'))]}
              >
                <SendCodeByEmail
                  className="authing-g2-input g2-send-code-input"
                  autoComplete="off"
                  size="large"
                  placeholder={
                    t('common.inputFourVerifyCode', {
                      length: verifyCodeLength
                    })!
                  }
                  prefix={
                    <IconFont
                      type="authing-a-shield-check-line1"
                      style={{ color: '#878A95' }}
                    />
                  }
                  form={form}
                  fieldName={'email'}
                  scene={EmailScene.LOGIN_VERIFY_CODE}
                  maxLength={verifyCodeLength}
                  data={identify}
                  onSendCodeBefore={async () => {
                    await form.validateFields(['email'])
                  }}
                />
              </Form.Item>
            )
          }}
        </Form.Item>
      )
    }

    return (
      <Form.Item
        name="password"
        validateTrigger={['onBlur', 'onChange']}
        className="authing-g2-input-form"
        validateFirst={true}
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
    )
  }, [form, props, t, verifyCodeLength])

  useEffect(() => {
    setShowCaptcha(robotVerify === 'always_enable')
    if (robotVerify === 'always_enable') {
      setVerifyCodeUrl(getCaptchaUrl(config.host!))
    }
  }, [robotVerify, config.host])

  return (
    <>
      <div className="g2-view-content">
        <div className="method_title">{t('common.ey.emailLogin')}</div>
        <div className="authing-g2-login-password">
          <Form
            name="passworLogin"
            onFinish={onFinishHandle}
            onFinishFailed={() => submitButtonRef.current.onError()}
            autoComplete="off"
            form={form}
            //   onValuesChange={formValuesChange}
          >
            <EmailFormItem
              inputProps={{
                autoFocus: !isPhoneMedia,
                placeholder: t('login.inputEmail'),
                disabled: !!initData?.verifyAccount
              }}
              formItemProps={{
                initialValue: initData?.verifyAccount
              }}
            />

            {renderVerify()}

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
                  placeholder={t('login.inputCaptchaCode')!}
                  verifyCodeUrl={verifyCodeUrl}
                  changeCode={() =>
                    setVerifyCodeUrl(getCaptchaUrl(config.host!))
                  }
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
            <div></div>

            {Boolean(agreements?.length) && (
              <Agreements
                onChange={setAcceptedAgreements}
                agreements={agreements}
                showError={validated}
              />
            )}
            <Form.Item className="authing-g2-sumbit-form">
              <SubmitButton
                text={t('common.login')!}
                className="password"
                ref={submitButtonRef}
              />
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className={'g2-tips-line'}>
        {!disableResetPwd && (
          <div>
            <GuardButton
              type="link"
              className="link-like forget-password-link"
              onClick={() =>
                changeModule?.(GuardModuleType.FORGET_PWD, {
                  ...initData,
                  scene: 'password'
                })
              }
            >
              {t('login.forgetPwd')}
            </GuardButton>

            {(errorNumber >= 2 || accountLock) && (
              <span style={{ margin: '0 4px', color: '#fff' }}>丨</span>
            )}
          </div>
        )}
        {(errorNumber >= 2 || accountLock) && (
          <Tooltip title={t('common.feedback')}>
            <div
              className="touch-tip question-feedback"
              onClick={() =>
                changeModule?.(GuardModuleType.ANY_QUESTIONS, initData)
              }
            >
              <IconFont
                type={'authing-a-question-line1'}
                style={{ fontSize: 16 }}
              />
            </div>
          </Tooltip>
        )}
      </div>
    </>
  )
}
