import { React } from 'shim-react'
import { BackCustom } from '../../Back'
import { useTranslation } from 'react-i18next'
import { Form, Input, message } from 'shim-antd'
import { IconFont } from '../../IconFont'
import SubmitButton from '../../SubmitButton'
import { JoinTenantStepEnum, JoinTenantProps } from '../interface'
import {
  getGuardHttp,
  mailDesensitization,
  useGuardHttp,
  useGuardPublicConfig
} from '../../_utils'
import { InputEmailCode } from '../InputEmailCode'
import '../styles.less'

const { useMemo, useState, useRef, useCallback } = React

export const JoinTenantView: React.FC<JoinTenantProps> = ({ onBack }) => {
  const { t } = useTranslation()
  const { post, get } = useGuardHttp()
  const config = useGuardPublicConfig()
  const { authFlow } = getGuardHttp()
  const [tenantInfo, setTenantInfo] = useState<any>(null)
  const [currStepKey, setCurrStepKey] = useState<JoinTenantStepEnum>(
    JoinTenantStepEnum.InputTenantCode
  )
  // const [verifyCode, setVerifyCode] = useState<string[]>([])
  // const sendCodeBtnRef = useRef<HTMLButtonElement>(null)
  const [form] = Form.useForm()
  const submitButtonRef = useRef<any>(null)
  const [sent, setSent] = useState(false)
  const [enterpriseEmail, setEnterpriseEmail] = useState('')

  const handelJoinTenant = async (tenantId: string, passCode?: string) => {
    try {
      const { isFlowEnd, message: tips } = await authFlow(
        'join-tenant-portal',
        {
          tenantId,
          email: enterpriseEmail || undefined,
          passCode
        }
      )
      if (isFlowEnd) {
      } else {
        message.error(tips)
      }
    } catch (e: any) {
      if (e?.message) {
        // message.error(e?.message)
      }
    }
  }

  const handleJoinClick = useCallback(async () => {
    try {
      const { data } = await get('/api/v3/get-tenant-public-info-by-code', {
        ...form.getFieldsValue()
      })
      setTenantInfo(data)

      if (data) {
        if (config.enableVerifyDomainInJoinTenant) {
          if (data.enterpriseDomains?.length) {
            // 输入企业邮箱
            setCurrStepKey(JoinTenantStepEnum.InputEnterpriseEmail)
          } else {
            // 当前组织管理员未设置企业邮箱域名，请联系管理员设置后加入组织。
            setCurrStepKey(JoinTenantStepEnum.NoEnterpriseDomain)
          }
        } else {
          await handelJoinTenant(data.tenantId)
        }
      }
    } catch (error) {
      message.error('识别码错误，请重新输入')
    }
  }, [])

  const steps = useMemo(
    () => [
      {
        key: JoinTenantStepEnum.InputTenantCode,
        title: t('common.joinTenant'),
        okBtnText: t('common.sure'),
        formFields: [
          {
            type: 'text',
            placeholder: t('common.tenantExample'),
            name: 'code',
            rules: [
              {
                required: true
              }
            ],
            prefix: (
              <IconFont
                type="authing-account-circle-line"
                style={{ color: '#878A95' }}
              />
            ),
            inputClassName: 'authing-g2-input'
          }
        ],
        onNext: () => {
          handleJoinClick()
        },
        onPrevOrCancel() {
          onBack()
        }
      },
      {
        key: JoinTenantStepEnum.InputEnterpriseEmail,
        title: '验证企业邮箱',
        okBtnText: '验证',
        formFields: [
          {
            type: 'text',
            placeholder: '请输入企业邮箱',
            name: 'email',
            rules: [
              {
                required: true
              }
            ],
            addonAfter: `@${tenantInfo?.enterpriseDomains?.[0]}`,
            inputClassName: 'authing-g2-input-group'
          }
        ],
        onNext: () => {
          setCurrStepKey(JoinTenantStepEnum.VerifyEmailCode)
          setEnterpriseEmail(
            `${form.getFieldValue('email')}@${tenantInfo
              ?.enterpriseDomains?.[0]}`
          )
        },
        onPrevOrCancel() {
          setCurrStepKey(JoinTenantStepEnum.InputTenantCode)
        }
      },
      {
        key: JoinTenantStepEnum.NoEnterpriseDomain,
        title: t('common.joinTenant'),
        okBtnText: t('common.sure'),
        onNext: () => {},
        onPrevOrCancel() {}
      },
      {
        key: JoinTenantStepEnum.VerifyEmailCode,
        title: '请输入验证码',
        description: sent
          ? `${t('login.verifyCodeSended')} ${mailDesensitization(
              enterpriseEmail
            )}`
          : t('common.emailMfaCheck'),
        okBtnText: t('common.sure'),
        formFields: [
          {
            type: 'custom',
            customComponent: (
              <InputEmailCode
                email={enterpriseEmail}
                setSent={setSent}
                onFinish={() => {
                  handelJoinTenant(
                    tenantInfo.tenantId,
                    form.getFieldValue('emailCode')?.join('')
                  )
                }}
              />
            ),
            noStyle: true
          }
        ],
        hiddenConfirm: true,
        onPrevOrCancel() {}
      }
    ],
    [tenantInfo, enterpriseEmail, sent, setSent]
  )

  const currStep = useMemo(() => {
    return steps.find(s => s.key === currStepKey)
  }, [currStepKey, steps])

  const renderBack = useMemo(() => {
    return (
      <BackCustom onBack={currStep?.onPrevOrCancel}>
        {t('common.back')}
      </BackCustom>
    )
  }, [t])

  const getFieldComponent = (config: any) => {
    switch (config.type) {
      case 'text':
        return (
          <Input
            className={config.inputClassName}
            autoComplete="off"
            size="large"
            addonBefore={config.addonBefore}
            addonAfter={config.addonAfter}
            prefix={config.prefix}
            suffix={config.suffix}
            disabled={config.disabled}
            placeholder={config.placeholder}
            readOnly={config.readOnly}
            style={{ ...config.style }}
            maxLength={config.maxLength}
          />
        )
      case 'custom':
        return config.customComponent
    }
  }

  return (
    <div className="g2-view-container g2-view-join">
      {renderBack}
      <div className="g2-join-content">
        <p className="authing-g2-join-title">{currStep?.title}</p>
        <p className="authing-g2-join-description">{currStep?.description}</p>
        <Form
          form={form}
          onFinish={currStep?.onNext}
          style={{ width: '100%', textAlign: 'center' }}
          onFinishFailed={() => submitButtonRef.current?.onError()}
        >
          {currStep?.formFields?.map?.((formItem: any) => (
            <Form.Item
              className="authing-g2-input-form"
              name={formItem?.name}
              rules={formItem?.rules}
              noStyle={formItem?.noStyle}
            >
              {getFieldComponent(formItem)}
            </Form.Item>
          ))}
          {!currStep?.hiddenConfirm && (
            <SubmitButton
              text={t('common.sure') as string}
              ref={submitButtonRef}
              className="authing-g2-join-button"
            />
          )}
        </Form>
      </div>
    </div>
  )
}
