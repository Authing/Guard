import { Form } from 'shim-antd'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { useAsyncFn } from 'react-use'

import { GuardModuleType } from '../../Guard/module'

import { GuardMFAInitData, MFAConfig } from '../interface'

import SubmitButton from '../../SubmitButton'

import { VerifyCodeFormItem } from '../VerifyCodeInput/VerifyCodeFormItem'

import { VerifyCodeInput } from '../VerifyCodeInput'

import { IconFont } from '../../IconFont'

import { MfaBusinessAction, useMfaBusinessRequest } from '../businessRequest'

const { useRef } = React

export interface BindNingdonMFATotpProps {
  initData: GuardMFAInitData
  changeModule: any
}

export const BindNingdonMFATotp: React.FC<BindNingdonMFATotpProps> = ({
  changeModule,
  initData
}) => {
  const { t } = useTranslation()

  const next = () => changeModule(GuardModuleType.BIND_TOTP, initData)
  return (
    <>
      <p className="authing-g2-mfa-title">
        {t('common.ningDonMfaCertification')}
      </p>
      <p className="authing-g2-mfa-tips">{t('common.otpText1')}</p>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <IconFont type="authing-otp" style={{ width: 247, height: 131 }} />
      </div>
      <SubmitButton
        style={{
          display: 'none' //暂时占位隐藏
        }}
        text={t('common.sure') as string}
        onClick={next}
        className="g2-mfa-submit-button bind-totp"
      />
    </>
  )
}

export interface VerifyNingdonMFATotpProps {
  mfaToken: string
  mfaLogin: any
}

export const VerifyNingdonMFATotp: React.FC<VerifyNingdonMFATotpProps> = ({
  mfaToken,
  mfaLogin
}) => {
  const { t } = useTranslation()

  const [form] = Form.useForm()

  const submitButtonRef = useRef<any>(null)

  const businessRequest =
    useMfaBusinessRequest()[MfaBusinessAction.VerifyNingdon]

  const [, onFinish] = useAsyncFn(async () => {
    submitButtonRef.current?.onSpin(true)

    const mfaCode = form.getFieldValue('mfaCode')

    const requestData = {
      totp: mfaCode.join(''),
      mfaToken
    }

    const { isFlowEnd, data, onGuardHandling } = await businessRequest(
      requestData
    )

    submitButtonRef.current?.onSpin(false)

    if (isFlowEnd) {
      mfaLogin(200, data)
    } else {
      submitButtonRef.current.onError()

      onGuardHandling?.()
    }
  }, [mfaToken])

  return (
    <>
      <p className="authing-g2-mfa-title">
        {t('common.ningDonMfaCertification')}
      </p>
      <p className="authing-g2-mfa-tips">{t('login.inputFourCode')}</p>
      <Form
        form={form}
        onSubmitCapture={() => {}}
        onFinish={onFinish}
        onFinishFailed={() => submitButtonRef.current.onError()}
      >
        <VerifyCodeFormItem codeLength={4}>
          <VerifyCodeInput
            length={4}
            showDivider={false}
            gutter={'10px'}
            onFinish={onFinish}
          />
        </VerifyCodeFormItem>

        <SubmitButton text={t('common.sure') as string} ref={submitButtonRef} />
      </Form>
    </>
  )
}

export interface NingdonMFATotpProps {
  changeModule: any
  config: MFAConfig
  initData: GuardMFAInitData
  mfaLogin: any
}

export const NingdonMFATotp: React.FC<NingdonMFATotpProps> = ({
  changeModule,
  initData,
  mfaLogin
}) => {
  return (
    <>
      {initData.ningDonMfaEnable ? (
        <VerifyNingdonMFATotp
          mfaToken={initData.mfaToken}
          mfaLogin={mfaLogin}
        />
      ) : (
        <BindNingdonMFATotp initData={initData} changeModule={changeModule} />
      )}
    </>
  )
}
