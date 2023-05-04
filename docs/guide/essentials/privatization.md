# 私有化部署

如果你是通过『私有化部署』的方式使用 Authing 服务，需要指定你私有化的端点（不带 Path），具体方式如下：

:::: tabs :options="{ useUrlFragment: false }"

::: tab React

```tsx
// App.tsx

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
// main.js
import Vue from "vue";
import { GuardPlugin } from "@authing/guard-vue2";
import "@authing/guard-vue2/dist/esm/guard.min.css";

Vue.use(GuardPlugin, {
  appId: "AUTHING_APP_ID",
  // 如果你使用的是私有化部署的 Authing 服务，需要传入自定义 host，如:
  // host: 'https://my-authing-app.example.com',

  // 默认情况下，会使用你在 Authing 控制台中配置的第一个回调地址为此次认证使用的回调地址。
  // 如果你配置了多个回调地址，也可以手动指定（此地址也需要加入到应用的「登录回调 URL」中）：
  // redirectUri: "YOUR_REDIRECT_URI"
});
```

:::

::: tab Vue3

```typescript
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-vue3/normal/src/main.ts
// main.ts
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
    // redirectUri: "YOUR_REDIRECT_URI"
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
      // redirectUri: "YOUR_REDIRECT_URI"
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
  // redirectUri: "YOUR_REDIRECT_URI"
});
```
:::

::::

如果你不清楚具体的操作方式，请直接在你的私有化服务群中联系相应的 Authing 工作人员，他们将为你提供直接支持。

::: hint-info
你可能感兴趣：<a href="https://docs.authing.cn/v2/guides/deployment/" target="_blank">私有化部署方案</a>
:::