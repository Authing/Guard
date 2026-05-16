import { React } from 'shim-react'

import { Input } from 'shim-antd'

import { PasswordProps, InputProps } from 'shim-antd/lib/input'

import { IconFont } from '../../IconFont'

export const InputPasswordForget = React.forwardRef<
  React.RefObject<InputProps>,
  PasswordProps
>((props, ref) => {
  return (
    <Input.Password
      autoComplete="off"
      ref={ref as any}
      {...props}
      iconRender={(visible: boolean) => (
        <span style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
          {visible ? (
            <IconFont
              type="authing-authing-eye-fill"
              style={{ color: '#44403C' }}
            />
          ) : (
            <IconFont
              type="authing-authing-eye-off-fill"
              style={{ color: '#A1A1A1' }}
            />
          )}
        </span>
      )}
      maxLength={35}
    />
  )
})
