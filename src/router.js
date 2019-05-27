/* jshint esversion: 6 */
import Vue from 'vue';
import Router from 'vue-router';
import Authorize from './views/Authorize.vue';
import ErrorPage from './views/ErrorPage.vue';
import Logout from './views/Logout.vue'

import Login from './views/login/index.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: "*",
      redirect: "/login/error"
    },    
    {
      path: '/',
      name: 'indexLogin',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },    
    {
      path: '/login/authorize/confirm',
      name: 'authorize',
      component: Authorize,
    },
    {
      path: '/profile/logout',
      name: 'logout',
      component: Logout,
    },    
    {
      path: '/login/error',
      name: 'error',
      component: ErrorPage,
    }
  ]
});
