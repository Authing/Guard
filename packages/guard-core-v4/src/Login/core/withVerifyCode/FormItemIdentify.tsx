import { FormItemProps, Rule } from 'shim-antd/lib/form'

import { Form } from 'shim-antd'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import CustomFormItem from '../../../ValidatorRules'

import { fieldRequiredRule, VALIDATE_PATTERN } from '../../../_utils'

import { phone } from 'phone'

import {
  useGuardHttpClient,
  useGuardPhoneRegex,
  useGuardPublicConfig
} from '../../../_utils/context'

import { useCheckRepeat } from '../../../ValidatorRules/useCheckRepeat'

import { parsePhone } from '../../../_utils/hooks'

import { VerifyLoginMethods } from '../../../Type/application'

const { useMemo } = React

export interface FormItemIdentifyProps extends FormItemProps {
  checkRepeat?: boolean // 重复性校验
  checkExist?: boolean //存在性校验
  methods: VerifyLoginMethods[]
  currentMethod: 'phone-code' | 'email-code' //当前 input 输入
  areaCode?: string //国际化手机号区号
}

const FindMethodConversion = {
  'phone-code': 'phone',
  'email-code': 'email'
}

export const FormItemIdentify: React.FC<FormItemIdentifyProps> = props => {
  const {
    methods,
    areaCode = 'CN',
    currentMethod,
    checkRepeat,
    checkExist,
    ...formItemProps
  } = props
  const publicConfig = useGuardPublicConfig()
  const { t } = useTranslation()

  const { get } = useGuardHttpClient()

  const phoneRegex = useGuardPhoneRegex()

  const checkInternationalSms =
    publicConfig.internationalSmsConfig?.enabled &&
    currentMethod === 'phone-code'

  const methodContent = useMemo(() => {
    if (currentMethod === 'email-code')
      return {
        field: t('common.emailLabel'),
        checkRepeatErrorMessage: t('common.checkEmail'),
        checkExistErrorMessage: t('common.noFindEmail'),
        formatErrorMessage: t('login.inputCorrectPhone'),
        pattern: VALIDATE_PATTERN.email
      }
    else
      return {
        field: t('common.phone'),
        checkRepeatErrorMessage: t('common.checkPhone'),
        checkExistErrorMessage: t('common.noFindPhone'),
        formatErrorMessage: t('login.inputCorrectPhone'),
        pattern: phoneRegex || VALIDATE_PATTERN.phone
      }
  }, [currentMethod, phoneRegex, t])

  const checkRepeatRet = (
    value: any,
    resolve: (value: unknown) => void,
    reject: (reason?: any) => void
  ) => {
    let checkValue = value
    if (currentMethod === 'phone-code' && checkInternationalSms) {
      const { phoneNumber } = parsePhone(
        checkInternationalSms,
        checkValue,
        areaCode
      )
      checkValue = phoneNumber
    }
    get<boolean>('/api/v2/users/find', {
      userPoolId: publicConfig?.userPoolId,
      key: checkValue,
      type: FindMethodConversion[currentMethod]
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
        validator: async (_: any, value: any) => {
          if (
            !value ||
            phone(value, { country: areaCode }).isValid ||
            phone(value).isValid
          )
            return Promise.resolve()
          return Promise.reject(t('common.i18nCheckErrorMessage'))
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

    // 必填项的默认校验规则
    const rules = [...fieldRequiredRule(t('common.phoneOrEmail'))]

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
  }, [t, formatRules, checkRepeat, checkExist, checkRepeatFn])
  // TODO 未来抽离
  const renderTemplate = useMemo(() => {
    if (methods.length !== 1)
      return (
        <Form.Item
          validateTrigger={['onBlur', 'onChange']}
          validateFirst={true}
          rules={rules}
          {...formItemProps}
        />
      )

    switch (currentMethod) {
      case 'phone-code':
        return (
          <CustomFormItem.Phone
            {...formItemProps}
            areaCode={areaCode}
            checkRepeat={checkRepeat}
            checkExist={checkExist}
          />
        )
      case 'email-code':
        return (
          <CustomFormItem.Email
            {...formItemProps}
            checkRepeat={checkRepeat}
            checkExist={checkExist}
          />
        )
    }
  }, [
    areaCode,
    checkExist,
    checkRepeat,
    currentMethod,
    formItemProps,
    methods.length,
    rules
  ])

  return <>{renderTemplate}</>
}
