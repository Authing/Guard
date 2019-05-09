/* jshint esversion: 6 */
import Vue from 'vue';
import Router from 'vue-router';
import Authorize from './views/Authorize.vue';
import ErrorPage from './views/ErrorPage.vue';
import Logout from './views/Logout.vue'

import Login from './views/login/index.vue';
import Common from './views/login/Common'
import QRCode from './views/login/QRCode'
import Register from './views/login/Register'
import ForgetPassword from './views/login/forgetPassword/index'
import NewPassword from './views/login/forgetPassword/NewPassword'
import SendEmail from './views/login/forgetPassword/SendEmail'
import VerifyCode from './views/login/forgetPassword/VerifyCode'

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'indexLogin',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      children: [
        {
          path: '/common',
          name: 'commonLogin',
          component: Common
        },
        {
          path: '/QRCode',
          name: 'scanQRCode',
          component: QRCode
        },
        {
          path: '/register',
          name: 'register',
          component: Register
        },
        {
          path: '/forgetPassword',
          name: 'forgetPassword',
          component: ForgetPassword,
          children: [
            {
              path: '/newPassword',
              name: 'newPassword',
              component: NewPassword
            },
            {
              path: '/sendEmail',
              name: 'sendEmail',
              component: SendEmail
            },
            {
              path: '/verifyCode',
              name: 'verifyCode',
              component: VerifyCode
            },
          ]
        },
      ]
    },    
    {
      path: '/authorize/confirm',
      name: 'authorize',
      component: Authorize,
    },
    {
      path: '/profile/logout',
      name: 'logout',
      component: Logout,
    },    
    {
      path: '/error',
      name: 'error',
      component: ErrorPage,
    }
  ]
});
