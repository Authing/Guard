/* jshint esversion: 6 */
import Vue from 'vue';
import Router from 'vue-router';
import Login from './views/Login.vue';
import Authorize from './views/Authorize.vue';
import ErrorPage from './views/ErrorPage.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'indexLogin',
      component: Login,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },    
    {
      path: '/authorize/confirm',
      name: 'authorize',
      component: Authorize,
    },
    {
      path: '/error',
      name: 'error',
      component: ErrorPage,
    }
  ]
});
