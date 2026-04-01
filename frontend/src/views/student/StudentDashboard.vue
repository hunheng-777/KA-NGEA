<template>
  <div class="p-6 max-w-6xl mx-auto">

    <!-- TOP BAR -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Student Dashboard</h1>
      <span class="text-sm text-gray-500">Welcome back, {{ studentName }}!</span>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="text-center py-10 text-gray-400">
      Loading dashboard...
    </div>

    <div v-else>

      <!-- STATS CARDS -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-gray-100 rounded-lg p-4">
          <p class="text-xs text-gray-500 mb-1">Total Applications</p>
          <p class="text-3xl font-bold">{{ stats.totalApplications }}</p>
        </div>
        <div class="bg-gray-100 rounded-lg p-4">
          <p class="text-xs text-gray-500 mb-1">Bookmarks Saved</p>
          <p class="text-3xl font-bold">{{ stats.totalBookmarks }}</p>
        </div>
        <div class="bg-gray-100 rounded-lg p-4">
          <p class="text-xs text-gray-500 mb-1">Pending Responses</p>
          <p class="text-3xl font-bold text-yellow-500">{{ stats.pendingApplications }}</p>
        </div>
      </div>

      <!-- BOTTOM GRID -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- RECENT APPLICATIONS -->
        <div class="border border-gray-200 rounded-lg p-5">
          <h2 class="text-base font-semibold mb-3">Recent Applications</h2>

          <p v-if="recentApplications.length === 0" class="text-gray-400 text-sm">
            You have not applied to anything yet.
          </p>

          <div
            v-for="(app, index) in recentApplications"
            :key="index"
            class="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
          >
            <div>
              <p class="text-sm font-medium">{{ app.title }}</p>
              <p class="text-xs text-gray-400">{{ app.company_name }}</p>
            </div>
            <span
              class="text-xs px-2 py-1 rounded-full"
              :class="{
                'bg-yellow-100 text-yellow-700': app.status === 'pending',
                'bg-green-100 text-green-700':  app.status === 'accepted',
                'bg-red-100 text-red-700':      app.status === 'rejected'
              }"
            >{{ app.status }}</span>
          </div>
        </div>

        <!-- QUICK LINKS -->
        <div class="border border-gray-200 rounded-lg p-5">
          <h2 class="text-base font-semibold mb-3">Quick Links</h2>
          <div class="flex flex-col gap-3">
            <router-link to="/browse" class="text-center border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50">
              Browse Jobs
            </router-link>
            <router-link to="/student/applications" class="text-center border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50">
              My Applications
            </router-link>
            <router-link to="/student/bookmarks" class="text-center border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50">
              My Bookmarks
            </router-link>
            <router-link to="/student/profile" class="text-center border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50">
              My Profile
            </router-link>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api.js'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const studentName = authStore.userName

const loading = ref(true)

const stats = ref({
  totalApplications: 0,
  totalBookmarks: 0,
  pendingApplications: 0
})

const recentApplications = ref([])

onMounted(async () => {
  try {
    const res = await api.get('/students/dashboard')
    stats.value = res.data.stats
    recentApplications.value = res.data.recentApplications
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>