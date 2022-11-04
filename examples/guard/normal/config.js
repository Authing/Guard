var guardOptions = {
  appId: 'AUTHING_APP_ID',

  // 如果你使用的是私有化部署的 Authing 服务，需要传入自定义 host，如:
  // host: 'https://my-authing-app.example.com',

  // 默认情况下，会使用你在 Authing 控制台中配置的第一个回调地址为此次认证使用的回调地址。
  // 如果你配置了多个回调地址，也可以手动指定（此地址也需要加入到应用的「登录回调 URL」中）：
  redirectUri: "YOUR_REDIRECT_URI",

  isSSO: true,
  config: {
    socialConnectionList: ['github'],
    langRange: ['zh-CN']
  },
  // 需在 html 中导入 <script src="https://cdn.authing.co/packages/face-api/face-api.min.js"></script>
  facePlugin: faceapi
}

var personalPageUrl = 'http://localhost:5500/examples/guard/normal/personal.html'
