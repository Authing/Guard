import { InputProps } from 'shim-antd/lib/input'

import { React } from 'shim-react'

import { CommonInput } from '../../../CommonInput'

import { InputNumber } from '../../../InputNumber'

export interface InputAccountProps extends InputProps {
  passwordLoginMethods: string[]
  name: string
  // placeholder: string
}

const { useMemo } = React

export const InputAccount: React.FC<InputAccountProps> = props => {
  const { passwordLoginMethods: methods, placeholder, ...inputProps } = props

  const runderInput = useMemo(() => {
    if (methods.length === 1 && methods[0] === 'phone-password')
      return (
        <InputNumber maxLength={20} placeholder={placeholder} {...inputProps} />
      )

    return <CommonInput {...inputProps} placeholder={placeholder} />
  }, [inputProps, methods, placeholder])

  return <>{runderInput}</>
}
