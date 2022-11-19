# guard-react


Change configuration in `src/App.tsx`:

``` typescript
<GuardProvider
  appId="AUTHING_APP_ID"
  // 如果你使用的是私有化部署的 Authing 服务，需要传入自定义 host，如 
  // host="https://my-authing-app.example.com"
>
  <RouterComponent></RouterComponent>
</GuardProvider>
```

Run:

``` shell
npm ci
npm run dev
```
