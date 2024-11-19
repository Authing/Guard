import { useTranslation } from 'react-i18next'
import { useAsyncFn } from 'react-use'
import { GuardMFAInitData, MFAConfig } from '../interface'
import SubmitButton from '../../SubmitButton'
import { VerifyCodeFormItem } from '../VerifyCodeInput/VerifyCodeFormItem'
import { VerifyCodeInput } from '../VerifyCodeInput'
import { MfaBusinessAction, useMfaBusinessRequest } from '../businessRequest'
import { Form } from 'shim-antd'
import { React } from 'shim-react'
const { useRef } = React

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

  const businessRequest =
    useMfaBusinessRequest()[MfaBusinessAction.VerifyCloudEntify]

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
      <p className="authing-g2-mfa-title">{t('login.accPwdLoginVerify')}</p>
      <p className="authing-g2-mfa-tips">{t('common.cloundEntifyCodes')}</p>
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

        <SubmitButton text={t('common.sure')} ref={submitButtonRef} />
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

export const MFACloudEntify: React.FC<MFATotpProps> = ({
  changeModule,
  initData,
  mfaLogin
}) => {
  return (
    <>
      <VerifyMFATotp
        mfaToken={initData.mfaToken}
        mfaLogin={mfaLogin}
        changeModule={changeModule}
      />
    </>
  )
}
