import { Input } from 'shim-antd'
import { InputProps } from 'shim-antd/lib/input'

import { React } from 'shim-react'

import { CommonInput } from '../CommonInput'

export interface InputNumberProps extends InputProps {
  name: string
  showType?: 'normal' | 'new' // 新版为输入后文字上移样式
}

const { useEffect, useState } = React

const isPhone = (propsValue?: string | number | readonly string[]) =>
  /^[0-9]*$/.test(String(propsValue))

export const InputNumber = React.forwardRef<any, InputNumberProps>((props, ref) => {
  const { onChange, value: propsValue, showType = 'new', ...inputProps } = props
  const [value, setValue] = useState<InputNumberProps['value']>(
    isPhone(propsValue) ? propsValue : ''
  )

  const valueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    onChange?.(e)
  }

  useEffect(() => {
    setValue(isPhone(propsValue) ? propsValue : '')
  }, [propsValue])

  return (
    <>{
      showType === 'new' ?  <CommonInput
        autoComplete="off"
        {...inputProps}
        ref={ref}
        value={value}
        type="tel"
        pattern="[0-9]*"
        onChange={(e: any) => {
          const v = e.target.value
          if (!/^[0-9]*$/.test(v)) {
            return
          }

          valueChange(e)
        }}
      /> : <Input
        autoComplete="off"
        {...inputProps}
        ref={ref}
        value={value}
        type="tel"
        pattern="[0-9]*"
        onChange={(e: any) => {
          const v = e.target.value
          if (!/^[0-9]*$/.test(v)) {
            return
          }

          valueChange(e)
        }}
      />
    }</>
  )
})
