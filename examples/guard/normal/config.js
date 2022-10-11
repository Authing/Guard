var guardOptions = {
  appId: '6322ef4c06b1a01036695b33',
  isSSO: true,
  config: {
    socialConnectionList: ['github']
  },
  // 需在 html 中导入 <script src="https://cdn.authing.co/packages/face-api/face-api.min.js"></script>
  facePlugin: faceapi
}

var callbackPageUrl = 'http://localhost:5500/examples/guard/normal/callback.html'

var personalPageUrl = 'http://localhost:5500/examples/guard/normal/personal.html'
