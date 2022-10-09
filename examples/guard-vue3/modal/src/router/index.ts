import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Embed from '../views/Embed.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/embed',
      name: 'Embed',
      component: Embed
    }
  ]
})

export default router
