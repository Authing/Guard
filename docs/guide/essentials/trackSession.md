# 获取用户信息

```ts
class Guard {
  async trackSession(): Promise<User | null> {}
}
```

:::: tabs :options="{ useUrlFragment: false }"

::: tab React

```tsx
// React 16 / 17
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-react/normal/src/pages/Embed.tsx
import { useGuard, User } from "@authing/guard-react";

// React 18
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-react18/normal/src/pages/Embed.tsx
// import { useGuard, User } from "@authing/guard-react18";

import React from "react";

export default function GetUserInfo() {
  const guard = useGuard();

  const getUserInfo = async () => {
    // 获取用户信息
    const userInfo: User | null = await guard.trackSession();
    console.log("userInfo: ", userInfo);
  };

  return (
    <div>
      <button onClick={getUserInfo}>Get User Info</button>
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
    async getUserInfo() {
      // 获取用户信息
      const userInfo = await this.$guard.trackSession();
      console.log("userInfo: ", userInfo);
    },
  },
};
```

:::

::: tab Vue3

```html
<script lang="ts" setup>
  // 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-vue3/normal/src/views/Embed.vue
  import { useGuard } from "@authing/guard-vue3";

  import type { User } from "@authing/guard-vue3";

  const guard = useGuard();

  const getUserInfo = async () => {
    // 获取用户信息
    const userInfo: User | null = await guard.trackSession();
    console.log("userInfo: ", userInfo);
  };
</script>
```

:::

::: tab Angular

```typescript
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-angular/normal/src/app/pages/embed/embed.component.ts
import { Component } from "@angular/core";
import { GuardService, User } from "@authing/guard-angular";

@Component({
  selector: "embed-container",
  templateUrl: "./embed.component.html",
  styleUrls: ["./embed.component.css"]
})
export class GetUserInfoComponent {
  constructor(private guard: GuardService) {}

  async getUserInfo() {
    // 获取用户信息
    const userInfo: User | null = await this.guard.client.trackSession();
    console.log("userInfo: ", userInfo);
  }
}
```

:::

::: tab CDN
```javascript
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard/normal/embed.html
async function getUserInfo() {
  // 获取用户信息
  const userInfo = await guard.trackSession();
  console.log(userInfo);
}
```
:::

::::
