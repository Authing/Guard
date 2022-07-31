<div align=center>
  <img width="300" src="https://files.authing.co/authing-console/authing-logo-new-20210924.svg" />
</div>

<br />

Guard is a portable authentication component provided by authing. You can embed it in any application to handle complex user authentication processes in one stop.

Prepare your native JavaScript project and follow the guide to connect authoring guard to your native JavaScript project!

## Install

From CDN:

``` shell

```

From npm:

``` shell

```

## Initialize

|Key|Type|Default|Requires
|-----|----|----|----|
|appId|String|''|Y|
|mode|normal / modal|normal|N|
|defaultScene|GuardModuleType|login|N|
|lang|zh-CN / en-US|zh-CN|N|
|isSSO|Boolean|true|N|
|host|String|''|N|
|scope|String|''|N|
|redirectUri|String|''|N|
|state|String|''|N|


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

## APIs

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

### Embed mode

Render Guard component

``` javascript
guard.start('#root').then(userInfo => {
  console.log(userInfo)
})
```

Regist events

``` javascript
guard.on('load', e => {
  console.log(e)
})

guard.on('login', userInfo => {
  console.log(userInfo)
})

// ......
```

### Integrate authing js sdk instance

Guard integrated AuthenticationClient, so you can use `guard.authClient` to access all apis of AuthenticationClient, etc:

``` javascript
guard.authClient.registerByEmail()
guard.authClient.validateToken()
// ....
```

Refer to [Authentication SDK](https://docs.authing.cn/v2/reference/sdk-for-node/authentication/) 

## 📚 Documentation

To check out live examples and docs, visit [docs](https://docs.authing.cn/v2/reference/guard/v2/)
