import { React } from 'shim-react'
import { BackCustom } from '../../Back'
import { useTranslation } from 'react-i18next'
import { Form, Input } from 'shim-antd'
import SubmitButton from '../../SubmitButton'
import { CreateTenantProps } from '../interface'
import '../styles.less'
import { TenantBusinessAction, authFlow } from '../businessRequest'
import { useGuardEvents } from '../../_utils'
import { useGuardAuthClient } from '../../Guard/authClient'

const { useMemo, useRef } = React

export const CreateTenantView: React.FC<CreateTenantProps> = ({ onBack }) => {
  const { t } = useTranslation()
  const events = useGuardEvents()
  const authClient = useGuardAuthClient()

  const [form] = Form.useForm()
  const submitButtonRef = useRef<any>(null)

  const handleCreate = async () => {
    const values = form.getFieldsValue()
    const { isFlowEnd, data, onGuardHandling } = await authFlow(
      TenantBusinessAction.CreateTenant,
      { ...values }
    )
    if (isFlowEnd) {
      events?.onLogin?.(data, authClient)
    } else {
      onGuardHandling?.()
    }
  }

  const renderBack = useMemo(() => {
    return <BackCustom onBack={onBack}>{t('common.back')}</BackCustom>
  }, [t])

  return (
    <div className="g2-view-container g2-view-join">
      {renderBack}
      <div className="g2-join-content">
        <p className="authing-g2-join-title">{t('common.createTenant')}</p>
        <Form
          layout="vertical"
          form={form}
          onFinish={handleCreate}
          style={{ width: '100%' }}
          onFinishFailed={() => submitButtonRef.current?.onError()}
        >
          <Form.Item
            className="authing-g2-input-form"
            name="name"
            label={t('common.tenantName') as string}
            required
            rules={[{ required: true }]}
          >
            <Input
              className="authing-g2-input"
              autoComplete="off"
              size="large"
              placeholder={t('common.pleaseInput') as string}
            />
          </Form.Item>
          <Form.Item
            className="authing-g2-input-form"
            name="enterpriseDomains"
            label={t('common.tenantEmail')}
          >
            <Input
              className="authing-g2-input-group"
              autoComplete="off"
              size="large"
              placeholder={t('common.pleaseInput') as string}
              addonBefore="@"
            />
          </Form.Item>
          <Form.Item
            className="authing-g2-input-form"
            name="description"
            label={t('common.tenantDesc')}
          >
            <Input.TextArea
              className="authing-g2-input"
              autoComplete="off"
              size="large"
              placeholder={t('common.pleaseInput') as string}
            />
          </Form.Item>

          <SubmitButton
            text={t('common.sure') as string}
            ref={submitButtonRef}
            className="authing-g2-join-button"
          />
        </Form>
      </div>
    </div>
  )
}
