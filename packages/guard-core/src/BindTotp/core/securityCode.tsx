import { Form } from 'shim-antd'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { useAsyncFn } from 'react-use'

import { GuardModuleType } from '../../Guard/module'

import { useGuardHttp } from '../../_utils/guardHttp'

import SubmitButton from '../../SubmitButton'

import { ImagePro } from '../../ImagePro'

import { VerifyCodeFormItem } from '../../MFA/VerifyCodeInput/VerifyCodeFormItem'

import { VerifyCodeInput } from '../../MFA/VerifyCodeInput'

import { useGuardIsAuthFlow, useGuardPublicConfig } from '../../_utils/context'

import { authFlow, BindTotpBusinessAction } from '../businessRequest'

const { useRef, useState } = React

export interface SecurityCodeProps {
  mfaToken: string
  qrcode: string
  onNext: any
  changeModule: any
}

export const SecurityCode: React.FC<SecurityCodeProps> = ({
  mfaToken,
  qrcode,
  onNext,
  changeModule
}) => {
  const [form] = Form.useForm()
  const submitButtonRef = useRef<any>(null)

  const { t } = useTranslation()

  const { post } = useGuardHttp()

  const isAuthFlow = useGuardIsAuthFlow()

  const publicConfig = useGuardPublicConfig()

  const onJump = () => {
    changeModule?.(GuardModuleType.DOWNLOAD_AT)
  }

  const [, bindTotp] = useAsyncFn(async () => {
    submitButtonRef.current?.onSpin(true)

    await form.validateFields()
    const saftyCode = form.getFieldValue('saftyCode')

    if (isAuthFlow) {
      // 这里绑定成功过返回的是 statusCode
      const { statusCode, onGuardHandling } = await authFlow(
        BindTotpBusinessAction.VerifyTotpFirstTime,
        {
          totp: saftyCode.join('')
        }
      )
      submitButtonRef.current?.onSpin(false)

      if (statusCode === 200) {
        onNext()
      } else {
        submitButtonRef.current?.onError()
        onGuardHandling?.()
      }
    } else {
      const { code, data, onGuardHandling } = await post(
        '/api/v2/mfa/totp/associate/confirm',
        {
          authenticator_type: 'totp',
          totp: saftyCode.join(''),
          source: 'APPLICATION'
        },
        {
          headers: {
            authorization: mfaToken
          }
        }
      )
      submitButtonRef.current?.onSpin(false)

      if (code === 200) {
        onNext(data)
      } else {
        submitButtonRef.current?.onError()
        onGuardHandling?.()
      }
    }
  }, [mfaToken])

  const [btnDisabled, setDisabled] = useState(true)

  const onValuesChange = (value: { saftyCode: string[] }) => {
    const res =
      Array.isArray(value.saftyCode) &&
      value.saftyCode.length === publicConfig.verifyCodeLength &&
      value.saftyCode.every(item => !!item)
    setDisabled(!res)
  }

  return (
    <>
      <p className="authing-g2-mfa-title">{t('user.mfaBind')}</p>
      <p
        className="authing-g2-mfa-tips"
        style={{
          textAlign: 'left'
        }}
      >
        {t('common.usePhoneOpen')}（{t('common.noValidator')}{' '}
        <span
          style={{
            color: '#215AE5',
            cursor: 'pointer'
          }}
          onClick={onJump}
        >
          {t('common.clickTodownload')}
        </span>
        ） {t('common.mfaText1')}
      </p>
      <ImagePro className="g2-mfa-bindTotp-qrcode" src={qrcode} alt="qrcode" />
      <Form
        className="g2-mfa-bindTotp-securityCode-form"
        form={form}
        onSubmitCapture={() => {}}
        onFinish={bindTotp}
        onFinishFailed={() => {
          submitButtonRef.current.onError()
        }}
        onValuesChange={onValuesChange}
      >
        <VerifyCodeFormItem
          codeLength={6}
          name="saftyCode"
          ruleKeyword={t('user.numberSafteyCode') as string}
        >
          <VerifyCodeInput
            length={6}
            showDivider={false}
            gutter={'1px'}
            onFinish={bindTotp}
          />
        </VerifyCodeFormItem>

        <SubmitButton
          disabled={btnDisabled}
          text={t('user.nextStep') as string}
          ref={submitButtonRef}
          className="g2-mfa-submit-button-new"
        />
      </Form>
    </>
  )
}
