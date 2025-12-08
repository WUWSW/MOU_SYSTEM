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
      path: '/admin',
      name: 'admin',
      // component: () => import('../views/Admin/App.vue')
    },
    {
      path: '/approve',
      name: 'approve',
      // component: () => import('../views/Approve/App.vue')
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../views/User/User.vue')
    }
  ]
})

export default router