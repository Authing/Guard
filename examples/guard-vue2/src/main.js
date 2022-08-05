import Vue from 'vue'
import App from './App.vue'
import router from './router'

import { AuthingPlugin } from '@authing/guard-vue2'

import '@authing/guard-vue2/dist/esm/guard.min.css'

Vue.use(AuthingPlugin, {
  appId: '62e752f0d8c681db4ed3f743',
  host: 'https://test0123456.authing.cn',
  redirectUri: 'http://localhost:3000/callback'
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
