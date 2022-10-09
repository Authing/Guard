import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { useGuard } from '@authing/guard-react'

export default function Callback() {
  const history = useHistory()
  const guard = useGuard()

  const handleCallback = async () => {
    try {
      // 1. 触发 guard.handleRedirectCallback() 方法完成登录认证
      // 用户认证成功之后，我们会将用户的身份凭证存到浏览器的本地缓存中
      await guard.handleRedirectCallback()

      // 2. 处理完 handleRedirectCallback 之后，你需要先检查用户登录态是否正常
      const loginStatus = await guard.checkLoginStatus()

      if (!loginStatus) {
        return
      }

      // 3. 获取到登录用户的用户信息
      const userInfo = await guard.trackSession()

      // 你也可以重定向到你的任意业务页面，比如重定向到用户的个人中心
      // 如果你希望实现登录后跳转到同一页面的效果，可以通过在调用 startWithRedirect 时传入的自定义 state 实现
      // 之后你在这些页面可以通过 trackSession 方法获取用户登录态和用户信息

      // 示例一：跳转到固定页面
      // router.replace({
      //   name: 'CustomPage'
      // })

      // 示例二：获取自定义 state，进行特定操作
      // const state = window.location.href.state
      // const stateRelatedData = localStorage.get(`stateStorage:${state}`)
    } catch (e) {
      // ......
    }
    
    history.replace('/personal')
  }

  useEffect(() => {
    handleCallback()
  })

  return <div>This is Callback page</div>
}
