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

  const [formType, setFormType] = useState<0 | 1>(1)

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
            <span>{'返回'}</span>
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
                await flowHandle(content, step1ButtonRef.current)
              }
            }}
          >
            <Form.Item
              className="authing-g2-input-form"
              name="accountType"
              label="账号类型"
              initialValue={'personal'}
            >
              <Select
                className={classnames('authing-g2-select', 'authing-g2-input')}
                popupClassName="authing-g2-dropdown"
                options={[
                  { label: '个人账号', value: 'personal' },
                  { label: '企业账号', value: 'enterprise' }
                ]}
                placeholder={'请选择'}
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
                  ...values
                },
                step2ButtonRef.current
              )
            }}
          >
            <Form.Item
              className="authing-g2-input-form"
              name="businessName"
              label="企业名称"
              rules={[
                {
                  required: true,
                  validateTrigger: 'onBlur',
                  message: t('login.noEmpty', { label: '企业名称' }) as string
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
              label="工商登记名称"
              rules={[
                {
                  required: true,
                  validateTrigger: 'onBlur',
                  message: t('login.noEmpty', {
                    label: '工商登记名称'
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
              label="统一社会信用代码"
              rules={[
                {
                  required: true,
                  validateTrigger: 'onBlur',
                  message: t('login.noEmpty', {
                    label: '统一社会信用代码'
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
              label="法人姓名"
              rules={[
                {
                  required: true,
                  validateTrigger: 'onBlur',
                  message: t('login.noEmpty', {
                    label: '法人姓名'
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
              label="法人身份证号"
              rules={[
                {
                  required: true,
                  validateTrigger: 'onBlur',
                  message: t('login.noEmpty', {
                    label: '法人身份证号'
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
