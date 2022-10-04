import React from 'react'

import { GuardProvider } from '@authing/guard-react'

import '@authing/guard-react/dist/esm/guard.min.css'

import * as facePlugin from 'face-api.js'

import RouterComponent from './router'

export default function App() {
  return (
    <GuardProvider
      appId="Your Authing application ID"
      facePlugin={facePlugin}
    >
      <RouterComponent></RouterComponent>
    </GuardProvider>
  )
}
