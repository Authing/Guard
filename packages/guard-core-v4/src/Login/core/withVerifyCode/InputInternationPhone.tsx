import { Input, InputProps } from 'shim-antd'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { VirtualDropdown } from './VirtualDropdown'
import {
  internationalPhoneCountries,
  internationalPhoneOptions,
  getPhoneInputValue,
  toPhoneFormValue
} from '../../../_utils/internationalPhone'

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
  const usesNanp = internationalPhoneCountries.some(
    country => country.iso === areaCode && country.phoneCountryCode === '+1'
  )

  const initialValue = getPhoneInputValue(areaCode, String(formValue ?? ''))
  const [selection, setSelection] = useState(initialValue.selection)
  const [value, setValue] = useState(initialValue.value)
  const selected = internationalPhoneOptions.find(
    option => option.selection === selection
  )

  useEffect(() => {
    const next = getPhoneInputValue(areaCode, String(formValue ?? ''))
    setValue(next.value)
    setSelection(previous => {
      const current = internationalPhoneOptions.find(
        option => option.selection === previous
      )
      // Keep a manually selected area code while the field is empty or incomplete.
      return current?.iso === areaCode && next.value === String(formValue ?? '')
        ? previous
        : next.selection
    })
  }, [formValue, areaCode])

  const emitValue = (
    next: string,
    event?: React.ChangeEvent<HTMLInputElement>
  ) => {
    // The visible subscriber number differs from the national number stored in the form.
    onChange?.({
      ...event,
      target: { ...event?.target, value: next },
      currentTarget: { ...event?.currentTarget, value: next }
    } as React.ChangeEvent<HTMLInputElement>)
  }

  const selectPrefix = (nextSelection: string) => {
    const next = internationalPhoneOptions.find(
      option => option.selection === nextSelection
    )
    if (!next || nextSelection === selection) return
    setSelection(nextSelection)
    // Clear on country/prefix changes so an old number is never silently reassigned.
    setValue('')
    if (value) emitValue('')
    onAreaCodeChange(next.iso)
  }

  return (
    <>
      <Input
        autoComplete="off"
        pattern="[^a-zA-Z]*"
        value={value}
        {...inputProps}
        placeholder={
          selected?.areaCode
            ? (t('login.inputSubscriberPhone') as string)
            : usesNanp
            ? (t('login.inputPhoneWithAreaCode') as string)
            : inputProps.placeholder ?? (t('login.inputPhone') as string)
        }
        onChange={(e: any) => {
          let v = e.target.value
          if (!/^[^a-zA-Z]*$/.test(v)) {
            return
          }
          const formValue = toPhoneFormValue(selection, v)
          const next = getPhoneInputValue(areaCode, formValue)
          setValue(next.value)
          if (v.replace(/[\s().-]/g, '').length >= 10)
            setSelection(next.selection)
          emitValue(formValue, e)
        }}
        prefix={<VirtualDropdown value={selection} onChange={selectPrefix} />}
        maxLength={20}
      />
    </>
  )
}
