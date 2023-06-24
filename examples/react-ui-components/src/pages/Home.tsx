import React from 'react'

import { Guard, GuardMode, GuardLocalConfig, User } from '@authing/react-ui-components'

import '@authing/react-ui-components/dist/esm/guard.min.css'

import * as facePlugin from 'face-api.js'

export default function Home () {
  const appId = '630ed3137dd6f2fd7001da24'

  const config: Partial<GuardLocalConfig> = {
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