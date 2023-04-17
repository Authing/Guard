# 安装

::: hint-info
你可以选择 CDN 或 NPM 方式安装并使用 Guard，无论使用哪一种安装方式，你都需要用到 Authing 应用的 <strong>APP ID</strong>，请先前往 Authing 控制台 <a href="https://docs.authing.cn/v2/guides/app-new/create-app/create-app.html" target="_blank">创建一个应用</a> 并获取 APP ID。关于 APP ID 所在位置，请参阅 <a href="https://docs.authing.cn/v2/guides/app-new/create-app/app-configuration.html" target="_blank">应用配置</a>。
:::

## CDN 引入

通过 Authing CDN 可以看到 Guard 最新版本的资源，在页面上引入 js 和 css 文件即可开始使用：

``` html
<script type="text/javascript" src="https://cdn.authing.co/packages/guard/latest/guard.min.js"></script>
<link rel="stylesheet" href="https://cdn.authing.co/packages/guard/latest/guard.min.css" />
```

也可以切换版本选择需要的资源，如：

``` html
<script type="text/javascript" src="https://cdn.authing.co/packages/guard/6.0.0/guard.min.js"></script>
<link rel="stylesheet" href="https://cdn.authing.co/packages/guard/6.0.0/guard.min.css" />
```

## 示例

通过 CDN 可以快速使用 Guard 写出一个示例：

``` html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authing Guard</title>
  <script type="text/javascript" src="https://cdn.authing.co/packages/guard/latest/guard.min.js"></script>
  <link rel="stylesheet" href="https://cdn.authing.co/packages/guard/latest/guard.min.css" />
</head>

<body>
  <div id="authing-guard-container"></div>

  <script>
    const guard = new GuardFactory.Guard({
      appId: 'AUTHING_APP_ID'
    })

    guard.start('#authing-guard-container').then(userInfo => {
      console.log('userInfo in start: ', userInfo)
    })
  </script>
</body>
</html>
```

## NPM 安装

推荐使用 npm 来安装，享受生态圈和工具带来的便利，更好地和 webpack 配合使用，当然，我们也推荐使用 ES2015。

:::: tabs :options="{ useUrlFragment: false }"
::: tab React

```shell
# 兼容 React 16 / 17
npm install --save @authing/guard-react
# OR
yarn add @authing/guard-react

# 兼容 React 18
npm install --save @authing/guard-react18
# OR
yarn add @authing/guard-react18
```

:::

::: tab Vue2

```shell
# 兼容 Vue 2
npm install --save @authing/guard-vue2

# OR

yarn add @authing/guard-vue2
```

:::

::: tab Vue3

```shell
# 兼容 Vue 3
npm install --save @authing/guard-vue3

# OR

yarn add @authing/guard-vue3
```

:::

::: tab Angular

```shell
# 兼容 Angular 14
npm install --save @authing/guard-angular

# OR

yarn add @authing/guard-angular
```

:::
::::

如果你使用了 NPM 安装，并使用 webpack 作为构建工具，请继续阅读 [快速开始](./quick-start.md) 章节。