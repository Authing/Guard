import { React } from 'shim-react'
import { BackCustom } from '../../Back'
import { useTranslation } from 'react-i18next'
import { Form, Input, Modal } from 'shim-antd'
import SubmitButton from '../../SubmitButton'
import { CreateTenantProps } from '../interface'
import '../styles.less'
import { TenantBusinessAction, authFlow } from '../businessRequest'
import {
  useGuardCurrentModule,
  useGuardEvents,
  useGuardHttpClient,
  useGuardModule,
  useGuardPublicConfig
} from '../../_utils'
import { useGuardAuthClient } from '../../Guard/authClient'
import { GuardModuleType } from '../../Guard'

const { useMemo, useRef } = React

export const CreateTenantView: React.FC<CreateTenantProps> = ({ onBack }) => {
  const { t } = useTranslation()
  const events = useGuardEvents()
  const authClient = useGuardAuthClient()
  const http = useGuardHttpClient()
  const publicConfig = useGuardPublicConfig()
  const cdnBase = publicConfig?.cdnBase
  const { moduleName } = useGuardCurrentModule()
  const { changeModule } = useGuardModule()

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
      const prevBaseUrl = http.getBaseUrl()
      if (tenantInfo?.host) {
        http.setBaseUrl(tenantInfo?.host)
      }
      if (!tenantInfo?.isUserPool && tenantInfo?.tenantId) {
        http.setTenantId(tenantInfo?.tenantId)
      } else {
        http.setTenantId('') //使用前重置，防止其他环境设置污染，便于状态可控
      }

      // 创建租户成功后终止流程，弹出提示框，用户关闭提示框后返回登录界面
      if (tenantInfo?.tenantId) {
        Modal.info({
          icon: null,
          className: 'g2-tenant-modal-wrapper',
          title: t('login.createTenantModalTitle'),
          content: (
            <div>
              <p>{tenantInfo.consoleHost}</p>
              <p>{t('login.tenantSaveHint')}</p>
            </div>
          ),
          onOk() {
            http.setTenantId('')
            http.setBaseUrl(prevBaseUrl)
            changeModule?.(GuardModuleType.LOGIN)
          }
        })
      } else {
        const {
          isFlowEnd: end,
          onGuardHandling,
          data: res
        } = await http.authFlow(moduleName, null, () =>
          Modal.info({
            icon: null,
            className: 'g2-tenant-modal-wrapper',
            title: t('login.createTenantModalTitle'),
            content: (
              <div>
                <p>{tenantInfo.consoleHost}</p>
                <p>{t('login.tenantSaveHint')}</p>
              </div>
            ),
            onOk() {
              http.setTenantId('')
              http.setBaseUrl(prevBaseUrl)
              changeModule?.(GuardModuleType.LOGIN)
            }
          })
        )
        if (end) {
          setTimeout(() => events?.onLogin?.(res, authClient)) // 让选择事件先行，登录成功宏任务异步，方便异步并发
        } else {
          onGuardHandling?.()
        }
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
