import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { Form, message } from 'shim-antd'

import { GuardModuleType } from '../Guard/module'

import { ResetPassword } from './core/resetPassword'

import { ImagePro } from '../ImagePro'

import { useGuardAuthClient } from '../Guard/authClient'

import {
  useGuardEvents,
  useGuardFinallyConfig,
  useGuardModule,
  useGuardPublicConfig
} from '../_utils/context'

import { InputPasswordForget } from './InputPassword/index'

import { IconFont } from '../IconFont'

import SubmitButton from '../SubmitButton'

import { getGuardHttp } from '../_utils/guardHttp'

import { getPasswordValidateRules, PasswordStrength } from '../_utils'

import { usePasswordErrorText } from '../_utils/useErrorText'

import { ApiCode } from '../_utils/responseManagement/interface'

import { useGuardView } from '../Guard/core/hooks/useGuardView'

const { useRef, useState } = React

export const GuardForgetPassword: React.FC = () => {
  const { t } = useTranslation()

  const events = useGuardEvents()

  const publicConfig = useGuardPublicConfig()

  const authClient = useGuardAuthClient()

  const config = useGuardFinallyConfig()

  useGuardView()

  const { changeModule } = useGuardModule()
  const [controlShow, setControlShow] = useState(true)
  const [policyStrength, setPolicyStrength] = useState(0)
  const [customPasswordStrength, setCustomPasswordStrength] = useState({})
  const [phoneOrEmailText, setPhoneOrEmailText] = useState('')
  const { getPassWordUnsafeText, setPasswordErrorTextShow } =
    usePasswordErrorText()

  // 忘记密码的 token，在第二步重置密码时传给后端
  const [resetToken, setResetToken] = useState('')

  /**
   * 「返回」的回调函数，goBack 是 null 的时候就隐藏「第一步的返回按钮、最后提交成功后的返回和自动跳转」
   *  goBack 不等于 null 时，如果传入就使用传入的，不然就默认跳转到 登录模块
   */
  const needBack = config?.goBack !== null
  const goBack = config?.goBack ?? (() => changeModule?.(GuardModuleType.LOGIN))

  let [form] = Form.useForm()
  const { post } = getGuardHttp()
  let submitBtnRef = useRef<any>(null)
  const onFinish = async () => {
    // 重置密码
    let data = form.getFieldsValue()
    const newPassword = await authClient.options?.encryptFunction?.(
      data.password,
      publicConfig.publicKey
    )
    const repeatPassword = await authClient.options?.encryptFunction?.(
      data.repeatPassword,
      publicConfig.publicKey
    )
    let res = post('/api/v2/users/password/password-reset', {
      newPassword,
      repeatPassword,
      // ...phoneOrEmail, // 不用传 phone 和 email 了
      resetPasswordToken: resetToken
    })

    res
      .then((r: any) => {
        const { code } = r
        if (code === ApiCode.UNSAFE_PASSWORD_TIP) {
          setPasswordErrorTextShow(true)
        }
        if (code !== 200) {
          events?.onPwdResetError?.(r, authClient)
          message.error(r?.message)
          return
        }
        events?.onPwdReset?.(authClient)
        // 返回登录
        const initData = {
          title: t('common.resetSuccess'),
          message: t('common.resetSuccessMessage'),
          needBack,
          goBack
        }
        changeModule?.(GuardModuleType.New_SUBMIT_SUCCESS, {
          ...initData
        })
        // props.onSend(codeMethod)
      })
      .catch(e => {
        submitBtnRef.current.onError()
        // props.onSendError(codeMethod, e)
        events?.onPwdResetError?.(e, authClient)
        message.error(e.message)
        return
      })
  }
  const rules = () => {
    let passwordStrength = [
      PasswordStrength.NoCheck,
      PasswordStrength.Low,
      PasswordStrength.Middle,
      PasswordStrength.High,
      PasswordStrength.AUTO
    ]
    let rule = getPasswordValidateRules(
      passwordStrength[policyStrength],
      customPasswordStrength,
      'onChange',
      t('login.resetPassword.pleaseInputPassword') as string
    )
    return rule
  }
  // const onSend = (type: 'phone' | 'email') => {
  //   if (type === 'phone') events?.onPwdPhoneSend?.(authClient)
  //   if (type === 'email') events?.onPwdEmailSend?.(authClient)
  // }
  // const onSendError = (type: 'phone' | 'email', error: any) => {
  //   if (type === 'phone')
  //     events?.onPwdPhoneSendError?.(error as CommonMessage, authClient)
  //   if (type === 'email')
  //     events?.onPwdEmailSendError?.(error as CommonMessage, authClient)
  // }

  return controlShow ? (
    <div className="g2-view-container g2-forget-password g2-password-reset-pageWrap g2-password-reset-step1">
      <div className="g2-view-header">
        <ImagePro
          src={config?.logo as string}
          size={48}
          borderRadius={4}
          alt=""
          className="icon"
        />
        <div className="title">{t('login.resetPwd')}</div>
        <div className="title-explain">
          {t('login.resetPassword.resetPasswordText1')}
        </div>
      </div>
      <div className="g2-view-tabs">
        <ResetPassword
          // onReset={onReset}
          publicConfig={publicConfig}
          setControlShow={setControlShow}
          setPolicyStrength={setPolicyStrength}
          setCustomPasswordStrength={setCustomPasswordStrength}
          setPhoneOrEmailText={setPhoneOrEmailText}
          setResetToken={setResetToken}
        />
      </div>
      {needBack && (
        <div className="g2-tips-line">
          <div className="link-like back-to-login" onClick={goBack}>
            {t('login.resetPassword.back')}
          </div>
        </div>
      )}
      {/* <ChangeLanguage langRange={langRange} onLangChange={props.onLangChange} /> */}
    </div>
  ) : (
    <div className="g2-view-container g2-forget-password g2-password-reset-pageWrap g2-password-reset-step2">
      <div className="g2-view-header">
        <ImagePro
          src={config?.logo as string}
          size={48}
          borderRadius={4}
          alt=""
          className="icon"
        />
        <div className="title">{t('login.resetPwd')}</div>
        <div className="title-explain">
          {t('login.resetPassword.resetPasswordText2', {
            account: phoneOrEmailText
          })}
        </div>
      </div>
      <div className="g2-view-tabs">
        <Form
          name="resetPassword"
          form={form}
          onFinish={onFinish}
          onFinishFailed={() => {
            submitBtnRef?.current?.onError()
          }}
          autoComplete="off"
        >
          <Form.Item
            className="authing-g2-input-form-password"
            name="password"
            rules={
              // {
              //   required: true,
              //   message: t('login.resetPassword.pleaseInputPassword'),
              // },
              rules()
            }
          >
            <InputPasswordForget
              className="authing-g2-input"
              size="large"
              placeholder={t('login.resetPassword.inputNewPwd') as string}
              prefix={
                <IconFont
                  type="authing-a-lock-line1"
                  style={{ color: '#878A95', marginBottom: 2 }}
                />
              }
            />
          </Form.Item>
          <Form.Item
            className="authing-g2-input-form-password-repeat"
            name="repeatPassword"
            validateFirst={true}
            rules={[
              {
                required: true,
                message: t('login.resetPassword.pleaseInputPassword') as string
              },
              ({ getFieldValue }) => ({
                validator: (_, value) => {
                  let password = getFieldValue('password')
                  if (password === undefined && value === undefined) {
                    return Promise.resolve()
                  }
                  if (password === value) {
                    return Promise.resolve()
                  } else {
                    return Promise.reject(
                      t('login.resetPassword.checkPasswordDiff')
                    )
                  }
                }
              })
            ]}
          >
            <InputPasswordForget
              className="authing-g2-input"
              size="large"
              placeholder={t('login.resetPassword.confirmNewPwd') as string}
              prefix={
                <IconFont
                  type="authing-a-lock-line1"
                  style={{ color: '#878A95', marginBottom: 2 }}
                />
              }
              // suffix={<div>111</div>}
            />
          </Form.Item>
          {getPassWordUnsafeText()}
          <Form.Item className="authing-g2-sumbit-form submit-form">
            <SubmitButton
              className="reset-password-button"
              text={t('login.resetPassword.reset') as string}
              ref={submitBtnRef}
            />
          </Form.Item>
        </Form>
      </div>
      <div className="g2-tips-line">
        <div
          className="link-like back-to-login"
          onClick={() => setControlShow(true)}
        >
          {t('login.resetPassword.back')}
        </div>
      </div>
    </div>
  )
}
