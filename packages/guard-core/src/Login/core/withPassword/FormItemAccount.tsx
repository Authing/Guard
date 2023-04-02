import { FormItemProps } from 'shim-antd/lib/form'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { CommonFormItem } from '../../../CommonFormItem'

import CustomFormItem from '../../../ValidatorRules'

import { fieldRequiredRule } from '../../../_utils'

export interface FormItemAccountProps extends FormItemProps {
  validPasswordLoginMethods: string[]
}

const { useMemo } = React

export const FormItemAccount: React.FC<FormItemAccountProps> = props => {
  const { validPasswordLoginMethods, ...formItemPtops } = props

  const { t } = useTranslation()

  const runderTemplate = useMemo(() => {
    if (validPasswordLoginMethods.length !== 1)
      return (
        <CommonFormItem
          validateTrigger={['onBlur', 'onChange']}
          rules={fieldRequiredRule(t('common.account'))}
          {...formItemPtops}
        />
      )

    switch (validPasswordLoginMethods[0]) {
    case 'phone-password':
      return <CustomFormItem.Phone {...formItemPtops} isCheckPattern={false} />
    case 'email-password':
      return <CustomFormItem.Email {...formItemPtops} />
    }

    return <CustomFormItem.UserName {...formItemPtops} />
  }, [formItemPtops, validPasswordLoginMethods, t])

  return <>{runderTemplate}</>
}
