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
    appId: '6322ef4c06b1a01036695b33',
    isSSO: true,
    mode: 'modal',
    facePlugin
  })
)

app.use(router)

app.mount('#app')
