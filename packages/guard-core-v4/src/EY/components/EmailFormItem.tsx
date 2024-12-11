import { Form, Input } from 'shim-antd'

import React from 'react'
import { useTranslation } from 'react-i18next'
import { IconFont } from '../../IconFont'
import { VALIDATE_PATTERN } from '../../_utils'

export const EmailFormItem = (props: any) => {
  const { inputProps, formItemProps } = props
  const { t } = useTranslation()
  return (
    <Form.Item
      name="email"
      className="authing-g2-input-form"
      validateTrigger={['onBlur', 'onChange']}
      validateFirst={true}
      rules={[
        {
          required: true,
          validateTrigger: ['onChange'],
          message: t('common.ey.emailEmpty'),
          whitespace: true
        },
        {
          validateTrigger: 'onBlur',
          pattern: VALIDATE_PATTERN.email,
          message: t('common.emailFormatError')
        }
      ]}
      {...formItemProps}
    >
      <Input
        className="authing-g2-input"
        autoComplete="off"
        size="large"
        prefix={
          <IconFont type="authing-a-user-line1" style={{ color: '#878A95' }} />
        }
        {...inputProps}
      />
    </Form.Item>
  )
}
