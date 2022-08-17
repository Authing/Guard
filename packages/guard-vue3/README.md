<div align=center>
  <img width="300" src="https://files.authing.co/authing-console/authing-logo-new-20210924.svg" />
</div>

<br />

English | [简体中文](./README.zh_CN.md)

<br />

Guard is a portable authentication component provided by authing. You can embed it in any application to handle complex user authentication processes in one stop.

Prepare your Vue3 project and follow the guide to connect Guard to your Vue3 project!

## Install

From CDN:

``` html
<link rel="stylesheet" src="https://cdn.authing.co/packages/guard-vue3/5.0.0/guard.min.css" />
<script src="https://cdn.authing.co/packages/guard-vue3/5.0.0/guard.min.js"></script>
```

From NPM:

``` shell
npm install --save @authing/guard-vue3
```

## Initialize

|Key|Type|Default|Requires
|-----|----|----|----|
|appId|String| - |Y|
|mode|normal / modal|normal|N|
|defaultScene|GuardModuleType|login|N|
|align|none / left / center / right | none | N | Guard default position|
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
import { createApp } from 'vue'

import { GuardPlugin } from '@authing/guard-vue3'

import '@authing/guard-vue3/dist/esm/guard.min.css'

import App from './App.vue'

const app = createApp(App)

app.use(
  createGuard({
    appId: '62e22721c889dd44bad1dda2',
    host: 'https://guard-test-2022.authing.cn',
    redirectUri: 'http://localhost:3000/callback'
  })
)
```

``` html
// use Guard APIs in Components

// Composition API
<script scoped setup>
import { useGuard } from '@authing/guard-vue3'

const guard = useGuard()

guard.start('#home-container')
</script>


// Options API
<script scoped>
export default {
  mounted () {
    this.$guard.start('#home-container')
  }
}
</script>
```

## Guard for Vue3 provides three login modes

### Embed mode

Render Guard component

``` javascript
import { onMounted } from 'vue'

import { useGuard } from '@authing/guard-vue3'

const guard = useGuard()

onMounted(() => {
  guard.start('#home-container')
})
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
  // ..........
})
// ....
```

Refer to [Authentication SDK](https://docs.authing.cn/v2/reference/sdk-for-node/authentication/) 

## 📚 Documentation

To check out live examples and docs, visit [docs](https://docs.authing.cn/v2/reference/guard/v3/spa.html)
