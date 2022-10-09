import React, { useEffect, useState } from 'react'

import { Guard, Lang } from '@authing/guard'

import { guardOptions } from '../config'

const guard = new Guard(guardOptions)

console.log('guard: ', guard)

export default function Login () {
  const [lang, setLang] = useState<Lang>('zh-CN')
  
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

  const checkLoginStatus = async () => {
    const user = await guard.checkLoginStatus()
    console.log('user: ', user)
  }

  const onmountGuard = () => guard.unmount()

  const startRegister = () => guard.startRegister()

  const changeLang = () => {
    if (lang === 'zh-CN') {
      setLang('en-US')
    } else {
      setLang('zh-CN')
    }
  }

  useEffect(() => {
    guard.changeLang(lang)
  }, [lang])

  const getUserInfo = async() => {
    const userInfo = await guard.trackSession()
    console.log('userInfo: ', userInfo)
  }

  const onLogout = () => guard.logout()

  const showGuardModal = () => guard.show()

  return <>
    <div style={{ marginBottom: '100px' }}>
      <button onClick={onmountGuard}>unmount Guard Component</button>
      <button onClick={startRegister}>startRegister</button>
      <button onClick={changeLang}>changeLang</button>
      <button onClick={getUserInfo}>getUserInfo</button>
      <button onClick={checkLoginStatus}>checkLoginStatus</button>
      <button onClick={onLogout}>onLogout</button>
      <button onClick={showGuardModal}>show Guard Modal</button>
    </div>
    
    <div id="guard-container"></div>
  </>
}
