import Head from 'next/head'

import { useEffect } from 'react'
import { Guard } from '@authing/guard-react'
import '@authing/guard-react/dist/guard.min.css'

import { guardOptions } from '../config'

export default function Login() {
  const guard = new Guard(guardOptions)

  const guardEffects = async () => {
    guard.start('#guard-container').then(userInfo => {
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

  return (
    <div id="guard-container"></div>
  )
}
