import { Form } from 'shim-antd'

// import '@antd-lib-style/form/style/index.less'

import { React } from 'shim-react'

import { fieldRequiredRule, VALIDATE_PATTERN } from '../_utils'

import { useGuardHttp } from '../_utils/guardHttp'

import { useTranslation } from 'react-i18next'

import { ValidatorFormItemMetaProps, ValidatorFormItemProps } from '.'

import { Rule } from 'shim-antd/lib/form'

import { useGuardPhoneRegex, useGuardPublicConfig } from '../_utils/context'

import { phone } from 'phone'

import { useCheckRepeat } from './useCheckRepeat'

const { useMemo } = React

const ValidatorFormItem: React.FC<ValidatorFormItemMetaProps> = props => {
  const {
    checkRepeat = false,
    checkExist = false,
    method,
    name,
    required,
    areaCode, //国际化区号
    isCheckPattern = true,
    ...formItemProps
  } = props
  const publicConfig = useGuardPublicConfig()
  const { get } = useGuardHttp()
  const { t } = useTranslation()

  const checkInternationalSms = useMemo(() => {
    return (
      publicConfig.internationalSmsConfig?.enabled &&
      method === 'phone' &&
      isCheckPattern
    )
  }, [isCheckPattern, method, publicConfig.internationalSmsConfig?.enabled])

  const phoneRegex = useGuardPhoneRegex()

  const methodContent = useMemo(() => {
    if (method === 'email')
      return {
        field: t('common.emailLabel'),
        checkRepeatErrorMessage: t('common.checkEmail'),
        formatErrorMessage: t('common.emailFormatError'),
        checkExistErrorMessage: t('common.noFindEmail'),
        pattern: VALIDATE_PATTERN.email
      }
    else if (method === 'username') {
      return {
        field: t('common.username'),
        checkRepeatErrorMessage: t('common.checkUserName'),
        checkExistErrorMessage: t('common.noFindUsername'),
        formatErrorMessage: t('common.usernameFormatError'),
        pattern: VALIDATE_PATTERN.username
      }
    } else if (method === 'phone') {
      return {
        field: t('common.phone'),
        checkRepeatErrorMessage: t('common.checkPhone'),
        checkExistErrorMessage: t('common.noFindPhone'),
        formatErrorMessage: t('common.phoneFormateError'),
        pattern:
          !isCheckPattern && publicConfig.internationalSmsConfig?.enabled
            ? /^[0-9]*$/
            : phoneRegex || VALIDATE_PATTERN.phone //开启国际化短信，但不限制pattern eg：单手机号密码登录方式时🤢
      }
    }

    // 自定义字段
    return {
      field: t('common.account'),
      checkRepeatErrorMessage: t('common.checkCustomName'),
      checkExistErrorMessage: t('common.noFindUsername'),
      formatErrorMessage: t('common.customNameFormatError'),
      pattern: VALIDATE_PATTERN.username
    }
  }, [
    isCheckPattern,
    method,
    publicConfig.internationalSmsConfig?.enabled,
    t,
    phoneRegex
  ])

  const checkRepeatRet = (
    value: any,
    resolve: (value: unknown) => void,
    reject: (reason?: any) => void
  ) => {
    get<boolean>('/api/v2/users/find', {
      userPoolId: publicConfig?.userPoolId,
      key: value,
      type: method
    }).then(({ data }) => {
      if (checkExist) {
        Boolean(data)
          ? resolve(true)
          : reject(methodContent.checkExistErrorMessage)
      }
      if (checkRepeat) {
        Boolean(data)
          ? reject(methodContent.checkRepeatErrorMessage)
          : resolve(true)
      }
    })
  }

  const checkRepeatFn = useCheckRepeat(checkRepeatRet)

  const formatRules = useMemo<Rule>(() => {
    if (checkInternationalSms) {
      return {
        validateTrigger: 'onBlur',
        validator: async (_, value) => {
          if (!value || phone(value, { country: areaCode }).isValid)
            return Promise.resolve()
          return Promise.reject(t('common.internationPhoneMessage'))
        }
      }
    }

    return {
      validateTrigger: 'onBlur',
      pattern: methodContent.pattern,
      message: methodContent.formatErrorMessage
    }
  }, [
    areaCode,
    checkInternationalSms,
    methodContent.formatErrorMessage,
    methodContent.pattern,
    t
  ])

  const rules = useMemo<Rule[]>(() => {
    // 如果不是必填就不校验
    if (required === false) return []

    // 必填项的默认校验规则
    const rules = [...fieldRequiredRule(methodContent.field)]

    // 格式校验
    rules.push(formatRules)

    // 是否校验重复
    if (checkRepeat || checkExist) {
      rules.push({
        validator: checkRepeatFn,
        validateTrigger: []
      })
    }

    return rules
  }, [
    required,
    methodContent.field,
    formatRules,
    checkRepeat,
    checkExist,
    checkRepeatFn
  ])
  return (
    <Form.Item
      validateFirst={true}
      validateTrigger={['onBlur', 'onChange']}
      rules={[...rules, ...(formItemProps?.rules ?? [])]}
      name={name ?? method}
      {...formItemProps}
    />
  )
}
export const EmailFormItem: React.FC<ValidatorFormItemProps> = props => (
  <ValidatorFormItem required method="email" {...props} />
)
export const PhoneFormItem: React.FC<ValidatorFormItemProps> = props => (
  <ValidatorFormItem required method="phone" {...props} />
)

export const UserNameFormItem: React.FC<ValidatorFormItemProps> = props => (
  <ValidatorFormItem required method="username" {...props} />
)

export const CustomNameFormItem: React.FC<
  ValidatorFormItemProps & { method: string }
> = props => <ValidatorFormItem required {...props} />
