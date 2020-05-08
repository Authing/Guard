/* jshint esversion: 6 */
import Vue from 'vue'
import Router from 'vue-router'
import Authorize from './views/Authorize.vue'
import ErrorPage from './views/ErrorPage.vue'
import Logout from './views/Logout.vue'
import Profile from './views/Profile.vue'
import Login from './views/login/index.vue'
import Regedit from './views/regedit/regedit.vue'
import Simple from './views/simple/index.vue'
import TeaIdentity from './views/teaIdentity/teaIdentity.vue'
import PrivacyPolicy from './views/privacyPolicy.vue'

Vue.use(Router)

const isNative = !!window.ReactNativeWebView
let routerConfig = {
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/',
      alias: '/login',
      name: 'indexLogin',
      component: Login
    },
    {
      path: '/simple',
      name: 'simple',
      component: Simple
    },
    {
      path: '/authorize/confirm',
      name: 'authorize',
      component: Authorize
    },
    {
      path: '/profile/logout',
      name: 'logout',
      component: Logout
    },
    {
      path: '/error',
      name: 'error',
      component: ErrorPage
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/profile/hep',
      name: 'hepProfile',
      component: Regedit
    },
    {
      path: '/teacher',
      name: 'teacher',
      component: TeaIdentity
    },
    {
      path: '/privacyPolicy',
      name: 'privacyPolicy',
      component: PrivacyPolicy
    }
  ]
}
if (!isNative) {
  routerConfig.mode = 'history'
}

const router = new Router(routerConfig)

export default router
