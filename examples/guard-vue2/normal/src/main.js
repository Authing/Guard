import Vue from 'vue'
import App from './App.vue'
import router from './router'

import * as facePlugin from 'face-api.js'

import { GuardPlugin } from '@authing/guard-vue2'

import '@authing/guard-vue2/dist/esm/guard.min.css'

Vue.use(GuardPlugin, {
  appId: '6322ef4c06b1a01036695b33',
  isSSO: true,
  config: {
    socialConnections: ['github'],
  },
  facePlugin
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
