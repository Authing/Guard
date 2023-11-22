import { Input, InputProps } from 'shim-antd'

// import '@antd-lib-style/input/style/index.less'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { IconFont } from '../../../IconFont'

import { InputNumber } from '../../../InputNumber'

import { VerifyLoginMethods } from '../../../Type/application'

import { useGuardPublicConfig } from '../../../_utils/context'

const { useMemo } = React

export interface InputIdentifyProps extends InputProps {
  methods: VerifyLoginMethods[]
}

export const InputIdentify: React.FC<InputIdentifyProps> = props => {
  const { methods, ...inputProps } = props

  const publicConfig = useGuardPublicConfig()

  const { t } = useTranslation()

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

  const placeholder = useMemo(
    () =>
      t('login.inputAccount', {
        text: methods
          ?.map(item => verifyCodeMethodsText[item])
          .sort((a, b) => a.sort - b.sort)
          .map(item => item.t)
          .join(' / ')
      }),
    [methods, t, verifyCodeMethodsText]
  )

  const renderInput = useMemo(() => {
    if (methods.length === 1 && methods[0] === 'phone-code') {
      // TODO 开启国际化配置并登录方式为手机号码时
      return (
        <InputNumber maxLength={11} placeholder={placeholder} {...inputProps} />
      )
    }

    return (
      <Input
        placeholder={placeholder}
        {...inputProps}
        prefix={
          <IconFont type="authing-a-user-line1" style={{ color: '#878A95' }} />
        }
      />
    )
  }, [inputProps, methods, placeholder])

  return <>{renderInput}</>
}
