import { React } from 'shim-react'

import { Form, Input, Select, message } from 'shim-antd'

import { useTranslation } from 'react-i18next'

import './style.less'

import { GuardModuleType } from '../../../Guard/module'

import { ImagePro } from '../../../ImagePro'

import {
  useGuardFinallyConfig,
  useGuardInitData,
  useGuardModule,
  useGuardPublicConfig
} from '../../../_utils/context'

import { useGuardView } from '../../../Guard/core/hooks/useGuardView'

import { i18n } from '../../../_utils'
import SubmitButton from '../../../SubmitButton'

import classnames from 'classnames'
import { GuardButton } from '../../../GuardButton'
import { IconFont } from '../../../IconFont'
import { BackCustom } from '../../../Back'
import { RegisterCompletePasswordInitData } from '../../../CompleteInfo/interface'
import { registerSkipMethod } from '../../../CompleteInfo/businessRequest'

const { useRef, useState, useCallback } = React

export const GuardRegisterAccountTypeView: React.FC = () => {
  const { t } = useTranslation()

  const {
    businessRequestName,
    content,
    isChangeComplete,
    onRegisterSuccess,
    onRegisterFailed
  } = useGuardInitData<RegisterCompletePasswordInitData>()

  const { changeModule } = useGuardModule()

  const config = useGuardFinallyConfig()

  const [form] = Form.useForm()

  const step1ButtonRef = useRef<any>(null)

  const step2ButtonRef = useRef<any>(null)

  const [formType, setFormType] = useState<0 | 1>(0)

  const flowHandle = useCallback(async (_content: any, btn: any) => {
    if (isChangeComplete) {
      changeModule?.(GuardModuleType.REGISTER_COMPLETE_INFO, {
        businessRequestName,
        content: _content,
        onRegisterSuccess,
        onRegisterFailed
      })
    } else {
      // 直接注册
      const {
        data,
        statusCode,
        apiCode,
        message: errMessage
      } = await registerSkipMethod(businessRequestName, _content)
      if (statusCode === 200) {
        btn?.onSpin(false)
        onRegisterSuccess(data)
      } else {
        btn?.onError()
        message.error(errMessage)
        onRegisterFailed(apiCode, data, errMessage)
      }
    }
  }, [])

  return (
    <div className="g2-view-container g2-register-account-type">
      <div className="g2-view-header">
        {formType === 1 && (
          <GuardButton
            type="link"
            onClick={() => setFormType(0)}
            className="back-btn"
          >
            <IconFont
              type="authing-arrow-left-s-line"
              style={{ fontSize: 24 }}
            />
            <span>{t('common.back') as string}</span>
          </GuardButton>
        )}
        <ImagePro
          src={config?.logo as string}
          size={48}
          borderRadius={4}
          alt=""
          className="icon"
        />
        <div className="title">{config?.title}</div>
      </div>
      <div className="g2-view-tabs">
        {/*账号选择 */}
        {formType === 0 && (
          <Form
            className="authing-g2-completeInfo-form authing-g2-form-required-item-icon-after"
            layout="vertical"
            form={form}
            onSubmitCapture={() => {}}
            onFinishFailed={() => {
              step1ButtonRef.current.onError()
            }}
            onFinish={async values => {
              const { accountType } = values
              if (accountType === 'enterprise') {
                // 企业账号
                setFormType(1)
              } else {
                // 私人账号 直接走后续流程
                await flowHandle(
                  {
                    ...content,
                    accountType: 'personal'
                  },
                  step1ButtonRef.current
                )
              }
            }}
          >
            <Form.Item
              className="authing-g2-input-form"
              name="accountType"
              label={t('common.registerAccountType.title') as string}
              initialValue={'personal'}
            >
              <Select
                className={classnames('authing-g2-select', 'authing-g2-input')}
                popupClassName="authing-g2-dropdown"
                options={[
                  {
                    label: t('common.registerAccountType.personal') as string,
                    value: 'personal'
                  },
                  {
                    label: t('common.registerAccountType.enterprise') as string,
                    value: 'enterprise'
                  }
                ]}
                placeholder={t('common.pleaseSelect') as string}
              />
            </Form.Item>

            <SubmitButton
              text={t('user.nextStep') as string}
              ref={step1ButtonRef}
            />
          </Form>
        )}
        {formType === 1 && (
          <Form
            className="authing-g2-completeInfo-form authing-g2-form-required-item-icon-after"
            layout="vertical"
            form={form}
            onSubmitCapture={() => {}}
            onFinishFailed={() => {
              step2ButtonRef.current.onError()
            }}
            onFinish={async values => {
              await flowHandle(
                {
                  ...content,
                  accountType: 'enterprise',
                  tenantEnterpriseCertification: values
                },
                step2ButtonRef.current
              )
            }}
          >
            <Form.Item
              className="authing-g2-input-form"
              name="businessName"
              label={t('common.registerAccountType.enterpriseName') as string}
              rules={[
                {
                  required: true,
                  validateTrigger: 'onBlur',
                  message: t('login.noEmpty', {
                    label: t(
                      'common.registerAccountType.enterpriseName'
                    ) as string
                  }) as string
                }
              ]}
            >
              <Input
                type="text"
                size="large"
                className="authing-g2-input"
                autoComplete="off"
              />
            </Form.Item>
            <Form.Item
              className="authing-g2-input-form"
              name="businessRegistrationName"
              label={
                t(
                  'common.registerAccountType.businessRegistrationName'
                ) as string
              }
              rules={[
                {
                  required: true,
                  validateTrigger: 'onBlur',
                  message: t('login.noEmpty', {
                    label: t(
                      'common.registerAccountType.businessRegistrationName'
                    ) as string
                  }) as string
                }
              ]}
            >
              <Input
                type="text"
                size="large"
                className="authing-g2-input"
                autoComplete="off"
              />
            </Form.Item>
            <Form.Item
              className="authing-g2-input-form"
              name="unifiedSocialCredit"
              label={
                t('common.registerAccountType.unifiedSocialCredit') as string
              }
              rules={[
                {
                  required: true,
                  validateTrigger: 'onBlur',
                  message: t('login.noEmpty', {
                    label: t(
                      'common.registerAccountType.unifiedSocialCredit'
                    ) as string
                  }) as string
                }
              ]}
            >
              <Input
                type="text"
                size="large"
                className="authing-g2-input"
                autoComplete="off"
              />
            </Form.Item>
            <Form.Item
              className="authing-g2-input-form"
              name="legalRepresentativeName"
              label={
                t(
                  'common.registerAccountType.legalRepresentativeName'
                ) as string
              }
              rules={[
                {
                  required: true,
                  validateTrigger: 'onBlur',
                  message: t('login.noEmpty', {
                    label: t(
                      'common.registerAccountType.legalRepresentativeName'
                    ) as string
                  }) as string
                }
              ]}
            >
              <Input
                type="text"
                size="large"
                className="authing-g2-input"
                autoComplete="off"
              />
            </Form.Item>
            <Form.Item
              className="authing-g2-input-form"
              name="nationalIdentificationNumber"
              label={
                t(
                  'common.registerAccountType.nationalIdentificationNumber'
                ) as string
              }
              rules={[
                {
                  required: true,
                  validateTrigger: 'onBlur',
                  message: t('login.noEmpty', {
                    label: t(
                      'common.registerAccountType.nationalIdentificationNumber'
                    ) as string
                  }) as string
                }
              ]}
            >
              <Input
                type="text"
                size="large"
                className="authing-g2-input"
                autoComplete="off"
              />
            </Form.Item>

            <SubmitButton
              text={t('user.nextStep') as string}
              ref={step2ButtonRef}
            />
          </Form>
        )}
      </div>
    </div>
  )
}
