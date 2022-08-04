import React from 'react'
import { Guard } from '../../../src'

export default function Jump() {
  const guard = new Guard({
    appId: '62e752f0d8c681db4ed3f743',
    host: 'https://test0123456.authing.cn',
    redirectUri: 'http://localhost:3000/callback'
  })

  const onLogin = () => guard.startWithRedirect()

  return (
    <div>
      <div>
        <button onClick={onLogin}>登录</button>
      </div>
    </div>
  )
}
