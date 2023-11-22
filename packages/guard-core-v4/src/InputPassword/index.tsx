import { Input } from 'shim-antd'

// import '@antd-lib-style/input/style/index.less'

import { React } from 'shim-react'

import { IconFont } from '../IconFont'

export const InputPassword = (props: any) => {
  return (
    <Input.Password
      autoComplete="off"
      {...props}
      iconRender={(visible: boolean) => (
        <span style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
          {visible ? (
            <IconFont type="authing-a-eye-line1" />
          ) : (
            <IconFont type="authing-a-eye-close-line1" />
          )}
        </span>
      )}
    />
  )
}
