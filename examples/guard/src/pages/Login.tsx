import React, { useEffect, useState } from 'react'

import { Guard, Lang } from '@authing/guard'

import { guardOptions } from '../config'

const guard = new Guard(guardOptions)

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

  const changeContentCSS = () => guard.changeContentCSS('body {background: red}')

  return <>
    <div style={{ marginBottom: '100px' }}>
      <button onClick={onmountGuard}>unmount Guard Component</button>
      <button onClick={startRegister}>startRegister</button>
      <button onClick={changeLang}>changeLang</button>
      <button onClick={changeContentCSS}>changeContentCSS</button>
    </div>
    
    <div id="guard-container"></div>
  </>
}
