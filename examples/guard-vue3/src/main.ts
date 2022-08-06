import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/main.css'

import { createAuthing } from '@authing/guard-vue3'

import '@authing/guard-vue3/dist/esm/guard.min.css'

const app = createApp(App)

app.use(
  createAuthing({
    appId: '62e22721c889dd44bad1dda2',
    host: 'https://guard-test-2022.authing.cn',
    redirectUri: 'http://localhost:3000/callback'
  })
)

app.use(router)

app.mount('#app')
