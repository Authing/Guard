import { React } from 'shim-react'

import { CommonInput } from '../CommonInput'

import { IconFont } from '../IconFont'

export const InputPassword = (props: any) => {
  return (
    <CommonInput
      type="password"
      autoComplete="off"
      {...props}
      iconRender={(visible: boolean) => {
        return (
          <span
            style={{ display: 'flex', height: '100%', alignItems: 'center' }}
          >
            {visible ? (
              <IconFont type="authing-a-eye-line1" />
            ) : (
              <IconFont type="authing-a-eye-close-line1" />
            )}
          </span>
        )
      }}
    />
  )
}
