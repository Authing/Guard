import React from 'react'
import { useAuthing } from 'react-guard'

export default function Jump() {
  const guard = useAuthing()

  const onLogin = () => guard.startWithRedirect()

  return (
    <div>
      <div>
        <button onClick={onLogin}>登录</button>
      </div>
    </div>
  )
}
