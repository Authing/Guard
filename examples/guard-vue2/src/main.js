import Vue from 'vue'
import App from './App.vue'
import router from './router'

import * as facePlugin from 'face-api.js'

import { GuardPlugin } from '@authing/guard-vue2'

import '@authing/guard-vue2/dist/esm/guard.min.css'

Vue.use(GuardPlugin, {
  appId: '62e7f0c91073aaba0db4d65b',
  align: 'center',
  // host: 'https://guard-test-2022.authing.cn',
  // redirectUri: 'http://localhost:3000/callback',
  facePlugin
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
