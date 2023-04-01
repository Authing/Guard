import { InputProps } from 'shim-antd/lib/input'

import { React } from 'shim-react'

import { CommonInput } from '../../../CommonInput'

import { VirtualDropdown } from './VirtualDropdown'

export interface InputInternationPhoneProps extends InputProps {
  areaCode: string
  onAreaCodeChange: (areaCode: string) => void
}

const { useEffect, useState } = React

export const InputInternationPhone: React.FC<InputInternationPhoneProps> = props => {
  const {
    areaCode,
    onAreaCodeChange,
    onChange,
    value: formValue,
    placeholder,
    ...inputProps
  } = props

  const [value, setValue] = useState(/^[^a-zA-Z]*$/.test(String(formValue)) ? formValue : '')

  // 当formValue变化时候
  useEffect(() => {
    setValue(/^[^a-zA-Z]*$/.test(String(formValue)) ? formValue : '')
  }, [formValue])

  const valueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    onChange?.(e)
  }

  return (
    <div className="authing-internal-content">
      <VirtualDropdown value={areaCode} onChange={onAreaCodeChange} />
      <CommonInput
        autoComplete="off"
        pattern="[^a-zA-Z]*"
        value={value}
        placeholder={placeholder}
        {...inputProps}
        onChange={(e: any) => {
          const v = e.target.value
          if (!/^[^a-zA-Z]*$/.test(v)) {
            return
          }
          valueChange(e)
        }}
        maxLength={20}
      />
    </div>
  )
}
