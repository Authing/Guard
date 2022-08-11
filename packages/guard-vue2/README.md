<div align=center>
  <img width="300" src="https://files.authing.co/authing-console/authing-logo-new-20210924.svg" />
</div>

<br />

English | [简体中文](./README.zh_CN.md)

<br />

Guard is a portable authentication component provided by authing. You can embed it in any application to handle complex user authentication processes in one stop.

Prepare your Vue2 project and follow the guide to connect Guard to your Vue2 project!

## Install

From CDN:

``` shell

```

From npm:

``` shell
npm install --save @authing/guard-vue2
```

## Initialize

|Key|Type|Default|Requires
|-----|----|----|----|
|appId|String| - |Y|
|mode|normal / modal|normal|N|
|defaultScene|GuardModuleType|login|N|
|lang|zh-CN / en-US|zh-CN|N|
|isSSO|Boolean|true|N|
|host|String| - |N|
|scope|String| - |N|
|redirectUri|String| - |N|
|state|String| - |N|


``` javascript
// From CDN
const guard = new GuardFactory.Guard({
  appId: '62e22721c889dd44bad1dda2',
  host: 'https://guard-test-2022.authing.cn',
  redirectUri: 'http://localhost:3000/callback'
})

// From npm
import { GuardPlugin } from '@authing/guard-vue2'

import '@authing/guard-vue2/dist/esm/guard.min.css'

Vue.use(GuardPlugin, {
  appId: '62e22721c889dd44bad1dda2',
  host: 'https://guard-test-2022.authing.cn',
  redirectUri: 'http://localhost:3000/callback'
})
```

``` typescript
// use Guard APIs in Components
export default {
  created () {
    console.log('this.$guard: ', this.$guard)
  }
}
```

## Guard for Vue2 provides three login modes

### Embed mode

Render Guard component

``` javascript
this.$guard.start('#root').then(userInfo => {
  console.log(userInfo)
})
```

### modal mode

When the parameter 'mode' of Guard instantiation is' modal ', the modal mode is started, and the following API can be used to display and hide the guard.

``` javascript

this.$guard.show()
```

``` javascript
this.$guard.hide()
```

### Redirect mode

Login by code, redirect to login page

``` javascript
this.$guard.startWithRedirect()
```

Auto handle redirect callback

``` javascript
this.$guard.handleRedirectCallback()
```

Logout

``` javascript
this.$guard.logout()
```

## Regist events

``` javascript
this.$guard.on('load', e => {
  console.log(e)
})

this.$guard.on('login', userInfo => {
  console.log(userInfo)
})

// ......
```

## Integrate authing js sdk instance

Guard integrated AuthenticationClient, so you can access all apis of AuthenticationClient, etc:

``` javascript
this.$guard.getAuthClient().then(authClient => {
  authClient.registerByEmail()
  authClient.validateToken()
  // ...........
})
// ....
```

Refer to [Authentication SDK](https://docs.authing.cn/v2/reference/sdk-for-node/authentication/) 

## 📚 Documentation

To check out live examples and docs, visit [docs](https://docs.authing.cn/v2/reference/guard/v2/)
