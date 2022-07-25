import React, { useState, useEffect } from 'react'

import { Guard } from '../components'

export default function Login () {
  const [userInfo, setUserInfo] = useState('')

  const effects = async () => {
    const guard = new Guard({
      appId: '62de1209719e5be69d3449e0',
      appHost: 'https://guard-demo-2022.authing.cn',
      redirectUri: 'http://localhost:3000/callback'
    })

    guard.start('#root').then(userInfo => {
      console.log('start userInfo: ', userInfo)
    })

    guard.trackSession().then(res => {
      console.log('trackSession res: ', res)
    })

    // guard.startWithRedirect()

    const updateIdTokenRes = await guard.updateIdToken()
    console.log('updateIdTokenRes: ', updateIdTokenRes)

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
