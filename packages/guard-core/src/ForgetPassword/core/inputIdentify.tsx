import { InputProps } from 'shim-antd'

import { React } from 'shim-react'

import { i18n } from '../../_utils'

import { CommonInput } from '../../CommonInput'

import { InputNumber } from '../../InputNumber'

import { VerifyLoginMethods } from '../../Type/application'

import { useGuardPublicConfig } from '../../_utils/context'

const { useMemo } = React

export interface InputIdentifyProps extends InputProps {
  methods: VerifyLoginMethods[]
}

export const InputIdentify: React.FC<InputIdentifyProps> = props => {
  const { methods, ...inputProps } = props

  const publicConfig = useGuardPublicConfig()

  const { t } = i18n

  const verifyCodeMethodsText = useMemo<
    Record<
      VerifyLoginMethods,
      {
        t: string
        sort: number
      }
    >
  >(
    () => ({
      'email-code': {
        t: t('common.email'),
        sort: 2
      },
      'phone-code': {
        t: publicConfig?.internationalSmsConfig?.enabled
          ? t('common.areaCodePhone')
          : t('common.phoneNumber'),
        sort: 1
      }
    }),
    [publicConfig, t]
  )

  const placeholder = useMemo(() => {
    if (publicConfig?.internationalSmsConfig?.enabled) {
      return t('login.inputAccount', {
        text: methods
          ?.map(item => verifyCodeMethodsText[item])
          .sort((a, b) => a.sort - b.sort)
          .map(item => item.t)
          .map((item, index) => (index === 0 ? `「${item}」` : item))
          .join(' / ')
      })
    } else {
      return t('login.inputAccount', {
        text: methods
          ?.map(item => verifyCodeMethodsText[item])
          .sort((a, b) => a.sort - b.sort)
          .map(item => item.t)
          .join(' / ')
      })
    }
  }, [methods, t, verifyCodeMethodsText, publicConfig?.internationalSmsConfig?.enabled])

  const renderInput = useMemo(() => {
    if (methods.length === 1 && methods[0] === 'phone-code') {
      // TODO 开启国际化配置并登录方式为手机号码时
      return <InputNumber maxLength={11} placeholder={placeholder} {...inputProps} />
    }

    return (
      <CommonInput
        maxLength={50} // 手机号限长 20 字符，多种组合是 50 字符
        placeholder={placeholder}
        {...inputProps}
        // prefix={
        //   <IconFont type="authing-a-user-line1" style={{ color: '#878A95' }} />
        // }
      />
    )
  }, [inputProps, methods, placeholder])

  return <>{renderInput}</>
}
