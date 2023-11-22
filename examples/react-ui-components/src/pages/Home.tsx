import React from 'react'

import { Guard, GuardLocalConfig, User } from '@authing/react-ui-components'

import '@authing/react-ui-components/lib/index.min.css'

import * as facePlugin from 'face-api.js'

export default function Home() {
  const appId = '5f6265c67ff6fdae64ec516e'

  const config: Partial<GuardLocalConfig> = {
    lang: 'en-US'
  }

  const onLogin = (userInfo: User) => {
    console.log(userInfo)
  }

  return (
    <Guard
      appId={appId}
      onLogin={onLogin}
      visible={true}
      config={config}
      facePlugin={facePlugin}
    />
  )
}
