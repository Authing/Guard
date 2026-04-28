import { Guard, User, GuardLocalConfig } from './src/index'

import { React, render } from 'shim-react'

import * as facePlugin from 'face-api.js'

const App = () => {
  const appId = '69e9815348a63edc9bc8af25'
  // const deviceId = '6486be0f60e50cb92678a468' //如要使用必须使用开启元数据对的 用户池 测试

  const config: Partial<GuardLocalConfig> = {
      host:'https://hep-manuscripts.u2.hep.com.cn'
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
        console.log(error,"loginerror")
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
