import Vue from 'vue'
import App from './App.vue'
import router from './router'

import { GuardPlugin } from '@authing/guard-vue2'

import '@authing/guard-vue2/dist/esm/guard.min.css'

Vue.use(GuardPlugin, {
  appId: '62e752f0d8c681db4ed3f743',
  // host: 'https://guard-test-2022.authing.cn',
  // redirectUri: 'http://localhost:3000/callback'
  config: {
    isSSO: true
  }
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
