import React, { useEffect, useState } from 'react'

import { useGuard, Lang } from '@authing/guard-react'

export default function Login() {
  const guard = useGuard()

  console.log('guard: ', guard)

  const [lang, setLang] = useState<Lang>('zh-CN')

  const checkLoginStatus = async () => {
    const authClient = await guard.getAuthClient()

    const userInfo = await authClient.getCurrentUser()
    console.log('token: ', userInfo && userInfo?.token)

    const status = await authClient.checkLoginStatus(userInfo?.token as string)
    console.log('------ status: ', status)
  }

  useEffect(() => {
    guard.start('#guard').then(userInfo => {
      console.log('userInfo from guard.start: ', userInfo)
    })

    guard.on('login', userInfo => {
      console.log('userInfo: ', userInfo)
    })

    checkLoginStatus()
  }, [])

  const changeLang = () => {
    if (lang === 'zh-CN') {
      setLang('en-US')
    } else {
      setLang('zh-CN')
    }
  }

  useEffect(() => {
    console.log(lang)
    guard.changeLang(lang)
  }, [lang])

  const changeContentCSS = () => guard.changeContentCSS('body {background: blue}')

  const startRegister = () => guard.startRegister()

  const showGuardModal = () => guard.show()

  const logout = () => guard.logout()

  return <div>
    <button onClick={changeLang}>changeLang</button>
    <button onClick={changeContentCSS}>changeContentCSS</button>
    <button onClick={startRegister}>startRegister</button>
    <button onClick={showGuardModal}>show Guard Modal</button>
    <button onClick={logout}>logout</button>
    <div id="guard"></div>
  </div>
}
