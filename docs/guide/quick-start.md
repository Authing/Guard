# 快速开始

## 使用之前

高效的开发，离不开基础工程的搭建。在开始使用 Guard 之前，我们也假设你已经写过 React / Vue / Angular ，并掌握了 webpack 基础配置方式及相关前端框架的基本内容。

## 使用推荐工程

我们为你准备好了基础工程，以此为基础开发，可以为你省去大量配置和调试环境的时间。可前往 [examples](https://github.com/Authing/Guard/tree/master/examples) 获取对应的代码。

如果你使用了我们推荐的工程，可以略过下面的内容直接进入开发阶段，我们也推荐使用这套工程来构建你的项目。

如果你希望自己配置或使用其它工程，请继续往下阅读。

## 引入 Guard

:::: tabs :options="{ useUrlFragment: false }"
::: tab React
```tsx
// App.tsx

// React 16 / 17
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-react/normal/src/App.tsx
import { GuardProvider } from '@authing/guard-react'

import '@authing/guard-react/dist/esm/guard.min.css'

// React 18
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-react18/normal/src/App.tsx
// import { GuardProvider } from '@authing/guard-react18'
// import '@authing/guard-react18/dist/esm/guard.min.css'

import React from 'react'

// 你的业务代码根组件
import RouterComponent from './router'

function App() {
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
import Vue from 'vue'

import { GuardPlugin } from '@authing/guard-vue2'

import '@authing/guard-vue2/dist/esm/guard.min.css'

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
import { createApp } from 'vue'

import { createGuard } from '@authing/guard-vue3'

import '@authing/guard-vue3/dist/esm/guard.min.css'

// 你的业务代码根组件
import App from './App.vue'

const app = createApp(App)

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
```json
// angular.json
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-angular/normal/angular.json
{
  "projects": {
    "architect": {
      "build": {
        "styles": ["node_modules/@authing/guard-angular/dist/guard.min.css"]
      }
    }
  }
}
```

```typescript
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-angular/normal/src/app/app.module.ts
// app.module.ts
import { NgModule } from '@angular/core'

import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'

import { AppComponent } from './app.component'

import { GuardModule } from '@authing/guard-angular'

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
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```
:::

::: tab JavaScript
::: hint-info
所有 API 均可通过实例化 `Guard` 调用，后续不再赘述。
:::
``` js
import { Guard } from '@authing/guard'

const guard = new Guard({
  appId: 'AUTHING_APP_ID'
})

guard.start('#authing-guard-container').then(userInfo => {
  console.log('userInfo in start: ', userInfo)
})
```
::::