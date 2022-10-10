import React, { useEffect } from 'react'

import { useGuard } from '@authing/guard-react'

export default function Login() {
  const guard = useGuard()

  const showGuard = () => guard.show()

  useEffect(() => {
    // 挂载模态框，当用户完成登录之后，你可以获取到用户信息
    guard.start('#authing-guard-container').then(userInfo => {
      console.log('userInfo: ', userInfo)
    })

    setTimeout(() => {
      guard.hide()
    }, 2000)
  }, [])

  return <div>
    <button className='authing-button' onClick={showGuard}>Show Guard</button>

    <div>模态窗口打开后会在 2 秒内调用 hide 方法关闭模态窗口，用于展示 hide 方法的效果</div>
    <div>模态框自动关闭后，可以点击 Show Guard 按钮再次显示</div>

    <div id="authing-guard-container"></div>
  </div>
}
