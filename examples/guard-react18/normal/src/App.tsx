import React from 'react'

import { GuardProvider } from '@authing/guard-react18'

import '@authing/guard-react/dist/esm/guard.min.css'

import * as facePlugin from 'face-api.js'

import RouterComponent from './router'

import './App.css'

export default function App() {
  return (
    <GuardProvider
      appId="AUTHING_APP_ID"
      // host="https://my-authing-app.example.com"
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
