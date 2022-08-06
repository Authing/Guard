import React from 'react'
import { useGuard } from '@authing/guard-react'

export default function Jump() {
  const guard = useGuard()

  const onLogin = () => guard.startWithRedirect()

  return (
    <div>
      <div>
        <button onClick={onLogin}>登录</button>
      </div>
    </div>
  )
}
