<div align=center>
  <img width="300" src="https://files.authing.co/authing-console/authing-logo-new-20210924.svg" />
</div>

<br />

English | [简体中文](./README.zh_CN.md)

<br />

Guard is a portable authentication component provided by authing. You can embed it in any application to handle complex user authentication processes in one stop.

Prepare your React project and follow the guide to connect Guard to your React project!

## Install

``` shell
npm install --save @authing/guard-react
```

## Initialize

|Key|Type|Default|Requires
|-----|----|----|----|
|appId|String| - |Y|
|host|String| - |N|
|redirectUri|String| - |N|
|mode|normal / modal|normal|N|
|defaultScene|GuardModuleType|login|N|
|tenantId|String| - | N |
|lang|zh-CN / en-US|zh-CN|N|
|isSSO|Boolean|true|N|
|config|Partial<IGuardConfig>| - | N |


``` javascript
// From CDN
const guard = new GuardFactory.Guard({
  appId: '62e22721c889dd44bad1dda2',
  host: 'https://guard-test-2022.authing.cn',
  redirectUri: 'http://localhost:3000/callback'
})

// From npm
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
// use Guard APIs in Components
import { useGuard } from '@authing/guard-react'

const guard = useGuard()
```

## Guard for React provides three login modes

### Embed mode

Render Guard component

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

### modal mode

When the parameter 'mode' of Guard instantiation is' modal ', the modal mode is started, and the following API can be used to display and hide the guard.

``` javascript

guard.show()
```

``` javascript
guard.hide()
```

### Redirect mode

Login by code, redirect to login page

``` javascript
guard.startWithRedirect()
```

Auto handle redirect callback

``` javascript
guard.handleRedirectCallback()
```

Logout

``` javascript
guard.logout()
```

## Regist events

``` javascript
guard.on('load', e => {
  console.log(e)
})

guard.on('login', userInfo => {
  console.log(userInfo)
})

// ......
```

## Integrate authing js sdk instance

Guard integrated AuthenticationClient, so you can access all apis of AuthenticationClient, etc:

``` javascript
guard.getAuthClient().then(authClient => {
  authClient.registerByEmail()
  authClient.validateToken()
  // ........
})
// ....
```

Refer to [Authentication SDK](https://docs.authing.cn/v2/reference/sdk-for-node/authentication/) 

## 📚 Documentation

To check out live examples and docs, visit [docs](https://docs.authing.cn/v2/reference/guard/v3/spa.html)
