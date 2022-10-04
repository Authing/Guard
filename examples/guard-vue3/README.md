# guard-vue3


修改 `src/main.ts` 中的配置：

``` typescript
app.use(
  createGuard({
    appId: 'Your Authing application ID'
  })
)
```

运行以下命令：

``` shell
npm ci
npm run dev
```
