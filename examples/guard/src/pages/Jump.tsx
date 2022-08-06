import React from 'react'
import { Guard } from '@authing/guard'

export default function Jump() {
  const guard = new Guard({
    appId: '62e8d32e4feac0ba0a75edf5',
    host: 'https://ipehegkanbpgkdho-demo.authing.cn',
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
