import { React } from 'shim-react'

import { Input, InputProps } from 'shim-antd'

import '@antd-es-style/input/style/index.less'

import { InputNumber } from '../../../InputNumber'

const { useMemo } = React

export interface InputAccountProps extends InputProps {
  passwordLoginMethods: string[]
  placeholder: string
}

export const InputAccount: React.FC<InputAccountProps> = props => {
  const { passwordLoginMethods: methods, placeholder, ...inputProps } = props

  const runderInput = useMemo(() => {
    if (methods.length === 1 && methods[0] === 'phone-password')
      return (
        <InputNumber maxLength={20} placeholder={placeholder} {...inputProps} />
      )

    return <Input placeholder={placeholder} {...inputProps} />
  }, [inputProps, methods, placeholder])

  return <>{runderInput}</>
}
