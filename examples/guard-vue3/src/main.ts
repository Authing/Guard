import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/main.css'

import { createAuthing } from '@authing/guard-vue3'

import '@authing/guard-vue3/dist/esm/guard.min.css'

const app = createApp(App)

app.use(
  createAuthing({
    appId: '62e752f0d8c681db4ed3f743',
    host: 'https://test0123456.authing.cn',
    redirectUri: 'http://localhost:3000/callback'
  })
)

app.use(router)

app.mount('#app')
