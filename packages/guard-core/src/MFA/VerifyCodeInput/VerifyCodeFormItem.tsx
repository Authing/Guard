import { React } from 'shim-react'

import { FormItemProps } from 'shim-antd/lib/form'

import { Form } from 'shim-antd'

import { i18n } from '../../_utils'

import './style.less'

export interface VerifyCodeFormItemProps extends FormItemProps {
  codeLength: number
  ruleKeyword?: string
}

export const VerifyCodeFormItem: React.FC<VerifyCodeFormItemProps> = props => {
  const { t } = i18n
  const { codeLength, ruleKeyword = t('common.captchaCode'), ...formItemProps } = props
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
          }),
          required: true
        },
        {
          type: 'array',
          validateTrigger: [''],
          message: t('common.fullCaptchaCode', {
            name: ruleKeyword
          }),
          min: codeLength
        }
      ]}
      {...formItemProps}
    />
  )
}
