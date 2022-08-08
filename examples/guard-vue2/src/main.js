import Vue from 'vue'
import App from './App.vue'
import router from './router'

// import { GuardPlugin } from '@authing/guard-vue2'

// import '@authing/guard-vue2/dist/esm/guard.min.css'

// Vue.use(GuardPlugin, {
//   appId: '62e22721c889dd44bad1dda2',
//   host: 'https://guard-test-2022.authing.cn',
//   redirectUri: 'http://localhost:3000/callback'
// })

import { Authing } from '@authing/browser'

Vue.prototype.$authing = new Authing({
  appId: '62e8d32e4feac0ba0a75edf5',
  domain: 'https://ipehegkanbpgkdho-demo.authing.cn',
  redirectUri: 'http://localhost:3000/callback'
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
