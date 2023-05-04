# 第三方身份源登录

**Authing 目前支持 20+ 种第三方身份源登录方式，基本囊括所有常用的身份源：**

- [社会化身份源](https://docs.authing.cn/v2/guides/connections/social.html)： Google、GitHub、微信、QQ、微博、飞书、企业微信、钉钉、AD、Azure AD...
- [基于认证协议的身份服务](https://docs.authing.cn/v2/connections/custom-social-provider/)： OIDC、OAuth2.0、SAML、CAS...

你可以点击上面的链接查看 Authing 支持的所有第三方身份源，并根据你的实际需要进行选择。选好你需要使用的身份源后，请根据下面的引导完成接入：

1. 你需要在 Authing 控制台完成所需身份源的配置。

2. 使用下面的方法来控制配置完成的身份源的展示与隐藏。

此处以 Github 身份源为例：

:::: tabs :options="{ useUrlFragment: false }"

::: tab React

```tsx
// React 16 / 17
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-react/normal/src/App.tsx
import { GuardProvider } from "@authing/guard-react";
import "@authing/guard-react/dist/esm/guard.min.css";

// React 18
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-react18/normal/src/App.tsx
// import { GuardProvider } from "@authing/guard-react18";
// import "@authing/guard-react18/dist/esm/guard.min.css";

import React from "react";
// 用户业务根组件
import RouterComponent from "./router";

export default function App() {
  return (
    <GuardProvider
      appId="AUTHING_APP_ID"
      // 如果你使用的是私有化部署的 Authing 服务，需要传入自定义 host，如:
      // host="https://my-authing-app.example.com"

      // 默认情况下，会使用你在 Authing 控制台中配置的第一个回调地址为此次认证使用的回调地址。
      // 如果你配置了多个回调地址，也可以手动指定（此地址也需要加入到应用的「登录回调 URL」中）：
      // redirectUri="YOUR_REDIRECT_URI"
      config={{
        socialConnectionList: ["github"],
      }}
    >
      <RouterComponent></RouterComponent>
    </GuardProvider>
  );
}
```

:::

::: tab Vue2

```javascript
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-vue2/normal/src/main.js
import Vue from "vue";
import { GuardPlugin } from "@authing/guard-vue2";
import "@authing/guard-vue2/dist/esm/guard.min.css";

Vue.use(GuardPlugin, {
  appId: "AUTHING_APP_ID",
  // 如果你使用的是私有化部署的 Authing 服务，需要传入自定义 host，如:
  // host: 'https://my-authing-app.example.com',

  // 默认情况下，会使用你在 Authing 控制台中配置的第一个回调地址为此次认证使用的回调地址。
  // 如果你配置了多个回调地址，也可以手动指定（此地址也需要加入到应用的「登录回调 URL」中）：
  // redirectUri: "YOUR_REDIRECT_URI",
  config: {
    socialConnectionList: ["github"],
  },
});
```

:::

::: tab Vue3

```typescript
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-vue3/normal/src/main.ts
import { createApp } from "vue";
import { createGuard } from "@authing/guard-vue3";
import "@authing/guard-vue3/dist/esm/guard.min.css";

const app = createApp(App);

app.use(
  createGuard({
    appId: "AUTHING_APP_ID",
    // 如果你使用的是私有化部署的 Authing 服务，需要传入自定义 host，如:
    // host: 'https://my-authing-app.example.com',

    // 默认情况下，会使用你在 Authing 控制台中配置的第一个回调地址为此次认证使用的回调地址。
    // 如果你配置了多个回调地址，也可以手动指定（此地址也需要加入到应用的「登录回调 URL」中）：
    // redirectUri: "YOUR_REDIRECT_URI",
    config: {
      socialConnectionList: ["github"],
    },
  })
);
```

:::

::: tab Angular

```typescript
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-angular/normal/src/app/app.module.ts
// app.module.ts
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { GuardModule } from "@authing/guard-angular";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GuardModule.forRoot({
      appId: "AUTHING_APP_ID",
      // 如果你使用的是私有化部署的 Authing 服务，需要传入自定义 host，如:
      // host: 'https://my-authing-app.example.com',

      // 默认情况下，会使用你在 Authing 控制台中配置的第一个回调地址为此次认证使用的回调地址。
      // 如果你配置了多个回调地址，也可以手动指定（此地址也需要加入到应用的「登录回调 URL」中）：
      // redirectUri: "YOUR_REDIRECT_URI",
      config: {
        socialConnectionList: ["github"],
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

:::

::: tab CDN
```javascript
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard/normal/embed.html
const guard = new GuardFactory.Guard({
  appId: "AUTHING_APP_ID",
  // 如果你使用的是私有化部署的 Authing 服务，需要传入自定义 host，如:
  // host: 'https://my-authing-app.example.com',

  // 默认情况下，会使用你在 Authing 控制台中配置的第一个回调地址为此次认证使用的回调地址。
  // 如果你配置了多个回调地址，也可以手动指定（此地址也需要加入到应用的「登录回调 URL」中）：
  // redirectUri: "YOUR_REDIRECT_URI",
  config: {
    socialConnectionList: ["github"],
  },
});
```
:::

::::

::: hint-info
社会化登录全部有效值请参考：[ISocialConnectionProvider](../types.html#isocialconnectionprovider)
:::
