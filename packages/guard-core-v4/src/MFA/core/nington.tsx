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

export interface BindNingtonMFATotpProps {
  initData: GuardMFAInitData
  changeModule: any
}

export const BindNingtonMFATotp: React.FC<BindNingtonMFATotpProps> = ({
  changeModule,
  initData
}) => {
  const { t } = useTranslation()

  const next = () => changeModule(GuardModuleType.BIND_TOTP, initData)
  return (
    <>
      <p className="authing-g2-mfa-title">{t('common.mfaCertification')}</p>
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

export interface VerifyNingtonMFATotpProps {
  mfaToken: string
  mfaLogin: any
}

export const VerifyNingtonMFATotp: React.FC<VerifyNingtonMFATotpProps> = ({
  mfaToken,
  mfaLogin
}) => {
  const { t } = useTranslation()

  const [form] = Form.useForm()

  const submitButtonRef = useRef<any>(null)

  const businessRequest =
    useMfaBusinessRequest()[MfaBusinessAction.VerifyNington]

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
      <p className="authing-g2-mfa-title">{t('common.mfaCertification')}</p>
      <p className="authing-g2-mfa-tips">{t('common.ningTonInputCode')}</p>
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

export interface NingtonMFATotpProps {
  changeModule: any
  config: MFAConfig
  initData: GuardMFAInitData
  mfaLogin: any
}

export const NingtonMFATotp: React.FC<NingtonMFATotpProps> = ({
  changeModule,
  initData,
  mfaLogin
}) => {
  return (
    <>
      {initData.ningTonMfaEnable ? (
        <VerifyNingtonMFATotp
          mfaToken={initData.mfaToken}
          mfaLogin={mfaLogin}
        />
      ) : (
        <BindNingtonMFATotp initData={initData} changeModule={changeModule} />
      )}
    </>
  )
}
