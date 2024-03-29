import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/main.css'

import { createGuard } from '@authing/guard-vue3'

import '@authing/guard-vue3/dist/guard.min.css'

import * as facePlugin from 'face-api.js'

const app = createApp(App)

app.use(
  createGuard({
    appId: 'AUTHING_APP_ID',
    isSSO: true,
    mode: 'modal',
    facePlugin,
    config: {
      socialConnectionList: ['github'],
      clickCloseable: false
    }
  })
)

app.use(router)

app.mount('#app')
