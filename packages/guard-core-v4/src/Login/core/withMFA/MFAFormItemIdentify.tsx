// 该文件导出表单项 MFAFormItemIdentify，兼容 FormItemIdentify 逻辑
// 只保留下方的表单项实现，移除上方的重复导出和 props

import { Form, message } from 'shim-antd'
import { useTranslation } from 'react-i18next'
import { React } from 'shim-react'
import CustomFormItem from '../../../ValidatorRules'
import { fieldRequiredRule, VALIDATE_PATTERN } from '../../../_utils'
import {
  useGuardHttpClient,
  useGuardPhoneRegex,
  useGuardPublicConfig
} from '../../../_utils/context'
import { useCheckRepeat } from '../../../ValidatorRules/useCheckRepeat'
import { parsePhone } from '../../../_utils/hooks'
import { MFAInputMethod } from '../../../Type'

import { ReactNode } from 'shim-react'
interface MFAFormItemIdentifyProps {
  name: string
  className?: string
  form: any
  currentMethod: MFAInputMethod
  methods: MFAInputMethod[]
  areaCode?: string
  checkRepeat?: boolean
  checkExist?: boolean
  required?: boolean
  placeholder?: string
  children?: ReactNode
}

const FindMethodConversion = {
  'phone-mfa': 'phone',
  'email-mfa': 'email'
}

export function MFAFormItemIdentify(props: MFAFormItemIdentifyProps) {
  const {
    // name,
    // className,
    // form,
    currentMethod,
    methods,
    areaCode = 'CN',
    checkRepeat,
    checkExist,
    // required,
    // placeholder,
    children,
    ...formItemProps
  } = props
  const publicConfig = useGuardPublicConfig()
  const { t } = useTranslation()
  const [validateStatus, setValidateStatus] = React.useState<any>()
  const { get } = useGuardHttpClient()
  const phoneRegex = useGuardPhoneRegex()

  const checkInternationalSms =
    publicConfig.internationalSmsConfig?.enabled &&
    currentMethod === 'phone-mfa'

  const methodContent = React.useMemo(() => {
    if (currentMethod === 'email-mfa')
      return {
        field: t('common.emailLabel'),
        checkRepeatErrorMessage: t('common.checkEmail'),
        checkExistErrorMessage: t('common.noFindEmail'),
        formatErrorMessage: t('login.inputCorrectPhone'),
        delayFindErrorMessage: t('common.emailorcodeError'),
        pattern: VALIDATE_PATTERN.email
      }
    else
      return {
        field: t('common.phone'),
        checkRepeatErrorMessage: t('common.checkPhone'),
        checkExistErrorMessage: t('common.noFindPhone'),
        formatErrorMessage: t('login.inputCorrectPhone'),
        delayFindErrorMessage: t('common.phoneorcodeError'),
        pattern: phoneRegex || VALIDATE_PATTERN.phone
      }
  }, [currentMethod, phoneRegex, t])

  const checkRepeatRet = (
    value: any,
    resolve: (value: unknown) => void,
    reject: (reason?: any) => void
  ) => {
    let checkValue = value
    if (currentMethod === 'phone-mfa' && checkInternationalSms) {
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
    })
      .then(({ data }) => {
        if (checkExist) {
          if (Boolean(data)) {
            resolve(true)
          } else {
            if (publicConfig?.closeCheckSendUser) {
              setValidateStatus('validating')
              message.error(methodContent.delayFindErrorMessage)
            } else {
              reject(methodContent.checkExistErrorMessage)
            }
          }
        }
        if (checkRepeat) {
          if (Boolean(data)) {
            if (publicConfig?.closeCheckSendUser) {
              setValidateStatus('validating')
              message.error(methodContent.delayFindErrorMessage)
            } else {
              reject(methodContent.checkRepeatErrorMessage)
            }
          } else {
            resolve(true)
          }
        }
      })
      .finally(() => {
        setValidateStatus(undefined)
      })
  }

  const checkRepeatFn = useCheckRepeat(checkRepeatRet)

  const formatRules = React.useMemo(() => {
    if (checkInternationalSms) {
      return {
        validateTrigger: 'onBlur',
        validator: async (_: any, value: any) => {
          if (
            !value ||
            (window as any).phone(value, { country: areaCode }).isValid ||
            (window as any).phone(value).isValid
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

  const rules = React.useMemo(() => {
    const rules = [...fieldRequiredRule(t('common.phoneOrEmail'))]
    rules.push(formatRules)
    if (checkRepeat || checkExist) {
      rules.push({
        validator: checkRepeatFn,
        validateTrigger: []
      })
    }
    return rules
  }, [t, formatRules, checkRepeat, checkExist, checkRepeatFn])

  const renderTemplate = React.useMemo(() => {
    if (methods.length !== 1)
      return (
        <Form.Item
          validateTrigger={['onBlur', 'onChange']}
          validateFirst={true}
          rules={rules}
          validateStatus={validateStatus}
          {...formItemProps}
        >
          {children}
        </Form.Item>
      )
    switch (currentMethod) {
      case 'phone-mfa':
        return (
          <CustomFormItem.Phone
            {...formItemProps}
            validateStatus={validateStatus}
            areaCode={areaCode}
            checkRepeat={checkRepeat}
            checkExist={checkExist}
          >
            {children}
          </CustomFormItem.Phone>
        )
      case 'email-mfa':
        return (
          <CustomFormItem.Email
            {...formItemProps}
            validateStatus={validateStatus}
            checkRepeat={checkRepeat}
            checkExist={checkExist}
          >
            {children}
          </CustomFormItem.Email>
        )
    }
  }, [
    areaCode,
    checkExist,
    checkRepeat,
    currentMethod,
    formItemProps,
    methods.length,
    rules,
    validateStatus,
    children
  ])

  return <>{renderTemplate}</>
}
