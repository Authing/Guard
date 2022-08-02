import React, { useEffect } from 'react'

import { Guard } from '../../../components'

export default function Login () {
  const effects = async () => {
    const guard = new Guard({
      appId: '62e752f0d8c681db4ed3f743',
      host: 'https://test0123456.authing.cn',
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
      // ....... 跳转
    })
  }

  useEffect(() => {
    effects()
  }, [])

  return <div>this is login Page</div>
}
