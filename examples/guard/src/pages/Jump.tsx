import React from 'react'
import { Guard } from '@authing/guard'

import { guardOptions } from '../config'

export default function Jump() {
  const guard = new Guard(guardOptions)

  const onLogin = () => guard.startWithRedirect()

  return (
    <div>
      <div>
        <button onClick={onLogin}>登录</button>
      </div>
    </div>
  )
}
