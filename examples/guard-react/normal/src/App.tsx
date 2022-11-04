import React from 'react'

import { GuardProvider } from '@authing/guard-react'

import '@authing/guard-react/dist/esm/guard.min.css'

import * as facePlugin from 'face-api.js'

import RouterComponent from './router'

import './App.css'

export default function App() {
  return (
    <GuardProvider
      appId="AUTHING_APP_ID"
      // host="https://my-authing-app.example.com"
      
      // 默认情况下，会使用你在 Authing 控制台中配置的第一个回调地址为此次认证使用的回调地址。
      // 如果你配置了多个回调地址，也可以手动指定（此地址也需要加入到应用的「登录回调 URL」中）：
      redirectUri="http://localhost:3000/callback"

      isSSO={true}
      config={{
        socialConnectionList: ['github'],
        langRange: ['zh-CN']
      }}
      facePlugin={facePlugin}
    >
      <RouterComponent></RouterComponent>
    </GuardProvider>
  )
}
