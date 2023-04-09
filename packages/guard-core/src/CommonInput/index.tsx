import { Input, InputProps } from 'shim-antd'

import { React } from 'shim-react'

import './styles.less'

const { useEffect, useState } = React

export const CommonInput = (props: InputProps & { fieldcontext?: any; ref?: any } & {name: string}) => {
  const { onFocus, onBlur, fieldcontext, onChange } = props
  const [value, setValue] = useState('')

  const onItemFocus = (e: any) => {
    onFocus?.(e)
    fieldcontext?.setStatus?.('focus')
  }

  const onItemBlur = (e: any) => {
    onBlur?.(e)
    if (!value) {
      fieldcontext?.setStatus?.('blur')
    }
  }

  const onItemChange = (e: any) => {
    setValue(e.target.value)
    onChange?.(e)
  }

  // value 有值为上下布局
  useEffect(() => {
    if (props.value) {
      fieldcontext?.setStatus?.('focus')
    }
  }, [props.value, fieldcontext])

  if (props.type === 'password') {
    return (
      <div className="authing-common-input">
        <Input.Password
          {...props}
          onFocus={onItemFocus}
          onBlur={onItemBlur}
          onChange={onItemChange}
          placeholder=""
        />
        <span className="authing-common-input-label">{props.placeholder}</span>
      </div>
    )
  }

  return (
    <div className={`authing-common-input ${!props.placeholder && 'authing-single-line'}`}>
      <Input
        {...props}
        ref={props.ref}
        onFocus={onItemFocus}
        onBlur={onItemBlur}
        onChange={onItemChange}
        placeholder=""
      />
      <span className="authing-common-input-label">{props.placeholder}</span>
    </div>
  )
}
