import Head from 'next/head'

import { useEffect } from 'react'
import { Guard } from '@authing/guard'
import '@authing/guard/dist/esm/guard.min.css'

export default function Home() {
  const guard = new Guard({
    appId: '62e22721c889dd44bad1dda2',
    host: 'https://guard-test-2022.authing.cn',
    redirectUri: 'http://localhost:3001/callback'
  })

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
