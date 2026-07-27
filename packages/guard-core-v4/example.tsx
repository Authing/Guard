import { Guard, User, GuardLocalConfig, GuardModuleType } from './src/index'

import { React, render } from 'shim-react'

import * as facePlugin from 'face-api.js'

const App = () => {
  const appId = '6a2bb2092c6d78d527f79042'
  // const deviceId = 'DEVICE_ID' //如要使用必须使用开启元数据对的 用户池 测试

  const config: Partial<GuardLocalConfig> = {
    host:'https://katl4b6bith2-demo.genauth.localhost',
    defaultScenes: GuardModuleType.REGISTER
  }

  const onLogin = (userInfo: User) => {
    console.log(userInfo)
  }

  return (
    <Guard
      // deviceId={deviceId}
      appId={appId}
      onLogin={onLogin}
      onLoginError={error => {
        console.log(error, 'loginerror')
      }}
      visible={true}
      config={config}
      facePlugin={facePlugin}
    />
  )
}

render({
  container: document.querySelector('#root') as Element,
  element: <App />
})
