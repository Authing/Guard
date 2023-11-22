import { Form, FormItemProps } from 'shim-antd'

// import '@antd-lib-style/form/style/index.less'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import './style.less'

export interface VerifyCodeFormItemProps extends FormItemProps {
  codeLength: number
  ruleKeyword?: string
}

export const VerifyCodeFormItem: React.FC<VerifyCodeFormItemProps> = props => {
  const { t } = useTranslation()
  const {
    codeLength,
    ruleKeyword = t('common.captchaCode'),
    ...formItemProps
  } = props
  return (
    <Form.Item
      validateTrigger={['onChange']}
      name="mfaCode"
      className="g2-mfa-totp-verify-input"
      validateFirst={true}
      rules={[
        {
          type: 'array',
          validateTrigger: ['onChange'],
          message: t('common.isMissing', {
            name: ruleKeyword
          }) as string,
          required: true
        },
        {
          type: 'array',
          validateTrigger: [''],
          message: t('common.fullCaptchaCode', {
            name: ruleKeyword
          }) as string,
          min: codeLength
        }
      ]}
      {...formItemProps}
    />
  )
}
