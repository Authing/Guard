import Head from 'next/head'

import { useEffect } from 'react'
import { Guard } from '@authing/guard'
import '@authing/guard/dist/esm/guard.min.css'

import { guardOptions } from '../config'

export default function Home() {
  const guard = new Guard(guardOptions)

  const onLogin = () => guard.startWithRedirect()

  const checkLoginStatus = async () => {
    const user = await guard.checkLoginStatus()
    console.log('user: ', user)
  }

  return (
    <div>
      <button onClick={onLogin}>登录</button>
      <button onClick={checkLoginStatus}>checkLoginStatus</button>
    </div>
  )
}
