import React, { useEffect, useState } from 'react'

import { useGuard, Lang } from '@authing/guard-react'

export default function Login() {
  const guard = useGuard()

  console.log('guard: ', guard)

  const [lang, setLang] = useState<Lang>('zh-CN')

  useEffect(() => {
    guard.start('#guard').then(userInfo => {
      console.log('userInfo from guard.start: ', userInfo)
    })
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

  return <div>
    <button onClick={changeLang}>changeLang</button>
    <button onClick={changeContentCSS}>changeContentCSS</button>
    <button onClick={startRegister}>startRegister</button>
    <div id="guard"></div>
  </div>
}
