# 初始化 Guard 的配置参数

使用 Guard 时，除 `appId` 必传之外，其他参数都是可选配置项。通过使用这些可选配置，你可以体验更强大、更灵活的 Guard 功能。

:::: tabs :options="{ useUrlFragment: false }"
::: tab JavaScript
``` js
// JavaScript
const guardOptions = {
  appId: 'AUTHING_APP_ID'
}

const guard = new Guard(guardOptions)
```
:::

::: tab React
```tsx
// tsx
import { GuardProvider, GuardOptions } from '@authing/guard-react'

const guardOptions: GuardOptions = {
  appId: 'AUTHING_APP_ID'
}

function App() {
  return (
    <GuardProvider
      {...guardOptions}>
      <RouterComponent></RouterComponent>
    </GuardProvider>
  )
}
```
:::

::: tab Vue2

```javascript
// JavaScript
import { GuardPlugin } from '@authing/guard-vue2'

const guardOptions = {
  appId: 'AUTHING_APP_ID'
}

Vue.use(GuardPlugin, guardOptions)
```

:::

::: tab Vue3

```typescript
// TypeScript
import { createGuard } from '@authing/guard-vue3'

import type { GuardOptions } from '@authing/guard-vue3'

const guardOptions: GuardOptions = {
  appId: 'AUTHING_APP_ID'
}

app.use(createGuard(guardOptions))
```

:::

::: tab Angular
```typescript
// TypeScript
import { GuardModule, GuardOptions } from '@authing/guard-angular'

const guardOptions: GuardOptions = {
  appId: 'AUTHING_APP_ID'
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GuardModule.forRoot(guardOptions)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```
:::
::::

`GuardOptions` 数据结构如下，更多类型请参考 [TS 类型定义](./types.md)。

``` ts
export interface GuardOptions {
  // Authing APP ID
  appId: string

  // 如果你使用的是私有化部署的 Authing 服务，需要传入自定义 host
  host?: string

  // 默认情况下，会使用你在 Authing 控制台中配置的第一个回调地址为此次认证使用的回调地址。
  // 如果你配置了多个回调地址，也可以手动指定（此地址也需要加入到应用的「登录回调 URL」中）
  redirectUri?: string

  // Guard 展示形态：普通形态 / 模态框形态
  mode?: IGuardMode

  // MFA 人脸识别插件，具体参考本文档：『高级功能』-> 『MFA 多因素认证』
  facePlugin?: any

  // Guard 所有模块
  defaultScene?: IGuardModuleType

  // 租户 ID
  tenantId?: string

  // 多语言
  lang?: Lang

  // 是否开启单点登录
  isSSO?: boolean

  // 自定义 CSS 样式
  style?: CSSProperties

  // 更多配置
  config?: Partial<IGuardConfig>
}
```
