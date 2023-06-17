import { React } from 'shim-react'

import { FormItemProps } from 'shim-antd'

export interface PasswordFormItemProps extends FormItemProps {}

import { CommonFormItem } from '../CommonFormItem'

import { getPasswordValidate } from '../_utils'

import { useGuardInitData, useGuardPublicConfig } from '../_utils/context'

export interface ExPasswordFormItemProps extends PasswordFormItemProps {
  fieldRequiredRuleMessage?: string
}

export const PasswordFormItem: React.FC<ExPasswordFormItemProps> = props => {
  const { rules, fieldRequiredRuleMessage, ...fromItemProos } = props

  const publicConfig = useGuardPublicConfig()
  const initData = useGuardInitData<any>()
  let { passwordStrength, customPasswordStrength } = publicConfig
  const {
    passwordStrength: userPasswordStrength,
    customPasswordStrength: userCustomPasswordStrength
  } = initData

  if (userPasswordStrength || userCustomPasswordStrength) {
    passwordStrength = userPasswordStrength
    customPasswordStrength = userCustomPasswordStrength
  }

  return publicConfig ? (
    <CommonFormItem
      validateTrigger={['onChange', 'onBlur']}
      validateFirst={true}
      name="password"
      rules={[
        ...getPasswordValidate(
          passwordStrength,
          customPasswordStrength,
          fieldRequiredRuleMessage
        ),
        ...(rules ?? [])
      ]}
      {...fromItemProos}
    />
  ) : (
    <CommonFormItem {...props} />
  )
}
