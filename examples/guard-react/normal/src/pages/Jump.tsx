import React from 'react'
import { useGuard } from '@authing/guard-react'

export default function Jump() {
  const guard = useGuard()

  const startWithRedirect = () => guard.startWithRedirect({
    // 默认情况下，会使用你在 Authing 控制台中配置的第一个回调地址为此次认证使用的回调地址。
    // 如果你配置了多个回调地址，也可以手动指定（此地址也需要加入到应用的「登录回调 URL」中）：
    redirectUri: 'http://localhost:3000/callback',
    state: 'some-random-string'
  })

  return (
    <div>
      <div>
        <button onClick={startWithRedirect}>Start With Redirect</button>
      </div>
    </div>
  )
}