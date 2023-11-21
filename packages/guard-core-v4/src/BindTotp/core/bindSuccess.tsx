import { Form, Checkbox, Typography } from 'shim-antd'

import '@antd-es-style/form/style/index.less'

import '@antd-es-style/checkbox/style/index.less'

import '@antd-es-style/typography/style/index.less'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import SubmitButton from '../../SubmitButton'

import { useGuardIsAuthFlow } from '../../_utils/context'

import { authFlow, BindTotpBusinessAction } from '../businessRequest'

const { useRef } = React

const { Paragraph } = Typography

export interface BindSuccessProps {
  onBind: any
  secret: string
}

export const BindSuccess: React.FC<BindSuccessProps> = ({ secret, onBind }) => {
  // const [isSaved, setIsSaved] = useState(false)
  const submitButtonRef = useRef<any>(null)

  const [form] = Form.useForm()

  const { t } = useTranslation()

  const isAuthFlow = useGuardIsAuthFlow()

  const bindSuccess = async () => {
    submitButtonRef.current?.onSpin(true)

    await form.validateFields()

    if (isAuthFlow) {
      const { data, isFlowEnd, onGuardHandling } = await authFlow(
        BindTotpBusinessAction.ConfirmTotpRecoveryCode,
        {}
      )
      submitButtonRef.current?.onSpin(false)
      if (isFlowEnd) {
        onBind(data)
      } else {
        // TODO 需要 onError 抖动吗 当 from 表单校验通过的时候 onError 是没有意义的
        submitButtonRef.current?.onError()
        onGuardHandling?.()
      }
    } else {
      submitButtonRef.current?.onSpin(false)
      onBind()
    }
  }

  return (
    <>
      <p className="authing-g2-mfa-title">{t('common.totpText1')}</p>
      <p className="authing-g2-mfa-tips">{t('common.totpText2')}</p>

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
          className="authing-g2-input-form g2-mfa-totp-verify-input"
          name="remember"
          rules={[
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.reject()
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
          text={t('common.bindSuccess') as string}
          ref={submitButtonRef}
        />
      </Form>
    </>
  )
}
