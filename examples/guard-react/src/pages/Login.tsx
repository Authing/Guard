import React, { ChangeEvent, useEffect, useState } from 'react'

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
    console.log(event.target.value)
    guard.changeLang(event.target.value)
  }

  const changeContentCSS = () => guard.changeContentCSS('body {background: blue}')

  const startRegister = () => guard.startRegister()

  const showGuardModal = () => guard.show()

  return <div>
    <select onChange={changeLang}>
      <option value="zh-CN">zh-CN</option>
      <option value="zh-TW">zh-TW</option>
      <option value="en-US">en-US</option>
      <option value="ja-JP">ja-JP</option>
    </select>
    <button onClick={changeContentCSS}>change Content CSS</button>
    <button onClick={startRegister}>Start Register</button>
    <button onClick={showGuardModal}>Show Guard Modal</button>
    <div id="authing-guard-container"></div>
  </div>
}
