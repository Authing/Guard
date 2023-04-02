import Head from 'next/head'

import { useEffect } from 'react'
import { Guard } from '@authing/guard-react18'
import '@authing/guard-react18/dist/esm/guard.min.css'

import { guardOptions } from '../config'

export default function Login() {
  const guard = new Guard(guardOptions)

  const guardEffects = async () => {
    guard.start('#authing-guard-container').then(userInfo => {
      console.log('start userInfo: ', userInfo)
    })

    guard.on('load', (e) => {
      console.log('加载啊', e)
    })

    guard.on('login', userInfo => {
      console.log('userInfo: ', userInfo)
      // ....... 跳转
    })
  }

  useEffect(() => {
    guardEffects()
  }, [])

  const logout = () => guard.logout()

  return (
    <div>
      <button onClick={logout}>Logout</button>
      <div id="authing-guard-container"></div>
    </div>
  )
}
