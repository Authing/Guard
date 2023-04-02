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
    path: '/embed',
    name: 'Embed',
    component: () => import('../views/Embed.vue')
  }, {
    path: '/jump',
    name: 'Jump',
    component: () => import('../views/Jump.vue')
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
