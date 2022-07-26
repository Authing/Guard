import React, { useEffect } from 'react'

import { Guard } from '../components'

export default function Login () {
  const effects = async () => {
    const guard = new Guard({
      appId: '62de1209719e5be69d3449e0',
      host: 'https://guard-demo-2022.authing.cn',
      redirectUri: 'http://localhost:3000/callback'
    })

    guard.start('#root').then(userInfo => {
      console.log('start userInfo: ', userInfo)
    })

    guard.on('load', (e: any) => {
      console.log('加载啊', e)
    })

    guard.on('close', () => {
      setTimeout(() => {
        guard.show()
      }, 2000)
    })

    guard.on('login', (userInfo) => {
      console.log('userInfo: ', userInfo)
    })
  }

  useEffect(() => {
    effects()
  }, [])

  return <div>this is login Page</div>
}
