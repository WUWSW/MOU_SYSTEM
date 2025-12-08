import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/login/login.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    
    path: '/Admin',
    name: 'Admin',
    component: () => import('../views/Admin/dashboard_admin.vue')
  },
  {
    path: '/Approve',
    name: 'Approve',
    component: () => import('../views/Approve/dashboard_approve.vue')
  },
  {
    path: '/User',
    name: 'User',
    component: () => import('../views/User/User.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router