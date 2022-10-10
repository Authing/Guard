import React from 'react'

import { GuardProvider } from '@authing/guard-react'

import '@authing/guard-react/dist/esm/guard.min.css'

import * as facePlugin from 'face-api.js'

import RouterComponent from './router'

import './App.css'

export default function App() {
  return (
    <GuardProvider
      appId="63438f6f49cfbc1bbb37ece3"
      isSSO={true}
      // config={{
      //   socialConnections: [SocialConnectionProvider.GITHUB],
      // }}
      facePlugin={facePlugin}
    >
      <RouterComponent></RouterComponent>
    </GuardProvider>
  )
}
