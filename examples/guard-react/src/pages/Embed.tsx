import React, { useEffect } from 'react'

import { useGuard } from '@authing/guard-react'

export default function Login() {
  const guard = useGuard()

  console.log('guard instance: ', guard)

  useEffect(() => {
    guard.start('#authing-guard-container').then(userInfo => {
      console.log('userInfo: : ', userInfo)
    })
  }, [])

  const changeLang = (event: any) => {
    guard.changeLang(event.target.value)
  }

  const changeContentCSS = () => guard.changeContentCSS('body {background: blue}')

  const startRegister = () => guard.startRegister()

  const logout = () => guard.logout()

  return <div>
    <label>Change Lang</label>
    <select onChange={changeLang}>
      <option value="zh-CN">zh-CN</option>
      <option value="zh-TW">zh-TW</option>
      <option value="en-US">en-US</option>
      <option value="ja-JP">ja-JP</option>
    </select>

    <button onClick={changeContentCSS}>Change Content CSS</button>

    <button onClick={startRegister}>Start Register</button>

    <button onClick={logout}>Logout</button>

    <div id="authing-guard-container"></div>
  </div>
}
