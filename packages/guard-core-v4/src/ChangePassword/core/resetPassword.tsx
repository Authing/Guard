import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { Form, message } from 'shim-antd'

import { ImagePro } from '../../ImagePro'

import { useGuardAuthClient } from '../../Guard/authClient'

import {
  useGuardFinallyConfig,
  useGuardInitData,
  useGuardModule,
  useGuardPublicConfig
} from '../../_utils/context'
import { IconFont } from '../../IconFont'
import SubmitButton from '../../SubmitButton'
import { getGuardHttp } from '../../_utils/guardHttp'
import { usePasswordErrorText } from '../../_utils/useErrorText'
import { ApiCode } from '../../_utils/responseManagement/interface'
import { useGuardView } from '../../Guard/core/hooks/useGuardView'
import { InputPasswordForget } from '../../ForgetPassword/InputPassword'
import { GuardModuleType } from '../../Guard'
import { CheckRules } from '../../ValidatorRules/CheckRules'
import { i18n } from '../../_utils'

const { useRef, useMemo } = React
export const GuardResetPassword = () => {
  const { t } = useTranslation()

  const initData = useGuardInitData<any>()

  const publicConfig = useGuardPublicConfig()

  const authClient = useGuardAuthClient()

  const [ruleResults, setRuleResults] = React.useState<any>([])

  const config = useGuardFinallyConfig()

  const { changeModule } = useGuardModule()

  useGuardView()

  const resolvedLanguage = i18n.resolvedLanguage ?? i18n.language

  const logo = publicConfig?.resetPwdLinkCustomLogo || config?.logo
  /**
   * initData
   */
  const { account, userId, goBack, token } = initData
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

        changeModule?.(GuardModuleType.LOGIN)
        // props.onSend(codeMethod)
      })
      .catch(e => {
        submitBtnRef.current.onError()
        // props.onSendError(codeMethod, e)
        // events?.onPwdResetError?.(e, authClient)
        message.error(e.message)
        return
      })
  }

  const title = useMemo(() => {
    const text = publicConfig?.resetPwdLinkTipsConfig?.title
    return (
      (text?.i18n?.[resolvedLanguage].enabled
        ? text?.i18n?.[resolvedLanguage]?.value
        : text?.default) ?? t('login.resetPwd')
    )
  }, [publicConfig, resolvedLanguage])

  const explain = useMemo(() => {
    const text = publicConfig?.resetPwdLinkTipsConfig?.desc
    return (
      (text?.i18n?.[resolvedLanguage].enabled
        ? text?.i18n?.[resolvedLanguage]?.value
        : text?.default) ??
      t('login.resetPassword.resetPasswordText1', {
        text: t('common.phoneOrEmail')
      })
    )
  }, [publicConfig, resolvedLanguage, t])

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
        <div className="title">{title}</div>
        <div className="title-explain">{explain}</div>
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
            className="authing-g2-input-form"
            name="password"
            validateTrigger={['onBlur']}
            rules={[
              {
                validateTrigger: 'onBlur',
                async validator(r, v) {
                  if (!v || v?.length === 0) {
                    setRuleResults([])

                    return Promise.reject(t('login.inputPwd'))
                  } else {
                    const res = await post(
                      '/api/v2/password/user-action/check',
                      {
                        password: v,
                        userId
                      }
                    )
                    if (res?.code === 200) {
                      if (res?.data?.valid) {
                        setRuleResults([])
                        return Promise.resolve(true)
                      } else {
                        setRuleResults(res?.data?.ruleResults || [])
                        return Promise.reject(res?.data?.message)
                      }
                    } else {
                      return Promise.reject(res?.message)
                    }
                  }
                }
              }
            ]}
            help={
              ruleResults.length > 0 ? (
                <CheckRules ruleResults={ruleResults} />
              ) : undefined
            }
          >
            <InputPasswordForget
              className="authing-g2-input"
              size="large"
              placeholder={t('login.resetPassword.inputNewPwd') as string}
              prefix={
                <IconFont
                  type="authing-a-lock-line1"
                  style={{ color: '#6B7280', marginBottom: 2 }}
                />
              }
            />
          </Form.Item>
          <Form.Item
            className="authing-g2-input-form"
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
                  style={{ color: '#6B7280', marginBottom: 2 }}
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
