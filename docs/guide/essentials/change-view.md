# 使用 Guard API 自由切换视图

`changeView` API 可以帮你自由、灵活的切换 Guard 视图界面。

```ts
class Guard {
  changeView(currentView: string | IChangeViewOptions): void
}
```

::: hint-info
<strong>注意：</strong>

当 changeView 的入参 currentView 为 `string` 类型时，其格式为 `module:tab` 或 `module`，即切换视图到某个模块对应的某个 `tab`，有的界面只有 `module` 没有 `tab`。

我们推荐使用 `IChangeViewOptions` 类型，Guard 6.0.0 以上同时支持 `string` 和 `IChangeViewOptions` 类型，5.x 版本仅支持 `string` 类型。

以下代码示例同时展示 `string` 与 `IChangeViewOptions` 的使用方式。相关类型参考：

<!-- 锚点要小写，否则无法定位 -->
- [IChangeViewOptions](../types.html#ichangeviewoptions)
- [IGuardModuleType](../types.html#iguardmoduletype)
- [IGuardTabType](../types.html#iguardtabtype)
:::


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

  const changeViewToPassword = () => {
    guard.changeView({
      module: 'login',
      tab: 'password'
    })
  }

  const changeViewToPhoneCode = () => {
    guard.changeView('login:phone-code')
  }

  const changeViewToForgetPassword = () => {
    guard.changeView('forgetPassword')
  }

  const changeViewToRegister_UserName = () => {
    guard.changeView({
      module: 'register',
      tab: 'username-password'
    })
  }

  const changeViewToRegister_EmailPassword = () => {
    guard.changeView('register:email-password')
  }

  const changeViewToAppQrcode = () => {
    guard.changeView('login:app-qrcode')
  }

  return (
    <div>
      <button className='authing-button' onClick={changeViewToPassword}>Change View to Password</button>

      <button className='authing-button' onClick={changeViewToPhoneCode}>Change View to PhoneCode</button>

      <button className='authing-button' onClick={changeViewToForgetPassword}>Change View to ForgetPassword</button>

      <button className='authing-button' onClick={changeViewToAppQrcode}>Change View to AppQrcode</button>

      <button className='authing-button' onClick={changeViewToRegister_UserName}>Change View To Register - UserName</button>

      <button className='authing-button' onClick={changeViewToRegister_EmailPassword}>Change View To Register - EmailPassword</button>
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
    changeViewToForgetPassword () {
      this.$guard.changeView('forgetPassword')
    },

    changeViewToPassword() {
      this.$guard.changeView('login:password')
    },

    changeViewToPhoneCode () {
      this.$guard.changeView('login:phone-code')
    },

    changeViewToRegister_UserName() {
      this.$guard.changeView({
        module: 'register',
        tab: 'username-password'
      })
    },

    changeViewToRegister_EmailPassword() {
      this.$guard.changeView('register:email-password')
    },

    changeViewToAppQrcode () {
      this.$guard.changeView('login:app-qrcode')
    }
  }
}
```

:::

::: tab Vue3

```typescript
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-vue3/normal/src/views/Embed.vue
import { useGuard } from "@authing/guard-vue3";

const guard = useGuard();

const changeViewToForgetPassword = () => {
  guard.changeView('forgetPassword')
}

const changeViewToPassword = () => {
  guard.changeView('login:password')
}

const changeViewToPhoneCode = () => {
  guard.changeView('login:phone-code')
}

const changeViewToRegister_UserName = () => {
  guard.changeView({
    module: 'register',
    tab: 'username-password'
  })
}

const changeViewToRegister_EmailPassword = () => {
  guard.changeView('register:email-password')
}

const changeViewToAppQrcode = () => {
  guard.changeView('login:app-qrcode')
}
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

  changeViewToForgetPassword () {
    this.guard.client.changeView({
      module: 'forgetPassword'
    })
  }

  changeViewToPassword() {
    this.guard.client.changeView('login:password')
  }

  changeViewToPhoneCode () {
    this.guard.client.changeView('login:phone-code')
  }

  changeViewToRegister_UserName() {
    this.guard.client.changeView({
      module: 'register',
      tab: 'username-password'
    })
  }

  changeViewToRegister_EmailPassword() {
    this.guard.client.changeView('register:email-password')
  }

  changeViewToAppQrcode () {
    this.guard.client.changeView('login:app-qrcode')
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

function changeViewToForgetPassword () {
  guard.changeView('forgetPassword')
}

function changeViewToPassword() {
  guard.changeView('login:password')
}

function changeViewToPhoneCode () {
  guard.changeView({
    module: 'login',
    tab: 'phone-code'
  })
}

function changeViewToRegister_UserName() {
  guard.changeView('register:username-password')
}

function changeViewToRegister_EmailPassword() {
  guard.changeView('register:email-password')
}

function changeViewToAppQrcode () {
  guard.changeView('login:app-qrcode')
}
```
:::
::::