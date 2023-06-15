import { Input, InputProps } from 'shim-antd'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { VirtualDropdown } from './VirtualDropdown'

const { useEffect, useState } = React

export interface InputInternationPhoneProps extends InputProps {
  areaCode: string
  onAreaCodeChange: (areaCode: string) => void
}

export const InputInternationPhone: React.FC<
  InputInternationPhoneProps
> = props => {
  const {
    areaCode,
    onAreaCodeChange,
    onChange,
    value: formValue,
    ...inputProps
  } = props
  const { t } = useTranslation()

  const [value, setValue] = useState(
    /^[^a-zA-Z]*$/.test(String(formValue)) ? formValue : ''
  )

  // 当formValue变化时候
  useEffect(() => {
    setValue(/^[^a-zA-Z]*$/.test(String(formValue)) ? formValue : '')
  }, [formValue])

  const valueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    onChange?.(e)
  }

  return (
    <>
      <Input
        autoComplete="off"
        pattern="[^a-zA-Z]*"
        value={value}
        placeholder={t('login.inputPhone') as string}
        {...inputProps}
        onChange={(e: any) => {
          let v = e.target.value
          if (!/^[^a-zA-Z]*$/.test(v)) {
            return
          }
          valueChange(e)
        }}
        prefix={
          <VirtualDropdown value={areaCode} onChange={onAreaCodeChange} />
        }
        maxLength={20}
      />
    </>
  )
}
