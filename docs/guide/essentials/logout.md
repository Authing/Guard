# 退出登录

``` ts
class Guard {
  async logout(params: LogoutParams = {}): void
}
```

::: hint-info
根据你的具体使用场景，退出登录分为 **单应用登出** 和 **SSO 单点登出** 两种。
:::

## 单应用登出

:::: tabs :options="{ useUrlFragment: false }"

::: tab React

```tsx
// React 16 / 17
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-react/normal/src/pages/Embed.tsx
import { useGuard } from "@authing/guard-react";

// React 18
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-react18/normal/src/pages/Embed.tsx
// import { useGuard } from "@authing/guard-react18";

import React from "react";

export default function Logout() {
  const guard = useGuard();

  // 登出后的回调地址请在 Authing 控制台应用 -> 自建应用 -> 应用详情 -> 应用配置 -> 登出回调 URL 中配置
  const onLogout = () => guard.logout();

  return (
    <div>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}
```

:::

::: tab Vue2

```javascript
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-vue2/normal/src/views/Embed.vue
export default {
  methods: {
    // 登出后的回调地址请在 Authing 控制台应用 -> 自建应用 -> 应用详情 -> 应用配置 -> 登出回调 URL 中配置
    logout() {
      this.$guard.logout();
    },
  },
};
```

:::

::: tab Vue3

```typescript
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-vue3/normal/src/views/Embed.vue
import { useGuard } from "@authing/guard-vue3";

const guard = useGuard();

// 登出后的回调地址请在 Authing 控制台应用 -> 自建应用 -> 应用详情 -> 应用配置 -> 登出回调 URL 中配置
const logout = () => guard.logout();
```

:::

::: tab Angular

```typescript
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-angular/normal/src/app/pages/embed/embed.component.ts
import { Component } from "@angular/core";
import { GuardService } from "@authing/guard-angular";

@Component({
  selector: "embed-container",
  templateUrl: "./embed.component.html",
  styleUrls: ["./embed.component.css"]
})
export class LoginComponent {
  constructor(private guard: GuardService) {}

  onLogout() {
    // 登出后的回调地址请在 Authing 控制台应用 -> 自建应用 -> 应用详情 -> 应用配置 -> 登出回调 URL 中配置
    this.guard.client.logout();
  }
}
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

function Logout() {
  // 登出后的回调地址请在 Authing 控制台应用 -> 自建应用 -> 应用详情 -> 应用配置 -> 登出回调 URL 中配置
  guard.logout();
}
```

:::
::::

## SSO 单点登出

要实现单点登出，只需在初始化 Authing Guard 时，设置 `isSSO` 为 `true` 即可。

:::hint-info
相关参考：[SSO 单点登录](./sso.md)
:::

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
// 项目根组件
import RouterComponent from "./router";

function App() {
  return (
    <GuardProvider
      appId="AUTHING_APP_ID"
      isSSO={true}
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

```tsx
// React 16 / 17
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-react/normal/src/pages/Embed.tsx
import { useGuard } from "@authing/guard-react";

// React 18
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-react18/normal/src/pages/Embed.tsx
// import { useGuard } from "@authing/guard-react18";

import React from "react";

export default function Logout() {
  const guard = useGuard();

  // 登出后的回调地址请在 Authing 控制台 -> 应用详情 -> 应用配置 -> 登出回调 URL 中配置
  const onLogout = () => guard.logout();

  return (
    <div>
      <button onClick={onLogout}>Logout</button>
    </div>
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
  isSSO: true,
  // 如果你使用的是私有化部署的 Authing 服务，需要传入自定义 host，如:
  // host: 'https://my-authing-app.example.com',

  // 默认情况下，会使用你在 Authing 控制台中配置的第一个回调地址为此次认证使用的回调地址。
  // 如果你配置了多个回调地址，也可以手动指定（此地址也需要加入到应用的「登录回调 URL」中）：
  // redirectUri: "YOUR_REDIRECT_URI"
});
```

```javascript
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-vue2/normal/src/views/Embed.vue
export default {
  methods: {
    logout() {
      // 登出后的回调地址请在 Authing 控制台 -> 应用详情 -> 应用配置 -> 登出回调 URL 中配置
      this.$guard.logout();
    },
  },
};
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
    isSSO: true,
    // 如果你使用的是私有化部署的 Authing 服务，需要传入自定义 host，如:
    // host: 'https://my-authing-app.example.com',

    // 默认情况下，会使用你在 Authing 控制台中配置的第一个回调地址为此次认证使用的回调地址。
    // 如果你配置了多个回调地址，也可以手动指定（此地址也需要加入到应用的「登录回调 URL」中）：
    // redirectUri: "YOUR_REDIRECT_URI"
  })
);
```

```typescript
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-vue3/normal/src/views/Embed.vue
import { useGuard } from "@authing/guard-vue3";

const guard = useGuard();

// 登出后的回调地址请在 Authing 控制台 -> 应用详情 -> 应用配置 -> 登出回调 URL 中配置
const logout = () => guard.logout();
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
      isSSO: true,
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

```typescript
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-angular/normal/src/app/pages/embed/embed.component.ts
import { Component } from "@angular/core";
import { GuardService } from "@authing/guard-angular";

@Component({
  selector: "embed-container",
  templateUrl: "./embed.component.html",
  styleUrls: ["./embed.component.css"]
})
export class LoginComponent {
  constructor(private guard: GuardService) {}

  logout() {
    this.guard.client.logout();
  }
}
```

:::

::: tab CDN

```javascript
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard/normal/embed.html
const guard = new GuardFactory.Guard({
  appId: "AUTHING_APP_ID",
  isSSO: true,
  // 如果你使用的是私有化部署的 Authing 服务，需要传入自定义 host，如:
  // host: 'https://my-authing-app.example.com',

  // 默认情况下，会使用你在 Authing 控制台中配置的第一个回调地址为此次认证使用的回调地址。
  // 如果你配置了多个回调地址，也可以手动指定（此地址也需要加入到应用的「登录回调 URL」中）：
  // redirectUri: "YOUR_REDIRECT_URI"
});

function Logout() {
  // 登出后的回调地址请在 Authing 控制台 -> 应用详情 -> 应用配置 -> 登出回调 URL 中配置
  guard.logout();
}
```
:::

::::
