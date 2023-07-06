# Guard 事件

使用 Guard 提供的 `on` 方法可以对 Guard 支持的事件进行监听。

:::: tabs :options="{ useUrlFragment: false }"

::: tab React

```tsx
// React 16 / 17
// 代码示例：https://github.com/Authing/Guard/blob/master/examples/guard-react/normal/src/pages/Embed.tsx
import { useGuard, User } from "@authing/guard-react";

// React 18
// 代码示例：https://github.com/Authing/Guard/blob/master/examples/guard-react18/normal/src/pages/Embed.tsx
// import { useGuard, User } from "@authing/guard-react18";

import React, { useEffect } from "react";

export default function Login() {
  const guard = useGuard();

  useEffect(() => {
    // 使用 start 方法挂载 Guard 组件到你指定的 DOM 节点，登录成功后返回 userInfo
    guard.start("#authing-guard-container").then((userInfo: User) => {
      console.log("userInfo: ", userInfo);
    });

    guard.on("login", (userInfo: User) => {
      // 自定义登录成功后的业务逻辑
      // 比如跳转到对应的某个页面等
      console.log("userInfo in login: ", userInfo);
    });
  }, []);

  return (
    <div>
      <div id="authing-guard-container"></div>
    </div>
  );
}
```

:::

::: tab Vue2

```javascript
// 代码示例：https://github.com/Authing/Guard/blob/master/examples/guard-vue2/normal/src/views/Embed.vue
export default {
  mounted() {
    // 使用 start 方法挂载 Guard 组件到你指定的 DOM 节点，登录成功后返回 userInfo
    this.$guard.start("#authing-guard-container").then((userInfo) => {
      console.log(userInfo);
    });

    this.$guard.on("login", (userInfo) => {
      // 自定义登录成功后的业务逻辑
      // 比如跳转到对应的某个页面等
      console.log("userInfo in login: ", userInfo);
    });
  },
};
```

:::

::: tab Vue3

```html
<script lang="ts" setup>
  // 代码示例：https://github.com/Authing/Guard/blob/master/examples/guard-vue3/normal/src/views/Embed.vue
  import { onMounted } from "vue";

  import { useGuard } from "@authing/guard-vue3";

  import type { User } from "@authing/guard-vue3";

  const guard = useGuard();

  onMounted(() => {
    // 使用 start 方法挂载 Guard 组件到你指定的 DOM 节点，登录成功后返回 userInfo
    guard.start("#authing-guard-container").then((userInfo: User) => {
      console.log("userInfo: ", userInfo);
    });

    guard.on("login", (userInfo: User) => {
      // 自定义登录成功后的业务逻辑
      // 比如跳转到对应的某个页面等
      console.log("userInfo in login: ", userInfo);
    });
  });
</script>
```

:::

::: tab Angular

```typescript
// 代码示例：https://github.com/Authing/Guard/blob/master/examples/guard-angular/normal/src/app/pages/embed/embed.component.ts
import { Component, ChangeDetectorRef } from "@angular/core";

import { GuardService, User } from "@authing/guard-angular";

@Component({
  selector: "embed-container",
  templateUrl: "./embed.component.html",
  styleUrls: ["./embed.component.css"],
})
export class EmbedComponent {
  constructor(private guard: GuardService) {}

  ngOnInit() {
    // 使用 start 方法挂载 Guard 组件到你指定的 DOM 节点，登录成功后返回 userInfo
    this.guard.client
      .start("#authing-guard-container")
      .then((userInfo: User) => {
        console.log(userInfo);
      });

    this.guard.client.on("login", (userInfo: User) => {
      // 自定义登录成功后的业务逻辑
      // 比如跳转到对应的某个页面等
      console.log("userInfo in login: ", userInfo);
    });
  }
}
```

:::

::: tab CDN
```javascript
// 代码示例：https://github.com/Authing/Guard/blob/master/examples/guard/normal/embed.html
guard.on("login", (userInfo) => {
  // 自定义登录成功后的业务逻辑
  // 比如跳转到对应的某个页面等
  console.log(userInfo);
});
```
:::

::::

完整事件如下：

::: hint-info
- 如果配置了登录注册合并，将只会触发 `login` 事件，不会触发 `register` 事件。
- 事件回调函数参数类型参考：[类型定义](../types.md)
:::

``` ts
// 关于 AuthenticationClient 可参考：https://docs.authing.cn/v2/reference/sdk-for-node/authentication/

// Guard 初始化完成，开始渲染页面
guard.on('load', (authenticationClient: AuthenticationClient) => {})

// Guard 初始化失败
guard.on('load-error', (error: any) => {})

// 用户触发登录前（返回<boolean ｜ Promise<boolean>>用于控制本次登录是否继续）。
guard.on('before-login', (
  loginParams: NomalLoginParams | VerifyCodeLoginParams | ScanLoginParams,
  authenticationClient: AuthenticationClient
) => {})

// 用户登录成功，可以在回调函数中自定义登录后的业务逻辑
guard.on('login', (
  user: User, 
  authenticationClient: AuthenticationClient
) => {})

// 用户登录失败
guard.on('login-error', (error: ILoginError) => {})

// 用户触发注册前（返回<boolean ｜ Promise<boolean>>用于控制本次注册是否继续）。
guard.on('before-register', (
  registerParams: RegisterParams,
  authenticationClient: AuthenticationClient
) => {})

// 用户注册成功
guard.on('register', (
  user: User, 
  authenticationClient: AuthenticationClient
) => {})

// 用户注册失败
guard.on('register-error', (error: any) => {})

// 邮件发送成功
guard.on('email-send', (
  sence: IEmailScene, 
  authenticationClient: AuthenticationClient
) => {})

// 邮件发送失败
guard.on('email-send-error', (
  error: any, 
  sence: IEmailScene, 
  authenticationClient: AuthenticationClient
) => {})

// 短信验证码发送成功
guard.on('phone-send', (
  sence: ISceneType, 
  authenticationClient: AuthenticationClient
) => {})

// 短信验证码发送失败
guard.on('phone-send-error', (
  error: any,
  sence: ISceneType, 
  authenticationClient: AuthenticationClient
) => {})

// 重置密码成功
guard.on('pwd-reset', (authenticationClient: AuthenticationClient) => {})

// 重置密码失败
guard.on('pwd-reset-error', (
  error: any, 
  authenticationClient: AuthenticationClient
) => {})

// modal 模式中 guard 关闭
guard.on('close', () => {})

// 注册补全成功
guard.on('register-info-completed', (
  user: User, 
  udfs: Object, 
  authenticationClient: AuthenticationClient
) => {})

// 注册补全失败
guard.on('register-info-completed-error', (
  user: User, 
  udfs: Object, 
  authenticationClient: AuthenticationClient
) => {})

// 语言切换
guard.on('lang-change', (lang: Lang) => {})

// Guard 内部 Module 切换前事件(返回<boolean ｜ Promise<boolean>>用于控制本次切换是否继续)
guard.on('before-change-module', (
  moduleType: IGuardModuleType, 
  initData: any
) => {})

// Guard 内部 Module 切换后事件
guard.on('after-change-module', (options: OnAfterChangeModuleOptions) => {})
```
