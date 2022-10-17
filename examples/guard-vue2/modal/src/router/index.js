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
  }]
})

export default router
