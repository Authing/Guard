# 自定义样式

``` ts
class Guard {
  changeContentCSS(contentCSS: string): void
}
```

默认情况下，Guard 会使用你在 Authing 控制台中配置的自定义 CSS 内容，你也可以通过 `changeContentCSS` 方法手动设置自定义 CSS 样式：

::: hint-info
注：此方法只应该被调用一次，多次调用会覆盖之前设置的 CSS 内容。
:::

:::: tabs :options="{ useUrlFragment: false }"

::: tab React

```tsx
// React 16 / 17
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-react/normal/src/pages/Embed.tsx
import { useGuard, User } from "@authing/guard-react";

// React 18
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-react18/normal/src/pages/Embed.tsx
// import { useGuard, User } from "@authing/guard-react18";

import React, { useEffect } from "react";

export default function ChangeContentCSS() {
  const guard = useGuard();

  useEffect(() => {
    guard.start("#authing-guard-container").then((userInfo: User) => {
      console.log("userInfo: ", userInfo);
    });
  }, []);

  // 设置自定义样式
  const changeContentCSS = () => {
    guard.changeContentCSS(`
      #authing-guard-container {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `);
  }

  return (
    <div>
      <button onClick={changeContentCSS}>Change Content CSS</button>
      <div id="authing-guard-container"></div>
    </div>
  );
}
```

:::

::: tab Vue2

```vue
<template>
  <div class="embed-container">
    <!-- 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-vue2/normal/src/views/Embed.vue -->
    <button class="authing-button" @click="changeContentCSS">
      Change Content CSS
    </button>
    <div id="authing-guard-container"></div>
  </div>
</template>

<script>
export default {
  mounted() {
    // 使用 start 方法挂载 Guard 组件到你指定的 DOM 节点，登录成功后返回 userInfo
    this.$guard.start("#authing-guard-container").then((userInfo) => {
      console.log("userInfo: ", userInfo);
    });
  },
  methods: {
    changeContentCSS() {
      this.$guard.changeContentCSS(`
        #authing-guard-container {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `);
    },
  },
};
</script>
```

:::

::: tab Vue3

```vue
<template>
  <div class="embed-container">
    <!-- 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-vue3/normal/src/views/Embed.vue -->
    <button @click="changeContentCSS">Change Content CSS</button>
    <div id="authing-guard-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useGuard } from "@authing/guard-vue3";
import type { User } from "@authing/guard-vue3";

const guard = useGuard();

onMounted(() => {
  // 使用 start 方法挂载 Guard 组件到你指定的 DOM 节点，登录成功后返回 userInfo
  guard.start("#authing-guard-container").then((userInfo: User) => {
    console.log("userInfo: ", userInfo);
  });
});

const changeContentCSS = () =>
  guard.changeContentCSS(`
    #authing-guard-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `);
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

  ngOnInit() {
    // 使用 start 方法挂载 Guard 组件到你指定的 DOM 节点，登录成功后返回 userInfo
    this.guard.client
      .start("#authing-guard-container")
      .then((userInfo: User) => {
        console.log("userInfo: ", userInfo);
      });
  }

  changeContentCSS() {
    this.guard.client.changeContentCSS(`
      #authing-guard-container {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `);
  }
}
```

```html
<div class="change-content-css-container">
  <button (click)="changeContentCSS()">Change Content CSS</button>
  <div id="authing-guard-container"></div>
</div>
```

:::

::: tab CDN

```javascript
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard/normal/embed.html
function changeContentCSS() {
  guard.changeContentCSS(`
    #authing-guard-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `);
}
```
:::

::::
