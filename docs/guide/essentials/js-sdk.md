# Guard 内置 JS SDK

```ts
class Guard {
  async getAuthClient(): Promise<AuthenticationClient>
}
```

Authing Guard 集成了 [authing-js-sdk 的 AuthenticationClient](https://docs.authing.cn/v2/reference/sdk-for-node/authentication/)（`AuthenticationClient` 以终端用户（End User）的身份进行请求，提供了登录、注册、登出、管理用户资料、获取授权资源等所有管理用户身份的方法；此模块还提供了各种身份协议的 SDK，如 [OpenID Connect](https://docs.authing.cn/v2/guides/federation/oidc.html)、[OAuth 2.0](https://docs.authing.cn/v2/guides/federation/oauth.html)、[SAML](https://docs.authing.cn/v2/guides/federation/saml.html)、[CAS](https://docs.authing.cn/v2/guides/federation/cas.html)）。

你可以通过 `getAuthClient` 获取 `AuthenticationClient` 实例，之后可调用 `AuthenticationClient` 的所有方法。

:::: tabs :options="{ useUrlFragment: false }"

::: tab React

```tsx
// React 16 / 17
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-react/normal/src/pages/Personal.tsx
import { useGuard, AuthenticationClient, User } from "@authing/guard-react";

// React 18
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-react18/normal/src/pages/Personal.tsx
// import { useGuard, AuthenticationClient, User } from "@authing/guard-react18";

import React, { useEffect } from "react";

export default function Personal() {
  const guard = useGuard();

  const updateProfile = async () => {
    const authenticationClient: AuthenticationClient = await guard.getAuthClient();

    // 获取到 AuthenticationClient 实例之后，可以调用其提供的所有方法
    // 比如更新用户昵称
    const userProfile: User = await authenticationClient.updateProfile({
      nickname: "Nick",
    });

    console.log("userProfile: ", userProfile);

    // 更多 AuthenticationClient 的方法，请见 authing-js-sdk 文档介绍。
    // https://docs.authing.cn/v2/reference/sdk-for-node/authentication/
  };

  return (
    <div>
      <button className="authing-button" onClick={updateProfile}>
        Update Profile
      </button>
    </div>
  );
}
```

:::

::: tab Vue2

```vue
<template>
  <div class="personal-container">
    <!-- 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-vue2/normal/src/views/Personal.vue -->
    <button class="authing-button" @click="updateProfile">
      Update Profile
    </button>
  </div>
</template>

<script>
export default {
  methods: {
    async updateProfile() {
      const authenticationClient = await this.$guard.getAuthClient();

      // 获取到 AuthenticationClient 实例之后，可以调用其提供的所有方法
      // 比如更新用户昵称
      const userProfile = await authenticationClient.updateProfile({
        nickname: "Nick"
      });

      console.log(userProfile);

      // 更多 AuthenticationClient 的方法，请见 authing-js-sdk 文档介绍。
      // https://docs.authing.cn/v2/reference/sdk-for-node/authentication/
    },
  },
};
</script>
```

:::

::: tab Vue3

```vue
<template>
  <div class="personal-container">
    <!-- 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-vue3/normal/src/views/Personal.vue -->
    <button @click="updateProfile">Update Profile</button>
  </div>
</template>

<script setup lang="ts">
import { useGuard } from "@authing/guard-vue3";

import type { User, AuthenticationClient } from "@authing/guard-vue3";

const guard = useGuard();

const updateProfile = async () => {
  const authenticationClient: AuthenticationClient = await guard.getAuthClient();

  // 获取到 AuthenticationClient 实例之后，可以调用其提供的所有方法
  // 比如更新用户昵称
  const userProfile: User = await authenticationClient.updateProfile({
    nickname: "Nick",
  });

  console.log(userProfile);

  // 更多 AuthenticationClient 的方法，请见 authing-js-sdk 文档介绍。
  // https://docs.authing.cn/v2/reference/sdk-for-node/authentication/
};
</script>
```

:::

::: tab Angular

```typescript
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-angular/normal/src/app/pages/personal/personal.component.ts
import { Component } from "@angular/core";
import {
  AuthenticationClient,
  GuardService,
  User,
} from "@authing/guard-angular";

@Component({
  selector: "personal-container",
  templateUrl: "./personal.component.html",
  styleUrls: ["./personal.component.css"],
})
export class PersonalComponent {
  constructor(private guard: GuardService) {}

  async updateProfile() {
    const authenticationClient: AuthenticationClient = await this.guard.client.getAuthClient();

    // 获取到 AuthenticationClient 实例之后，可以调用其提供的所有方法
    // 比如更新用户昵称
    const userProfile: User = await authenticationClient.updateProfile({
      nickname: "Nick",
    });

    console.log("userProfile: ", userProfile);

    // 更多 AuthenticationClient 的方法，请见 authing-js-sdk 文档介绍。
    // https://docs.authing.cn/v2/reference/sdk-for-node/authentication/
  }
}
```

:::

::: tab CDN
```javascript
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard/normal/embed.html
async function updateProfile() {
  const authenticationClient = await guard.getAuthClient();

  // 获取到 AuthenticationClient 实例之后，可以调用其提供的所有方法
  // 比如更新用户昵称
  const userProfile = await authenticationClient.updateProfile({
    nickname: "Nick",
  });

  console.log("userProfile: ", userProfile);

  // 更多 AuthenticationClient 的方法，请见 authing-js-sdk 文档介绍。
  // https://docs.authing.cn/v2/reference/sdk-for-node/authentication/
}
```
:::

::::

