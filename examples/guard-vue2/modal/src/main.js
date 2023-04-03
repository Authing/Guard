import Vue from 'vue'
import App from './App.vue'
import router from './router'

import * as facePlugin from 'face-api.js'

import { GuardPlugin } from '@authing/guard-vue2'

import '@authing/guard-vue2/dist/guard.min.css'

Vue.use(GuardPlugin, {
  appId: 'AUTHING_APP_ID',
  isSSO: true,
  mode: 'modal',
  config: {
    socialConnectionList: ['github'],
  },
  facePlugin
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
