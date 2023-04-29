import { Checkbox, Form, Typography } from 'shim-antd'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import SubmitButton from '../../SubmitButton'

import { useGuardIsAuthFlow } from '../../_utils/context'

import { authFlow, TotpRecoveryCodeBusinessAction } from '../businessRequest'

const { Paragraph } = Typography

const { useRef } = React

export const SaveCode: React.FC<{
  secret: string
  onBind: any
}> = props => {
  const { secret, onBind } = props

  const { t } = useTranslation()

  const [form] = Form.useForm()

  const isAuthFlow = useGuardIsAuthFlow()

  const submitButtonRef = useRef<any>(null)

  const bindSuccess = async () => {
    submitButtonRef.current?.onSpin(true)

    if (isAuthFlow) {
      const { isFlowEnd, data, onGuardHandling } = await authFlow(
        TotpRecoveryCodeBusinessAction.ConfirmTotpRecoveryCode,
        {}
      )

      submitButtonRef.current?.onSpin(false)
      if (isFlowEnd) {
        onBind(data)
      } else {
        submitButtonRef.current?.onError()
        onGuardHandling?.()
      }
    } else {
      try {
        await form.validateFields()
        onBind()
      } catch (e: any) {
        submitButtonRef.current?.onError()
      } finally {
        submitButtonRef.current?.onSpin(false)
      }
    }
  }

  return (
    <>
      <p className="authing-g2-mfa-title">{t('common.useRecoverCode')}</p>
      <p className="authing-g2-mfa-tips">{t('common.totpGenerateCode')}</p>

      <div className="g2-mfa-bindTotp-copySecret">
        <Paragraph copyable>{secret}</Paragraph>
      </div>

      <Form
        form={form}
        onFinish={bindSuccess}
        style={{ width: '100%' }}
        onFinishFailed={() => submitButtonRef.current?.onError()}
      >
        <Form.Item
          className="authing-g2-input-form g2-mfa-totp-recoveryCode-input"
          name="remember"
          rules={[
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.reject(t('common.pleaseRecordKey'))
                }
                return Promise.resolve()
              }
            }
          ]}
          valuePropName="checked"
        >
          <Checkbox className="g2-mfa-bindTotp-secretSave">
            {t('login.rememberedSecret')}
          </Checkbox>
        </Form.Item>

        <SubmitButton
          text={t('common.confirm') as string}
          ref={submitButtonRef}
        />
      </Form>
    </>
  )
}
