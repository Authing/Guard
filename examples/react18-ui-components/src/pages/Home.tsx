import React from 'react'

import { Guard, GuardMode, GuardLocalConfig, User } from '@authing/react18-ui-components'

import '@authing/react18-ui-components/lib/index.min.css'

import * as facePlugin from 'face-api.js'

export default function Home() {
  const appId = 'AUTHING_APP_ID'

  const config: Partial<GuardLocalConfig> = {
    mode: GuardMode.Modal,
    lang: 'en-US'
  }

  const onLogin = (userInfo: User) => {
    console.log(userInfo)
  }

  return <Guard
    appId={appId}
    onLogin={onLogin}
    visible={true}
    config={config}
    facePlugin={facePlugin}
  />
}
