import { React } from 'shim-react'
import { BackCustom } from '../../Back'
import { useTranslation } from 'react-i18next'
import { Form, Input } from 'shim-antd'
import SubmitButton from '../../SubmitButton'
import { CreateTenantProps } from '../interface'
import '../styles.less'
import { TenantBusinessAction, authFlow } from '../businessRequest'
import {
  useGuardAppId,
  useGuardCurrentModule,
  useGuardEvents,
  useGuardHttpClient,
  useGuardPublicConfig
} from '../../_utils'
import { useGuardAuthClient } from '../../Guard/authClient'

const { useMemo, useRef } = React

export const CreateTenantView: React.FC<CreateTenantProps> = ({ onBack }) => {
  const { t } = useTranslation()
  const events = useGuardEvents()
  const authClient = useGuardAuthClient()
  const http = useGuardHttpClient()
  const publicConfig = useGuardPublicConfig()
  const cdnBase = publicConfig?.cdnBase
  const { moduleName } = useGuardCurrentModule()
  const appId = useGuardAppId()

  const [form] = Form.useForm()
  const submitButtonRef = useRef<any>(null)

  const handleCreate = async () => {
    const values = form.getFieldsValue()
    const { isFlowEnd, data, onGuardHandling, apiCode } = await authFlow(
      TenantBusinessAction.CreateTenant,
      { ...values, logo: `${cdnBase}/tenant-default-logo.svg` }
    )
    if (isFlowEnd) {
      setTimeout(() => {
        events?.onLogin?.(data, authClient)
      })
    } else if (apiCode === 1708) {
      // 需要重新认证
      const tenantInfo = { ...data }
      events?.onTenantSelect?.(tenantInfo)
      if (tenantInfo?.host && appId !== publicConfig.defaultAppId) {
        http.setBaseUrl(tenantInfo?.host)
      } else {
        http.setBaseUrl(window.location.origin)
      }
      if (!tenantInfo?.isUserPool && tenantInfo?.tenantId) {
        http.setTenantId(tenantInfo?.tenantId)
      } else {
        http.setTenantId('') //使用前重置，防止其他环境设置污染，便于状态可控
      }
      // 调用加入接口
      const {
        isFlowEnd: end,
        onGuardHandling,
        data: res
      } = await http.authFlow(moduleName)
      if (end) {
        setTimeout(() => events?.onLogin?.(res, authClient)) // 让选择事件先行，登录成功宏任务异步，方便异步并发
      } else {
        onGuardHandling?.()
      }
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
