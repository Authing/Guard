import { React } from 'shim-react'
import { BackCustom } from '../../src/Back'
import { useTranslation } from 'react-i18next'
import './styles.less'
import { Form, Input } from 'shim-antd'
import { IconFont } from '../IconFont'
import SubmitButton from '../SubmitButton'
import { Props } from './interface'

const { useMemo, useState, useRef } = React

export const JoinTenantView: React.FC<Props> = ({ onBack }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const submitButtonRef = useRef<any>(null)

  const handleJoin = () => {}

  const renderBack = useMemo(() => {
    return <BackCustom onBack={onBack}>{t('common.back')}</BackCustom>
  }, [t])

  return (
    <div className="g2-view-container g2-view-join">
      {renderBack}
      <div className="g2-join-content">
        <p className="authing-g2-join-title">{t('common.joinTenant')}</p>
        <Form
          form={form}
          onFinish={handleJoin}
          style={{ width: '100%' }}
          onFinishFailed={() => submitButtonRef.current?.onError()}
        >
          <Form.Item className="authing-g2-input-form" name="code" required>
            <Input
              className="authing-g2-input"
              autoComplete="off"
              size="large"
              placeholder={t('common.tenantExample') as string}
              prefix={
                <IconFont
                  type="authing-account-circle-line"
                  style={{ color: '#878A95' }}
                />
              }
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
