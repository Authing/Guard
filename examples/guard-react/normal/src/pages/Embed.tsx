import React, { useEffect, useState } from 'react'

import { AuthenticationClient, RefreshToken, useGuard, User } from '@authing/guard-react'

export default function Login() {
  const [langCache, setLangCache] = useState('')
  const guard = useGuard()

  // @ts-ignore
  window.guard = guard
  console.log('guard instance: ', guard)

  useEffect(() => {
    // 使用 start 方法挂载 Guard 组件到你指定的 DOM 节点，登录成功后返回 userInfo
    guard.start('#authing-guard-container').then((userInfo: User) => {
      console.log('userInfo: ', userInfo)
    })

    guard.on('load', ()=>{
      // 缓存中获取 Guard 默认语言类型
      const langCache = localStorage.getItem('_guard_i18nextLng') || 'zh-CN'
      setLangCache(langCache)
    })

    guard.on('login', (userInfo: User) => {
      console.log('userInfo in login: ', userInfo)
    })

    // @ts-ignore
    guard.on('after-change-module', (options) => {
      console.log('after-change-module options: ', options)

      const { currentModule, currentTab } = options

      if (currentModule === 'login' && currentTab === 'password') {
        guard.checkAllAgreements()
        setTimeout(() => {
          // (document.querySelector('.authing-ant-space-horizontal') as HTMLElement).style.display = 'none'
        })
      }
    })
  }, [])

  const changeLang = (event: any) => {
    guard.changeLang(event.target.value)
    setLangCache(event.target.value)
  }

  const changeContentCSS = () => guard.changeContentCSS(`
    body {
      background-color: red;
    }
  `)

  const startRegister = () => guard.startRegister()

  // 登出后的回调地址请在 Authing 控制台「应用详情」-「应用配置」-「登出回调 URL」中配置
  const logout = () => guard.logout({
    quitCurrentDevice: true // 只退出当前设备用户，其他设备不影响登录状态
  })

  const getUserInfo = async () => {
    const userInfo: User | null = await guard.trackSession()
    console.log('userInfo: ', userInfo)
  }

  const refreshToken = async () => {
    const authenticationClient: AuthenticationClient = await guard.getAuthClient()
    const refreshedToken: RefreshToken = await authenticationClient.refreshToken()
    console.log('refreshedToken: ', refreshedToken)
  }

  const changeViewToPassword = () => {
    guard.changeView('login:password')
  }

  const changeViewToPhoneCode = () => {
    guard.changeView('login:phone-code')
  }

  const changeViewToForgetPassword = () => {
    guard.changeView('forgetPassword')
  }

  const changeViewToRegister_UserName = () => {
    guard.changeView('register:username-password')
  }

  const changeViewToRegister_EmailPassword = () => {
    guard.changeView('register:email-password')
  }

  const changeViewToAppQrcode = () => {
    guard.changeView('login:app-qrcode')
  }

  const checkAllAgreements = () => {
    guard.checkAllAgreements()
  }

  const unCheckAllAgreements = () => {
    guard.unCheckAllAgreements()
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

    <button className='authing-button' onClick={changeViewToPassword}>Change View to Password</button>

    <button className='authing-button' onClick={changeViewToPhoneCode}>Change View to PhoneCode</button>

    <button className='authing-button' onClick={changeViewToForgetPassword}>Change View to ForgetPassword</button>

    <button className='authing-button' onClick={changeViewToAppQrcode}>Change View to AppQrcode</button>

    <button className='authing-button' onClick={changeViewToRegister_UserName}>Change View To Register - UserName</button>

    <button className='authing-button' onClick={changeViewToRegister_EmailPassword}>Change View To Register - EmailPassword</button>

    <button className="authing-button" onClick={checkAllAgreements}>Check All Agreements</button>

    <button className="authing-button" onClick={unCheckAllAgreements}>Uncheck All Agreements</button>

    <div id="authing-guard-container"></div>
  </div>
}
