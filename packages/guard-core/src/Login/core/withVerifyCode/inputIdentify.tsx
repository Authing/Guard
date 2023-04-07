import { InputProps } from 'shim-antd/lib/input'

import { React } from 'shim-react'

import { CommonInput } from '../../../CommonInput'

import { InputNumber } from '../../../InputNumber'

import { VerifyLoginMethods } from '../../../Type/application'

export interface InputIdentifyProps extends InputProps {
  methods: VerifyLoginMethods[]
  name: string
}

const { useMemo } = React

export const InputIdentify: React.FC<InputIdentifyProps> = props => {
  const { methods, ...inputProps } = props

  const renderInput = useMemo(() => {
    if (methods.length === 1 && methods[0] === 'phone-code') {
      // TODO 开启国际化配置并登录方式为手机号码时
      return <InputNumber maxLength={11} {...inputProps} />
    }

    return (
      <CommonInput
        // placeholder={placeholder}
        {...inputProps}
        // prefix={
        //   <IconFont type="authing-a-user-line1" style={{ color: '#878A95' }} />
        // }
      />
    )
  }, [inputProps, methods])

  return <>{renderInput}</>
}
