import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: '/',
  routes: [{
    path: '/',
		redirect: '/home'
  }, {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue')
  }, {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  }, {
    path: '/callback',
    name: 'Callback',
    component: () => import('../views/Callback.vue')
  }, {
    path: '/personal',
    name: 'Personal',
    component: () => import('../views/Personal.vue')
  }]
})

export default router
