import React from 'react'

import { GuardProvider } from '@authing/guard-react18'

import '@authing/guard-react18/dist/guard.min.css'

import * as facePlugin from 'face-api.js'

import RouterComponent from './router'

import './App.css'

export default function App() {
  return (
    <GuardProvider
      appId="AUTHING_APP_ID"
      mode="modal"
      facePlugin={facePlugin}
      config={{
        socialConnectionList: ['github']
      }}
    >
      <RouterComponent></RouterComponent>
    </GuardProvider>
  )
}
