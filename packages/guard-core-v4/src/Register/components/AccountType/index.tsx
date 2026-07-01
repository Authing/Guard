import { React } from 'shim-react'

import { Form, Input, Select, message } from 'shim-antd'

import { useTranslation } from 'react-i18next'

import './style.less'

import { GuardModuleType } from '../../../Guard/module'

import { ImagePro } from '../../../ImagePro'

import {
  useGuardFinallyConfig,
  useGuardHttpClient,
  useGuardInitData,
  useGuardModule
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
import { UploadImage } from '../../../UploadImage'

const { useRef, useState, useCallback } = React

interface TenantBusinessLicenseOcrData {
  businessRegistrationName?: string
  unifiedSocialCredit?: string
  legalRepresentativeName?: string
  businessLicense?: string
  businessLicenseUrl?: string
  url?: string
  fileUrl?: string
  imageUrl?: string
  file?: {
    url?: string
    fileUrl?: string
  }
  upload?: {
    url?: string
    fileUrl?: string
  }
}

type BusinessLicenseOcrStatus = 'idle' | 'checking' | 'passed' | 'failed'

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

  const { postForm } = useGuardHttpClient()

  const [form] = Form.useForm()

  const step1ButtonRef = useRef<any>(null)

  const step2ButtonRef = useRef<any>(null)

  const [formType, setFormType] = useState<0 | 1>(0)

  const [businessLicenseOcrStatus, setBusinessLicenseOcrStatus] =
    useState<BusinessLicenseOcrStatus>('idle')

  const beforeUploadBusinessLicense = useCallback(
    (file: File) => {
      const isValidFileType =
        ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type) ||
        /\.(jpe?g|png)$/i.test(file.name)

      if (!isValidFileType) {
        message.error(
          t('common.registerAccountType.businessLicenseFormatError') as string
        )
        return false
      }

      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        message.error(
          t('common.registerAccountType.businessLicenseSizeError') as string
        )
        return false
      }

      setBusinessLicenseOcrStatus('checking')
      form.setFieldsValue({ businessLicense: undefined })
      form.setFields([{ name: 'businessLicense', errors: [] }])

      return true
    },
    [form, t]
  )

  const handleBusinessLicenseUploaded = useCallback(
    async (file: File): Promise<string> => {
      setBusinessLicenseOcrStatus('checking')
      form.setFields([{ name: 'businessLicense', errors: [] }])

      const markBusinessLicenseOcrFailed = (errorMessage?: string): never => {
        const businessLicenseOcrErrorMessage =
          errorMessage ||
          (t('common.registerAccountType.businessLicenseOcrError') as string)

        setBusinessLicenseOcrStatus('failed')
        form.setFields([
          {
            name: 'businessLicense',
            errors: [businessLicenseOcrErrorMessage]
          }
        ])
        message.error(businessLicenseOcrErrorMessage)
        throw new Error(businessLicenseOcrErrorMessage)
      }

      const formData = new FormData()
      formData.append('file', file)

      const {
        statusCode,
        code,
        data,
        message: errMessage,
        messages
      } = await postForm<TenantBusinessLicenseOcrData>(
        '/api/v3/tenant-enterprise-certification-upload',
        formData
      )

      if (statusCode !== 200 && code !== 200) {
        markBusinessLicenseOcrFailed(errMessage || messages)
      }

      const ocrData = data || markBusinessLicenseOcrFailed()

      const businessLicense =
        ocrData.businessLicense ||
        ocrData.businessLicenseUrl ||
        ocrData.url ||
        ocrData.fileUrl ||
        ocrData.imageUrl ||
        ocrData.file?.url ||
        ocrData.file?.fileUrl ||
        ocrData.upload?.url ||
        ocrData.upload?.fileUrl

      const businessLicenseUrl =
        businessLicense || markBusinessLicenseOcrFailed()

      const ocrValues: TenantBusinessLicenseOcrData = {}
      ocrValues.businessLicense = businessLicenseUrl
      if (ocrData.businessRegistrationName) {
        ocrValues.businessRegistrationName = ocrData.businessRegistrationName
      }
      if (ocrData.unifiedSocialCredit) {
        ocrValues.unifiedSocialCredit = ocrData.unifiedSocialCredit
      }
      if (ocrData.legalRepresentativeName) {
        ocrValues.legalRepresentativeName = ocrData.legalRepresentativeName
      }

      if (Object.keys(ocrValues).length > 0) {
        form.setFieldsValue(ocrValues)
      }

      setBusinessLicenseOcrStatus('passed')
      form.setFields([{ name: 'businessLicense', errors: [] }])
      return businessLicenseUrl
    },
    [form, postForm, t]
  )

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
            <Form.Item
              className="authing-g2-input-form authing-g2-business-license-form"
              name="businessLicense"
              label={t('common.registerAccountType.businessLicense') as string}
              extra={
                t('common.registerAccountType.businessLicenseTip') as string
              }
              rules={[
                {
                  required: true,
                  validateTrigger: 'onChange',
                  message: t('login.noEmpty', {
                    label: t(
                      'common.registerAccountType.businessLicense'
                    ) as string
                  }) as string
                },
                {
                  validateTrigger: 'onChange',
                  validator: (_: any, value: string) => {
                    if (!value) return Promise.resolve()

                    if (businessLicenseOcrStatus === 'checking') {
                      return Promise.reject(
                        new Error(
                          t(
                            'common.registerAccountType.businessLicenseOcrChecking'
                          ) as string
                        )
                      )
                    }

                    if (businessLicenseOcrStatus !== 'passed') {
                      return Promise.reject(
                        new Error(
                          t(
                            'common.registerAccountType.businessLicenseOcrError'
                          ) as string
                        )
                      )
                    }

                    return Promise.resolve()
                  }
                }
              ]}
            >
              <UploadImage
                uploadText={
                  t(
                    'common.registerAccountType.uploadBusinessLicense'
                  ) as string
                }
                accept="image/png, image/jpeg, image/jpg,.jpg,.jpeg,.png"
                folder="tenant-enterprise-certification"
                beforeUpload={beforeUploadBusinessLicense}
                customUpload={handleBusinessLicenseUploaded}
                onUploadFailed={() => setBusinessLicenseOcrStatus('failed')}
              />
            </Form.Item>

            <SubmitButton
              text={t('user.nextStep') as string}
              ref={step2ButtonRef}
              disabled={
                businessLicenseOcrStatus === 'checking' ||
                businessLicenseOcrStatus === 'failed'
              }
            />
          </Form>
        )}
      </div>
    </div>
  )
}
