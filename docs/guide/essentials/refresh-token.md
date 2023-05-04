# 刷新 Token

:::: tabs :options="{ useUrlFragment: false }"

::: tab React

```tsx
// React 16 / 17
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-react/normal/src/pages/Embed.tsx
import {
  AuthenticationClient,
  RefreshToken,
  useGuard,
} from "@authing/guard-react";

// React 18
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-react18/normal/src/pages/Embed.tsx
// import { AuthenticationClient, RefreshToken, useGuard, } from "@authing/guard-react18";

export default function Login() {
  const guard = useGuard();

  const refreshToken = async () => {
    const authenticationClient: AuthenticationClient = await guard.getAuthClient();
    const refreshedToken: RefreshToken = await authenticationClient.refreshToken();
    console.log(refreshedToken);
  };

  return (
    <div>
      <button className="authing-button" onClick={refreshToken}>
        Refresh Token
      </button>
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
    async refreshToken() {
      const authenticationClient = await this.$guard.getAuthClient();
      const refreshedToken = await authenticationClient.refreshToken();
      console.log(refreshedToken);
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

  import type { RefreshToken, AuthenticationClient } from "@authing/guard-vue3";

  const guard = useGuard();

  const refreshToken = async () => {
    const authenticationClient: AuthenticationClient = await guard.getAuthClient();
    const refreshedToken: RefreshToken = await authenticationClient.refreshToken();
    console.log(refreshedToken);
  };
</script>
```

:::

::: tab Angular

```typescript
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-angular/normal/src/app/pages/embed/embed.component.ts
// Angular 组件中使用 Guard API
import { Component } from "@angular/core";
import {
  AuthenticationClient,
  GuardService,
  RefreshToken,
} from "@authing/guard-angular";

@Component({
  selector: "home-container",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent {
  constructor(
    // 使用 Angular 依赖注入，获取 Guard 实例
    private guard: GuardService
  ) {}

  async refreshToken() {
    const authenticationClient: AuthenticationClient = await this.guard.client.getAuthClient();
    const refreshedToken: RefreshToken = await authenticationClient.refreshToken();
    console.log(refreshedToken);
  }
}
```

:::

::: tab CDN
```javascript
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard/normal/embed.html
async function refreshToken() {
  const authenticationClient = await guard.getAuthClient();
  const refreshedToken = await authenticationClient.refreshToken();
  console.log(refreshedToken);
}
```
:::

::::

::: hint-info
你可能感兴趣：[Guard 内置 JS SDK](./js-sdk.md)
:::