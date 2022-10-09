import React, { useEffect, useState } from 'react'

import { useGuard } from '@authing/guard-react'

export default function Login() {
  const [langCache, setLangCache] = useState('')
  const guard = useGuard()

  console.log('guard instance: ', guard)

  useEffect(() => {
    guard.start('#authing-guard-container').then(userInfo => {
      console.log('userInfo: : ', userInfo)
    })

    const langCache = localStorage.getItem('_guard_i18nextLng') || ''
    setLangCache(langCache)
  }, [])

  const changeLang = (event: any) => {
    guard.changeLang(event.target.value)
    setLangCache(event.target.value)
  }

  const changeContentCSS = () => guard.changeContentCSS('body {background: blue}')

  const startRegister = () => guard.startRegister()

  const logout = () => guard.logout()

  const getUserInfo = async () => {
    const userInfo = await guard.trackSession()
    console.log('userInfo: ', userInfo)
  }

  const refreshToken = async () => {
    const authClient = await guard.getAuthClient()
    const token = await authClient.refreshToken()
    console.log('token: ', token)
  }

  return <div>
    <select value={langCache} onChange={changeLang}>
      <option value="zh-CN">zh-CN</option>
      <option value="zh-TW">zh-TW</option>
      <option value="en-US">en-US</option>
      <option value="ja-JP">ja-JP</option>
    </select>

    <button onClick={changeContentCSS}>Change Content CSS</button>

    <button onClick={startRegister}>Start Register</button>

    <button onClick={logout}>Logout</button>

    <button onClick={getUserInfo}>Get User Info</button>

    <button onClick={refreshToken}>Refresh Token</button>

    <div id="authing-guard-container"></div>
  </div>
}
