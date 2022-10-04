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
    appId: 'Your Authing application ID',
    facePlugin: facePlugin,
    // host: '',
    // redirectUri: ''
  })
)

app.use(router)

app.mount('#app')
