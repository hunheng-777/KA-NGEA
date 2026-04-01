import { createRouter, createWebHistory } from 'vue-router'
import Browse from '../views/public/Browse.vue'

const routes = [
  { path: '/browse', component: Browse },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router