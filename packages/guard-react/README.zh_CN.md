<div align=center>
  <img width="300" src="https://files.authing.co/authing-console/authing-logo-new-20210924.svg" />
</div>

<br />

简体中文 | [English](./README.md)

<br />

Guard 是 Authing 提供的一种轻便的认证组件，你可以把它嵌入在你任何的 SPA（Single Page Application）应用中，一站式处理复杂的用户认证流程。

准备好你的 React 项目，跟随引导将 Guard 接入到你的 React 项目中吧！

<br />

## 安装

使用 CDN:

``` html
<link rel="stylesheet" src="https://cdn.authing.co/packages/guard-react/5.0.0/guard.min.css" />
<script src="https://cdn.authing.co/packages/guard-react/5.0.0/guard.min.js"></script>
```

使用 NPM:

``` shell
npm install --save @authing/guard-react
```

## 初始化

|字段|类型|默认是|必传
|-----|----|----|----|
|appId|String| - |是|
|host|String| - |否|
|redirectUri|String| - |否|
|mode|normal / modal|normal|否|
|defaultScene|GuardModuleType|login|否|
|tenantId|String| - | 否 |
|lang|zh-CN / en-US|zh-CN| 否 |
|isSSO|Boolean|true| 否 |
|config|Partial<IGuardConfig>| - | 否 |


``` javascript
// 使用 CDN
const guard = new GuardFactory.Guard({
  appId: '62e22721c889dd44bad1dda2',
  host: 'https://guard-test-2022.authing.cn',
  redirectUri: 'http://localhost:3000/callback'
})

// 使用 npm
import { GuardProvider } from '@authing/guard-react'

import '@authing/guard-react/dist/esm/guard.min.css'

function App() {
  return (
    <GuardProvider
      appId="62e22721c889dd44bad1dda2"
      host="https://guard-test-2022.authing.cn"
      redirectUri="http://localhost:3000/callback"
    >
      <RouterComponent></RouterComponent>
    </GuardProvider>
  )
}
```

``` typescript
// 组件中使用 Guard 的 API
import { useGuard } from '@authing/guard-react'

const guard = useGuard()
```

## Gurad 提供三种登录模式

### 嵌入模式

渲染 Guard 组件

``` javascript
import React, { useEffect } from 'react'

import { useGuard } from '@authing/guard-react'

export default function Login() {
  const guard = useGuard()

  useEffect(() => {
    guard.start('#guard')
  }, [])

  return <div id="guard"></div>
}
```

### 弹窗模式

当 Guard 实例化的参数 `mode` 为 `modal` 时，将启动模态模式，下面的 API 可用于显示和隐藏 Guard。

``` javascript

guard.show()
```

``` javascript
guard.hide()
```

### 跳转模式

使用 code 码登录，跳转到登录页面

``` javascript
guard.startWithRedirect()
```

code 换 token，自动处理页面重定向

``` javascript
guard.handleRedirectCallback()
```

登出

``` javascript
guard.logout()
```

## 注册事件

``` javascript
guard.on('load', e => {
  console.log(e)
})

guard.on('login', userInfo => {
  console.log(userInfo)
})

// ......
```

## 集成 Authing JS SDK

Guard 集成了 AuthenticationClient，所以你可以访问 AuthenticationClient 的所有 api 等等:

``` javascript
guard.getAuthClient().then(authClient => {
  authClient.registerByEmail()
  authClient.validateToken()
  // ........
})
```

参考 [Authentication SDK](https://docs.authing.cn/v2/reference/sdk-for-node/authentication/) 

## 文档

参考详细文档说明 [docs](https://docs.authing.cn/v2/reference/guard/v3/spa.html)
