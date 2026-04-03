import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/public/HomePage.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/public/LoginPage.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/public/RegisterPage.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/browse',
      name: 'browse',
      component: () => import('@/views/public/Browse.vue')
    },
    
    {
      path: '/student/dashboard',
      name: 'student-dashboard',
      component: () => import('@/views/student/StudentDashboard.vue'),
      meta: { requiresAuth: true, role: 'student' }
    },
    {
      path: '/student/bookmarks',
      name: 'student-bookmarks',
      component: () => import('@/views/student/BookmarksPage.vue'),
      meta: { requiresAuth: true, role: 'student' }
    },
    
    {
      path: '/student/applications',
      name: 'student-applications',
      component: () => import('@/views/student/MyApplication.vue'),
      meta: { requiresAuth: true, role: 'student' }
    },
    {
      path: '/student/profile',
      name: 'student-profile',
      component: () => import('@/views/student/MyProfilePage.vue'),
      meta: { requiresAuth: true, role: 'student' }
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: () => import('@/views/AdminDashboard.vue'),
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: () => import('@/views/AdminManageUsers.vue'),
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/admin/listings',
      name: 'admin-listings',
      component: () => import('@/views/AdminManageListings.vue'),
      meta: { requiresAuth: true, role: 'admin' }
    },

    // Employer routes (Person 5)
    {
      path: '/employer/dashboard',
      name: 'employer-dashboard',
      component: () => import('@/views/employer/EmployerDashboard.vue'),
      meta: { requiresAuth: true, role: 'employer' }
    },
    {
      path: '/employer/post-job',
      name: 'post-job',
      component: () => import('@/views/employer/PostJobPage.vue'),
      meta: { requiresAuth: true, role: 'employer' }
    },
    {
      path: '/employer/edit-job/:id',
      name: 'edit-job',
      component: () => import('@/views/employer/EditJobPage.vue'),
      meta: { requiresAuth: true, role: 'employer' }
    },
    {
      path: '/employer/applicants/:listing_id',
      name: 'view-applicants',
      component: () => import('@/views/employer/ViewApplicantsPage.vue'),
      meta: { requiresAuth: true, role: 'employer' }
    },
    { path: '/job/:id', name: 'job-detail', component: () => import('@/views/public/JobDetailPage.vue') },
  ]
})

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
      else if (authStore.role === 'admin') next('/admin')
      else next('/')
      return
    }
  }

  if (to.meta.guestOnly && isLoggedIn) {
    if (authStore.role === 'student') next('/student/dashboard')
    else if (authStore.role === 'employer') next('/employer/dashboard')
    else if (authStore.role === 'admin') next('/admin')
    else next('/')
    return
  }

  next()
})

export default router