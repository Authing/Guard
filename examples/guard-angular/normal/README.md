# guard-angular

修改 `src/app/app.module.ts` 中的配置：

``` typescript
GuardModule.forRoot({
  appId: 'AUTHING_APP_ID',
  // 如果你使用的是私有化部署的 Authing 服务，需要传入自定义 host，如 
  // host: 'https://my-authing-app.example.com'
})
```

运行命令：

``` shell
npm ci
npm run dev
```

