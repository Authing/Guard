import { Guard, User, GuardLocalConfig, GuardModuleType } from './src/index'

import { React, render } from 'shim-react'

import * as facePlugin from 'face-api.js'

const App = () => {
  const appId = '69673b968c6f2e6dedb82037'
  // const deviceId = 'DEVICE_ID' //如要使用必须使用开启元数据对的 用户池 测试

  const config: Partial<GuardLocalConfig> = {
    host: 'https://wmpumbm5wj5r876787801111111.pre.authing.cn'
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
