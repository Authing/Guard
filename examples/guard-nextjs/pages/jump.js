import Head from 'next/head'

import { useEffect } from 'react'
import { Guard } from '@authing/guard-react'
import '@authing/guard-react/dist/guard.min.css'

import { guardOptions } from '../config'

export default function Jump() {
  const guard = new Guard(guardOptions)

  const onLogin = () => guard.startWithRedirect()

  const checkLoginStatus = async () => {
    const loginStatus = await guard.checkLoginStatus()
    console.log('loginStatus: ', loginStatus)
  }

  return (
    <div>
      <button onClick={onLogin}>登录</button>
      <button onClick={checkLoginStatus}>checkLoginStatus</button>
    </div>
  )
}
