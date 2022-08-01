import React, { useEffect } from 'react'

import { Guard } from '../../../components'
// import { Guard } from '../../../dist/esm/guard.min.js'

export default function Login() {
  const effects = async () => {
    const guard = new Guard({
      appId: '62e22721c889dd44bad1dda2',
      host: 'https://guard-test-2022.authing.cn',
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

    guard.on('login', userInfo => {
      console.log('userInfo: ', userInfo)
      // ....... 跳转
    })
  }

  useEffect(() => {
    effects()
  }, [])

  return <div>this is login Page</div>
}
