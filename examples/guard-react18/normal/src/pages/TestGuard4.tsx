import React from 'react'

import { Guard } from '@authing/react18-components'

import "@authing/react18-components/lib/index.min.css"

export default function TestGuard4 () {
  const appId = "6336769084256bd80d06144e"

  const onLogin = (userInfo: any) => {
    console.log(userInfo)
  }

  return (
    <Guard appId={appId} onLogin={onLogin} visible={true}  />
  )
}