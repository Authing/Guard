import React from 'react'
import { Guard } from '@authing/guard'

import { guardOptions } from '../config'

export default function Jump() {
  const guard = new Guard(guardOptions)

  const onLogin = () => guard.startWithRedirect()

  const checkLoginStatus = async () => {
    const user = await guard.checkLoginStatus()
    console.log('user: ', user)
  }

  return (
    <div>
      <div>
        <button onClick={onLogin}>登录</button>
        <button onClick={checkLoginStatus}>checkLoginStatus</button>
      </div>
    </div>
  )
}
