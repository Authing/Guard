import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { Form, message } from 'shim-antd'

import { ImagePro } from '../../ImagePro'

import { useGuardAuthClient } from '../../Guard/authClient'

import {
  useGuardFinallyConfig,
  useGuardInitData,
  useGuardPublicConfig
} from '../../_utils/context'
import { IconFont } from '../../IconFont'
import SubmitButton from '../../SubmitButton'
import { getGuardHttp } from '../../_utils/guardHttp'
import { usePasswordErrorText } from '../../_utils/useErrorText'
import { ApiCode } from '../../_utils/responseManagement/interface'
import { useGuardView } from '../../Guard/core/hooks/useGuardView'
import { InputPasswordForget } from '../../ForgetPassword/InputPassword'

const { useRef } = React
export const GuardResetPassword = () => {
  const { t } = useTranslation()

  const initData = useGuardInitData<any>()

  const publicConfig = useGuardPublicConfig()

  const authClient = useGuardAuthClient()

  const config = useGuardFinallyConfig()

  useGuardView()

  const logo = publicConfig?.resetPwdCustomLogo || config?.logo
  /**
   * initData
   */
  const { account, userId, goBack, rule = [], token } = initData
  const { getPassWordUnsafeText, setPasswordErrorTextShow } =
    usePasswordErrorText()

  let [form] = Form.useForm()
  const { post } = getGuardHttp()
  let submitBtnRef = useRef<any>(null)
  const onFinish = async () => {
    submitBtnRef.current?.onSpin(true)
    // 重置密码
    let data = form.getFieldsValue()
    const newPassword = await authClient.options?.encryptFunction?.(
      data.password,
      publicConfig.publicKey
    )
    // const repeatPassword = await authClient.options?.encryptFunction?.(
    //   data.repeatPassword,
    //   publicConfig.publicKey
    // )
    const checkRes = await post('/api/v2/password/user-action/check', {
      userId,
      password: newPassword
    })
    if (checkRes.code === 200 && checkRes?.data?.valid) {
      let res = post('/api/v2/users/password/forget/link-reset-password', {
        token,
        newPassword
      })

      res
        .then((r: any) => {
          submitBtnRef.current?.onSpin(false)
          const { code } = r
          if (code === ApiCode.UNSAFE_PASSWORD_TIP) {
            setPasswordErrorTextShow(true)
          }
          if (code !== 200) {
            // events?.onPwdResetError?.(r, authClient)
            message.error(r?.message)
            return
          }
          // events?.onPwdReset?.(authClient)

          // props.onSend(codeMethod)
        })
        .catch(e => {
          submitBtnRef.current.onError()
          // props.onSendError(codeMethod, e)
          // events?.onPwdResetError?.(e, authClient)
          message.error(e.message)
          return
        })
    } else {
      submitBtnRef.current?.onSpin(false)
      message.error(checkRes?.message)
      return
    }
  }

  return (
    <div className="g2-view-container g2-forget-password g2-password-reset-pageWrap g2-password-reset-step2">
      <div className="g2-view-header">
        <ImagePro
          src={logo!}
          size={48}
          borderRadius={4}
          alt=""
          className="icon"
        />
        <div className="title">{t('login.resetPwd')}</div>
        <div className="title-explain">
          {t('login.resetPassword.resetPasswordText2', {
            account
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
            rules={rule}
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
      {goBack && (
        <div className="g2-tips-line">
          <div className="link-like back-to-login" onClick={goBack}>
            {t('login.resetPassword.back')}
          </div>
        </div>
      )}
    </div>
  )
}
