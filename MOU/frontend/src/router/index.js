// frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: () => import('../views/login/login.vue')
    },
    {
      path: '/Admin',
      name: 'Admin',
      // component: () => import('../views/Admin/App.vue')
    },
    {
      path: '/Approve',
      name: 'Approve',
      // component: () => import('../views/Approve/App.vue')
    },
    {
      path: '/User',
      name: 'User',
      // component: () => import('../views/User/App.vue')
    }
  ]
})

export default router