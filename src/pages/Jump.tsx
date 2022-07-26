import React from 'react'
import { Guard } from '../components'

export default function Jump () {
  const guard = new Guard({
    appId: '62de1209719e5be69d3449e0',
    host: 'https://guard-demo-2022.authing.cn',
    redirectUri: 'http://localhost:3000/callback'
  })

  const onLogin = () => guard.startWithRedirect()

  return <div>
    <div><button onClick={onLogin}>登录</button></div>
  </div>
}
