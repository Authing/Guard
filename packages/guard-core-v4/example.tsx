import { Guard, User, GuardMode, GuardLocalConfig } from './src/index'

import { React, render } from 'shim-react'

import * as facePlugin from 'face-api.js'

const App = () => {
  const appId = '657ac9d85a4671fc136b2216'
  // const deviceId = '6486be0f60e50cb92678a468' //如要使用必须使用开启元数据对的 用户池 测试

  const config: Partial<GuardLocalConfig> = {
    // mode: GuardMode.Modal,
    // lang: 'en-US'
    host: 'https://ddddd.why.lixpng.top'
  }

  const onLogin = (userInfo: User) => {
    console.log(userInfo)
  }

  return (
    <Guard
      // deviceId={deviceId}
      appId={appId}
      onLogin={onLogin}
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