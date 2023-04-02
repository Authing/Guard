<div align=center>
  <img width="300" src="https://files.authing.co/authing-console/authing-logo-new-20210924.svg" />
</div>

<br />

English | [简体中文](./README.zh_CN.md)

<br />

Guard is a portable authentication component provided by authing. You can embed it in any application to handle complex user authentication processes in one stop.

Prepare your native JavaScript project and follow the guide to connect Guard to your native JavaScript project!

## Install

From CDN:

``` html
<link rel="stylesheet" href="https://cdn.authing.co/packages/guard/5.0.7/guard.min.css" />
<script src="https://cdn.authing.co/packages/guard/5.0.7/guard.min.js"></script>
```

From NPM:

``` shell
npm install --save @authing/guard
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
const guard = new Guard({
  appId: '62e22721c889dd44bad1dda2',
  host: 'https://guard-test-2022.authing.cn',
  redirectUri: 'http://localhost:3000/callback'
})
```

## Guard provides three login modes

### Embed mode

Render Guard component

``` javascript
guard.start('#root').then(userInfo => {
  console.log(userInfo)
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
  // .........
})
// ....
```

Refer to [Authentication SDK](https://docs.authing.cn/v2/reference/sdk-for-node/authentication/) 

## Documentation

To check out live examples and docs, visit [docs](https://docs.authing.cn/v2/reference/guard/v3/mpa.html)
