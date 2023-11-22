import { Form } from 'shim-antd'

// import '@antd-lib-style/form/style/index.less'

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

import { useGuardInitData } from '../../_utils/context'

import { GuardButton } from '../../GuardButton'

const { useRef } = React

export interface BindMFATotpProps {
  initData: GuardMFAInitData
  changeModule: any
}

export const BindMFATotp: React.FC<BindMFATotpProps> = ({
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
        text={t('common.sure') as string}
        onClick={next}
        className="g2-mfa-submit-button bind-totp"
      />
    </>
  )
}

export interface VerifyMFATotpProps {
  mfaToken: string
  mfaLogin: any
  changeModule: any
}

export const VerifyMFATotp: React.FC<VerifyMFATotpProps> = ({
  mfaToken,
  mfaLogin,
  changeModule
}) => {
  const { t } = useTranslation()

  const [form] = Form.useForm()

  const submitButtonRef = useRef<any>(null)

  const initData = useGuardInitData<GuardMFAInitData>()

  const businessRequest = useMfaBusinessRequest()[MfaBusinessAction.VerifyTotp]

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
      <p className="authing-g2-mfa-tips">{t('login.inputSixCode')}</p>
      <Form
        form={form}
        onSubmitCapture={() => {}}
        onFinish={onFinish}
        onFinishFailed={() => submitButtonRef.current.onError()}
      >
        <VerifyCodeFormItem codeLength={6}>
          <VerifyCodeInput
            length={6}
            showDivider={false}
            gutter={'10px'}
            onFinish={onFinish}
          />
        </VerifyCodeFormItem>

        <SubmitButton text={t('common.sure') as string} ref={submitButtonRef} />
        <p className="authing-g2-mfa-totp-recoveryCode">
          {t('common.hasLooseSaftyCode')}
          <GuardButton
            type="link"
            onClick={() => {
              changeModule(GuardModuleType.RECOVERY_CODE, {
                ...initData
              })
            }}
          >
            {t('common.useRecoverCode')}
          </GuardButton>
        </p>
      </Form>
    </>
  )
}

export interface MFATotpProps {
  changeModule: any
  config: MFAConfig
  initData: GuardMFAInitData
  mfaLogin: any
}

export const MFATotp: React.FC<MFATotpProps> = ({
  changeModule,
  initData,
  mfaLogin
}) => {
  return (
    <>
      {initData.totpMfaEnabled ? (
        <VerifyMFATotp
          mfaToken={initData.mfaToken}
          mfaLogin={mfaLogin}
          changeModule={changeModule}
        />
      ) : (
        <BindMFATotp initData={initData} changeModule={changeModule} />
      )}
    </>
  )
}
