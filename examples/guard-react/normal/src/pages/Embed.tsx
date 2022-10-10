import React, { useEffect, useState } from 'react'

import { useGuard } from '@authing/guard-react'

export default function Login() {
  const [langCache, setLangCache] = useState('')
  const guard = useGuard()

  console.log('guard instance: ', guard)

  useEffect(() => {
    // 使用 start 方法挂载 Guard 组件到你指定的 DOM 节点，登录成功后返回 userInfo
    guard.start('#authing-guard-container').then(userInfo => {
      console.log('userInfo: ', userInfo)
    })

    guard.on('load', ()=>{
      // 缓存中获取 Guard 默认语言类型
      const langCache = localStorage.getItem('_guard_i18nextLng') || 'zh-CN'
      setLangCache(langCache)
    })
  }, [])

  const changeLang = (event: any) => {
    guard.changeLang(event.target.value)
    setLangCache(event.target.value)
  }

  const changeContentCSS = () => guard.changeContentCSS('body {background: blue}')

  const startRegister = () => guard.startRegister()

  // 登出后的回调地址请在 Authing 控制台「应用详情」-「应用配置」-「登出回调 URL」中配置
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

    <button className='authing-button' onClick={changeContentCSS}>Change Content CSS</button>

    <button className='authing-button' onClick={startRegister}>Start Register</button>

    <button className='authing-button' onClick={logout}>Logout</button>

    <button className='authing-button' onClick={getUserInfo}>Get User Info</button>

    <button className='authing-button' onClick={refreshToken}>Refresh Token</button>

    <div id="authing-guard-container"></div>
  </div>
}
