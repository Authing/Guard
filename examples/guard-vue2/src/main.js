import Vue from 'vue'
import App from './App.vue'
import router from './router'

import { AuthingPlugin } from '@authing/guard-vue2'

import '@authing/guard-vue2/dist/esm/guard.min.css'

Vue.use(AuthingPlugin, {
  appId: '62e22721c889dd44bad1dda2',
  host: 'https://guard-test-2022.authing.cn',
  redirectUri: 'http://localhost:3000/callback'
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
