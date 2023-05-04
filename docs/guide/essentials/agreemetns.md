# 选中 / 取消选中登录注册协议

```ts
class Guard {
  // 选中
  checkAllAgreements(): void

  // 取消选中
  unCheckAllAgreements(): void
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

  const checkAllAgreements = () => {
    guard.checkAllAgreements()
  }

  const unCheckAllAgreements = () => {
    guard.unCheckAllAgreements()
  }

  return (
    <div>
      <button className="authing-button" onClick={checkAllAgreements}>Check All Agreements</button>
      <button className="authing-button" onClick={unCheckAllAgreements}>Uncheck All Agreements</button>
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
    checkAllAgreements () {
      this.$guard.checkAllAgreements()
    },

    unCheckAllAgreements () {
      this.$guard.unCheckAllAgreements()
    }
  }
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

  const checkAllAgreements = () => {
    guard.checkAllAgreements()
  }

  const unCheckAllAgreements = () => {
    guard.unCheckAllAgreements()
  }
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

  checkAllAgreements() {
    this.guard.client.checkAllAgreements()
  }

  unCheckAllAgreements() {
    this.guard.client.unCheckAllAgreements()
  }
}
```

:::

::: tab CDN
```javascript
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard/normal/embed.html
const checkAllAgreements = () => {
  guard.checkAllAgreements()
}

const unCheckAllAgreements = () => {
  guard.unCheckAllAgreements()
}
```
:::
::::

::: hint-info
你可能感兴趣：[登录注册协议](https://docs.authing.cn/v2/guides/customize/global-guard/#%E7%99%BB%E5%BD%95%E6%B3%A8%E5%86%8C%E5%8D%8F%E8%AE%AE)
:::