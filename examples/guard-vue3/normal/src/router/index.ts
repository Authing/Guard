import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Embed from '../views/Embed.vue'
import Callback from '../views/Callback.vue'
import Personal from '../views/Personal.vue'

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
    },
    {
      path: '/callback',
      name: 'Callback',
      component: Callback
    },
    {
      path: '/personal',
      name: 'Personal',
      component: Personal
    }
  ]
})

export default router
