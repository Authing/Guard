import { Input, message, message as Message, Form } from 'shim-antd'

// import '@antd-lib-style/message/style/index.less'

// import '@antd-lib-style/input/style/index.less'

// import '@antd-lib-style/form/style/index.less'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { VerifyCodeInput } from '../VerifyCodeInput'

import { SendCodeBtn } from '../../SendCode/SendCodeBtn'

import SubmitButton from '../../SubmitButton'

import CustomFormItem from '../../ValidatorRules'

import { MFAConfig } from '../interface'

import { VerifyCodeFormItem } from '../VerifyCodeInput/VerifyCodeFormItem'

import { IconFont } from '../../IconFont'

import { mailDesensitization } from '../../_utils'

import { useGuardPublicConfig } from '../../_utils/context'

import { MfaBusinessAction, useMfaBusinessRequest } from '../businessRequest'

import { EmailScene } from '../../Type'

import { getGuardHttp } from '../../_utils/guardHttp'

const { useRef, useState } = React

interface BindMFAEmailProps {
  mfaToken: string
  onBind: (email: string) => void
  config: any
}

export const BindMFAEmail: React.FC<BindMFAEmailProps> = ({
  mfaToken,
  onBind,
  config
}) => {
  const submitButtonRef = useRef<any>(null)

  const { t } = useTranslation()

  const [form] = Form.useForm()

  const onFinish = async ({ email }: any) => {
    await form.validateFields()
    submitButtonRef.current?.onSpin(false)
    try {
      onBind(email)
    } catch (e: any) {
      const error = JSON.parse(e?.message)
      submitButtonRef.current.onError()
      Message.error(error.message)
    }
  }
  return (
    <>
      <p className="authing-g2-mfa-title">{t('common.mfaCertification')}</p>
      <p className="authing-g2-mfa-tips">{t('common.bindEmailDoc')}</p>
      <Form
        form={form}
        onSubmitCapture={() => submitButtonRef.current.onSpin(true)}
        onFinish={onFinish}
        onFinishFailed={() => submitButtonRef.current.onError()}
      >
        <CustomFormItem.Email
          className="authing-g2-input-form"
          name="email"
          form={form}
          // checkRepeat={true}
          required={true}
        >
          <Input
            className="authing-g2-input"
            autoComplete="off"
            size="large"
            placeholder={t('login.inputEmail') as string}
            prefix={
              <IconFont
                type="authing-a-mail-line3"
                style={{ color: '#878A95' }}
              />
            }
          />
        </CustomFormItem.Email>

        <SubmitButton text={t('common.sure') as string} ref={submitButtonRef} />
      </Form>
    </>
  )
}

interface VerifyMFAEmailProps {
  email: string
  mfaToken: string
  onVerify: (code: number, data: any) => void
  sendCodeRef: React.RefObject<HTMLButtonElement>
  codeLength: number
}

export const VerifyMFAEmail: React.FC<VerifyMFAEmailProps> = ({
  email,
  mfaToken,
  onVerify,
  sendCodeRef,
  codeLength
}) => {
  const { post } = getGuardHttp()
  const businessRequest = useMfaBusinessRequest()[MfaBusinessAction.VerifyEmail]

  const submitButtonRef = useRef<any>(null)

  const { t } = useTranslation()

  const [form] = Form.useForm()

  const [sent, setSent] = useState(false)

  const sendVerifyCode = async () => {
    try {
      const {
        code,
        message: tips,
        apiCode
      } = await post('/api/v2/email/send', {
        email,
        scene: EmailScene.MFA_VERIFY_CODE
      })
      if (apiCode === 2080) {
        // 一分钟只能发一次邮箱验证码的提示信息，特殊处理
        message.error(tips)
        return false
      }
      if (code === 200) {
        setSent(true)
        return true
      } else {
        message.error(t('login.sendCodeTimeout'))
        return false
      }
      // await authClient.sendEmail(email!, EmailScene.MFA_VERIFY_CODE)
      // setSent(true)
      // return true
    } catch (e: any) {
      if (e.code === 'ECONNABORTED') {
        message.error(t('login.sendCodeTimeout'))
        return false
      }
      const errorMessage = JSON.parse(e.message)
      message.error(errorMessage.message)
      return false
    }
  }

  const onFinish = async (values: any) => {
    submitButtonRef.current?.onSpin(true)
    const mfaCode = form.getFieldValue('mfaCode')

    const requestData = {
      mfaToken,
      email: email!,
      code: mfaCode.join('')
    }

    const { isFlowEnd, data, onGuardHandling } = await businessRequest(
      requestData
    )

    submitButtonRef.current?.onSpin(false)

    if (isFlowEnd) {
      onVerify(200, data)
    } else {
      submitButtonRef.current?.onError()
      onGuardHandling?.()
    }
  }

  return (
    <>
      <p className="authing-g2-mfa-title">{t('common.mfaCertification')}</p>
      <p className="authing-g2-mfa-tips">
        {sent
          ? `${t('login.verifyCodeSended')} ${mailDesensitization(email)}`
          : t('common.emailMfaCheck')}
      </p>
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={() => submitButtonRef.current?.onError()}
      >
        <VerifyCodeFormItem
          codeLength={codeLength}
          ruleKeyword={t('common.captchaCode') as string}
        >
          <VerifyCodeInput length={codeLength} onFinish={onFinish} />
        </VerifyCodeFormItem>

        <SendCodeBtn
          btnRef={sendCodeRef}
          setSent={setSent}
          beforeSend={() => sendVerifyCode()}
          type="link"
        />

        <SubmitButton
          text={t('common.sure') as string}
          ref={submitButtonRef}
          className="g2-mfa-submit-button"
        />
      </Form>
    </>
  )
}

export const MFAEmail: React.FC<{
  mfaToken: string
  email?: string
  mfaLogin: any
  config: MFAConfig
}> = ({ email: userEmail, mfaToken, mfaLogin, config }) => {
  const [email, setEmail] = useState(userEmail)
  const sendCodeRef = useRef<HTMLButtonElement>(null)

  const publicConfig = useGuardPublicConfig()

  const codeLength = publicConfig?.verifyCodeLength

  return (
    <>
      {email ? (
        <VerifyMFAEmail
          mfaToken={mfaToken}
          email={email}
          onVerify={(code, data) => {
            mfaLogin(code, data)
          }}
          sendCodeRef={sendCodeRef}
          codeLength={codeLength ?? 4}
        />
      ) : (
        <BindMFAEmail
          config={config}
          mfaToken={mfaToken}
          onBind={(email: string) => {
            setEmail(email)
            sendCodeRef.current?.click()
          }}
        />
      )}
    </>
  )
}
