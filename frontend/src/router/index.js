import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
 

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomePage.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/ForgotPassword.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/ResetPassword.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/student/profile',
      name: 'student-profile',
      component: () => import('@/views/Profile.vue'),
      meta: { requiresAuth: true, role: 'student' }
    },
    {
      path: '/employer/profile',
      name: 'employer-profile',
      component: () => import('@/views/Profile.vue'),
      meta: { requiresAuth: true, role: 'employer' }
    }
  ]
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isLoggedIn = authStore.isLoggedIn

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
    return
  }

  if (to.meta.role && isLoggedIn) {
    if (authStore.role !== to.meta.role) {
      if (authStore.role === 'student') next('/student/dashboard')
      else if (authStore.role === 'employer') next('/employer/dashboard')
      else if (authStore.role === 'admin') next('/admin/dashboard')
      else next('/')
      return
    }
  }

  if (to.meta.guestOnly && isLoggedIn) {
    if (authStore.role === 'student') next('/student/dashboard')
    else if (authStore.role === 'employer') next('/employer/dashboard')
    else if (authStore.role === 'admin') next('/admin/dashboard')
    else next('/')
    return
  }

  next()
})

export default router
