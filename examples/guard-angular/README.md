# guard-angular

修改 `src/app/app.module.ts` 中的配置：

``` typescript
GuardModule.forRoot({
  appId: 'Your Authing application ID',
  facePlugin
})
```

运行命令：

``` shell
npm ci
npm run dev
```

