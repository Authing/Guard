import Vue from 'vue'
import App from './App.vue'
import router from './router'

import * as facePlugin from 'face-api.js'

import { GuardPlugin } from '@authing/guard-vue2'

import '@authing/guard-vue2/dist/esm/guard.min.css'

Vue.use(GuardPlugin, {
  appId: 'Your Authing application ID',
  // host: '',
  // redirectUri: '',
  facePlugin
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
