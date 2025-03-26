import { Form, FormItemProps } from 'shim-antd'

import { React } from 'shim-react'

import { getPasswordValidate } from '../_utils'

import { useGuardInitData, useGuardPublicConfig } from '../_utils/context'
import { CheckRules } from './CheckRules'

export interface PasswordFormItemProps extends FormItemProps {}

export interface ExPasswordFormItemProps extends PasswordFormItemProps {
  fieldRequiredRuleMessage?: string
}

export const PasswordFormItem: React.FC<ExPasswordFormItemProps> = props => {
  const { rules, fieldRequiredRuleMessage, ...fromItemProos } = props

  const [ruleResults, setRuleResults] = React.useState<any>([])

  const publicConfig = useGuardPublicConfig()
  const initData = useGuardInitData<any>()
  let { passwordStrength, customPasswordStrength } = publicConfig
  const {
    passwordStrength: userPasswordStrength,
    customPasswordStrength: userCustomPasswordStrength,
    userId
  } = initData

  if (userPasswordStrength || userCustomPasswordStrength) {
    passwordStrength = userPasswordStrength
    customPasswordStrength = userCustomPasswordStrength
  }

  return publicConfig ? (
    <Form.Item
      validateTrigger={['onChange', 'onBlur']}
      validateFirst={true}
      name="password"
      rules={[
        ...(getPasswordValidate(
          passwordStrength,
          customPasswordStrength,
          fieldRequiredRuleMessage,
          userId,
          setRuleResults
        ) ?? []),
        ...(rules ?? [])
      ]}
      {...fromItemProos}
      help={
        ruleResults.length > 0 ? (
          <CheckRules ruleResults={ruleResults} />
        ) : undefined
      }
    />
  ) : (
    <Form.Item {...props} />
  )
}
