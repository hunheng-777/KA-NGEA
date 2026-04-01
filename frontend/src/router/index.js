import { createRouter, createWebHistory } from 'vue-router'
import Browse from '../views/public/Browse.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import AdminManageUsers from '../views/AdminManageUsers.vue'
import AdminManageListings from '../views/AdminManageListings.vue'

const routes = [
  { path: '/browse', component: Browse },
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: AdminManageUsers,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/listings',
    name: 'admin-listings',
    component: AdminManageListings,
    meta: { requiresAuth: true, role: 'admin' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router