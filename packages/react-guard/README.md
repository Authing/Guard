<div align=center>
  <img width="300" src="https://files.authing.co/authing-console/authing-logo-new-20210924.svg" />
</div>

<br />

React-Guard is a portable authentication component provided by authing. You can embed it in any application to handle complex user authentication processes in one stop.

Prepare your React project and follow the guide to connect authoring guard to your native JavaScript project!

## Install

From CDN:

```shell

```

From npm:

```shell

```

## Initialize

| Key          | Type            | Default | Requires |
| ------------ | --------------- | ------- | -------- |
| appId        | String          | -       | Y        |
| mode         | normal / modal  | normal  | N        |
| defaultScene | GuardModuleType | login   | N        |
| lang         | zh-CN / en-US   | zh-CN   | N        |
| isSSO        | Boolean         | true    | N        |
| host         | String          | -       | N        |
| scope        | String          | -       | N        |
| redirectUri  | String          | -       | N        |
| state        | String          | -       | N        |

```javascript
import { ReactGuard, useAuthing } from '@authing/react-guard';

const root = createRoot(document.getElementById('root'));

root.render(
  <ReactGuard
    // appId：控制台 -> 端点信息 -> App ID
    appId="APP_ID"
    // appHost：应用认证地址，控制台 -> 应用详情 -> 认证配置 -> 认证地址
    appHost="https://spa-demo-2022.authing.cn"
    // redirectUri：应用回调地址，在 Authing 完成认证后跳回的地址。控制台 -> 应用详情 -> 认证配置 -> 登录回调 URL
    redirectUri="通过 Authing 登录成功后的跳转地址"
    // 默认
    tokenEndPointAuthMethod="none"
    // 默认
    introspectionEndPointAuthMethod="none"
  >
    <App />
  </ReactGuard>
);
```

```javascript
import React from 'react';
import { useAuthing } from '@authing/react-guard';

const Component = () => {
  const guard = useAuthing();

  useEffect(() => {
    guard.start('#guard');
  }, []);

  return <div id="guard">Hello Guard !</div>;
};
```

## Guard provides three login modes

### Embed mode

Render Guard component

```javascript
guard.start('#root').then((userInfo) => {
  console.log(userInfo);
});
```

### modal mode

When the parameter 'mode' of Guard instantiation is' modal ', the modal mode is started, and the following API can be used to display and hide the guard.

```javascript
guard.show();
```

```javascript
guard.hide();
```

### Redirect mode

Login by code, redirect to login page

```javascript
guard.startWithRedirect();
```

Auto handle redirect callback

```javascript
guard.handleRedirectCallback();
```

Logout

```javascript
guard.logout();
```

## Regist events

```javascript
guard.on('load', (e) => {
  console.log(e);
});

guard.on('login', (userInfo) => {
  console.log(userInfo);
});

// ......
```

## Integrate authing js sdk instance

Guard integrated AuthenticationClient, so you can use `guard.authClient` to access all apis of AuthenticationClient, etc:

```javascript
guard.authClient.registerByEmail();
guard.authClient.validateToken();
// ....
```

Refer to [Authentication SDK](https://docs.authing.cn/v2/reference/sdk-for-node/authentication/)

## 📚 Documentation

To check out live examples and docs, visit [docs](https://docs.authing.cn/v2/reference/guard/v2/)
