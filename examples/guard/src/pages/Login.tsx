import React, { useEffect } from 'react'

import { Guard } from '@authing/guard'

import { guardOptions } from '../config'

export default function Login () {
  const guard = new Guard(guardOptions)

  const guardEffects = async () => {
    guard.start('#guard-container').then(userInfo => {
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
    guardEffects()
  }, [])

  const onmountGuard = () => guard.unmount()

  return <>
    <div style={{ marginBottom: '100px' }}>
      <button onClick={onmountGuard}>unmount Guard Component</button>
    </div>
    
    <div id="guard-container"></div>
  </>
}
