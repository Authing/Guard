import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/main.css'

import { createGuard } from '@authing/guard-vue3'

import '@authing/guard-vue3/dist/esm/guard.min.css'

import * as facePlugin from 'face-api.js'

const app = createApp(App)


app.use(
  createGuard({
    appId: '64196bdaa5b19f2a6e4316d0',
    
    // 如果你使用的是私有化部署的 Authing 服务，需要传入自定义 host，如:
    // host: 'https://my-authing-app.example.com',

    // 默认情况下，会使用你在 Authing 控制台中配置的第一个回调地址为此次认证使用的回调地址。
    // 如果你配置了多个回调地址，也可以手动指定（此地址也需要加入到应用的「登录回调 URL」中）：
    // redirectUri: "YOUR_REDIRECT_URI",

    isSSO: true,
    config: {
      socialConnectionList: ['github'],
      langRange: ['zh-CN', 'ja-JP']
    },
    facePlugin
  })
)

app.use(router)

app.mount('#app')
