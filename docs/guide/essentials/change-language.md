# 切换语言

```ts
class Guard {
  changeLang(lang: Lang): void
}
```

默认情况下，Guard 会展示你在 Authing 控制台中配置的默认语言，你也可以通过 `changeLang` 修改 Authing Guard 显示的语言，目前共支持以下四种：

- zh-CN：中文简体
- zh-TW：中文繁体
- en-US：英文
- ja-JP：日文

如果 Authing Guard 暂未支持用户的浏览器语言，Guard 会展示配置的默认语言。

Authing Guard 会持续新增对不同语言的支持，详情请参见 [Authing 目前支持的语言列表](../types.html#lang)。

:::: tabs :options="{ useUrlFragment: false }"

::: tab React

```tsx
// React 16 / 17
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-react/normal/src/pages/Embed.tsx
import { useGuard, User } from "@authing/guard-react";

// React 18
// 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard-react18/normal/src/pages/Embed.tsx
// import { useGuard, User } from "@authing/guard-react18";

import React, { useEffect, useState } from "react";

export default function ChangeLanguage() {
  const [langCache, setLangCache] = useState("");

  const guard = useGuard();

  useEffect(() => {
    // 使用 start 方法挂载 Guard 组件到你指定的 DOM 节点，登录成功后返回 userInfo
    guard.start("#authing-guard-container").then((userInfo: User) => {
      console.log("userInfo: ", userInfo);
    });

    guard.on("load", () => {
      const langCache = localStorage.getItem("_guard_i18nextLng") || "zh-CN";
      setLangCache(langCache);
    });
  }, []);

  const changeLang = (event: any) => {
    guard.changeLang(event.target.value);
    setLangCache(event.target.value);
  };

  return (
    <div>
      <select value={langCache} onChange={changeLang}>
        <option value="zh-CN">zh-CN</option>
        <option value="en-US">en-US</option>
        <option value="zh-TW">zh-TW</option>
        <option value="ja-JP">ja-JP</option>
      </select>
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
    <select v-model="langCache" @change="changeLang">
      <option value="zh-CN">zh-CN</option>
      <option value="zh-TW">zh-TW</option>
      <option value="en-US">en-US</option>
      <option value="ja-JP">ja-JP</option>
    </select>
    <div id="authing-guard-container"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      langCache: "",
    };
  },
  mounted() {
    // 使用 start 方法挂载 Guard 组件到你指定的 DOM 节点，登录成功后返回 userInfo
    this.$guard.start("#authing-guard-container").then((userInfo) => {
      console.log("userInfo: ", userInfo);
    });

    this.$guard.on("load", () => {
      this.langCache = localStorage.getItem("_guard_i18nextLng");
    });
  },
  methods: {
    changeLang(event) {
      this.$guard.changeLang(event.target.value);
      this.langCache = event.target.value;
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
    <select v-model="langCache" @change="changeLang">
      <option value="zh-CN">zh-CN</option>
      <option value="zh-TW">zh-TW</option>
      <option value="en-US">en-US</option>
      <option value="ja-JP">ja-JP</option>
    </select>
    <div id="authing-guard-container"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useGuard } from "@authing/guard-vue3";
import type { User } from "@authing/guard-vue3";

const langCache = ref("");
const guard = useGuard();

onMounted(() => {
  // 使用 start 方法挂载 Guard 组件到你指定的 DOM 节点，登录成功后返回 userInfo
  guard.start("#authing-guard-container").then((userInfo: User) => {
    console.log("userInfo: ", userInfo);
  });

  guard.on("load", () => {
    langCache.value = localStorage.getItem("_guard_i18nextLng");
  });
});

const changeLang = (event) => {
  guard.changeLang(event.target.value);
  langCache.value = event.target.value;
};
</script>
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
export class GetUserInfoComponent {
  constructor(private guard: GuardService) {}

  langCache = "";

  changeLang(event: any) {
    this.langCache = event?.target?.value;
    this.guard.client.changeLang(event?.target?.value);
  }
}
```

```html
<!-- 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard/normal/embed.html -->
<div class="change-lang-container">
  <select ng-model="langCache" (change)="changeLang($event)">
    <option ngValue="zh-CN">zh-CN</option>
    <option ngValue="zh-TW">zh-TW</option>
    <option ngValue="en-US">en-US</option>
    <option ngValue="ja-JP">ja-JP</option>
  </select>
  <div id="authing-guard-container"></div>
</div>
```

:::

::: tab CDN
```html
<!-- 代码示例：https://github.com/Authing/Guard/tree/dev-v6/examples/guard/normal/embed.html -->
<select onchange="changeLang(event)">
  <option value="zh-CN">zh-CN</option>
  <option value="zh-TW">zh-TW</option>
  <option value="en-US">en-US</option>
  <option value="ja-JP">ja-JP</option>
</select>
```

```javascript
function changeLang(event) {
  guard.changeLang(event.target.value);
}
```
:::

::::
