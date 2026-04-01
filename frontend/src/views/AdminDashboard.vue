<template>
  <div class="p-6 max-w-6xl mx-auto">

    <!-- TOP BAR -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Admin Dashboard</h1>
      <span class="text-sm text-gray-500">Welcome back, Admin</span>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="text-center py-10 text-gray-400">
      Loading dashboard...
    </div>

    <!-- ERROR -->
    <div v-else-if="error" class="text-red-500 text-center py-10">
      Failed to load dashboard. Please refresh.
    </div>

    <!-- MAIN CONTENT -->
    <div v-else>

      <!-- STATS CARDS -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-gray-100 rounded-lg p-4">
          <p class="text-xs text-gray-500 mb-1">Total Users</p>
          <p class="text-3xl font-bold">{{ stats.totalUsers }}</p>
          <p class="text-xs text-green-500 mt-1">+{{ stats.newUsersThisWeek }} this week</p>
        </div>
        <div class="bg-gray-100 rounded-lg p-4">
          <p class="text-xs text-gray-500 mb-1">Total Listings</p>
          <p class="text-3xl font-bold">{{ stats.totalListings }}</p>
          <p class="text-xs text-gray-400 mt-1">Jobs, internships, scholarships</p>
        </div>
        <div class="bg-gray-100 rounded-lg p-4">
          <p class="text-xs text-gray-500 mb-1">Total Applications</p>
          <p class="text-3xl font-bold">{{ stats.totalApplications }}</p>
          <p class="text-xs text-gray-400 mt-1">Across all listings</p>
        </div>
        <div class="bg-gray-100 rounded-lg p-4">
          <p class="text-xs text-gray-500 mb-1">New Users This Week</p>
          <p class="text-3xl font-bold text-green-500">{{ stats.newUsersThisWeek }}</p>
          <p class="text-xs text-green-500 mt-1">Active growth</p>
        </div>
      </div>

      <!-- BOTTOM GRID -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- RECENT ACTIVITY -->
        <div class="border border-gray-200 rounded-lg p-5">
          <h2 class="text-base font-semibold mb-3">Recent Activity</h2>

          <p v-if="activity.length === 0" class="text-gray-400 text-sm">
            No recent activity yet.
          </p>

          <div
            v-for="(item, index) in activity"
            :key="index"
            class="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0"
          >
            <span
              class="mt-1 w-2 h-2 rounded-full flex-shrink-0"
              :class="{
                'bg-blue-400':  item.type === 'register',
                'bg-yellow-400': item.type === 'job',
                'bg-green-500': item.type === 'application'
              }"
            ></span>
            <div>
              <p class="text-sm">{{ item.message }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ item.time }}</p>
            </div>
          </div>
        </div>

        <!-- RIGHT SIDE -->
        <div class="flex flex-col gap-4">

          <!-- QUICK ACTIONS -->
          <div class="border border-gray-200 rounded-lg p-5">
            <h2 class="text-base font-semibold mb-3">Quick Actions</h2>
            <div class="flex gap-3">
              <router-link to="/admin/users" class="flex-1 text-center border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50">
                Manage Users
              </router-link>
              <router-link to="/admin/listings" class="flex-1 text-center border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50">
                Manage Listings
              </router-link>
            </div>
          </div>

          <!-- USERS BY ROLE -->
          <div class="border border-gray-200 rounded-lg p-5">
            <h2 class="text-base font-semibold mb-3">Users by Role</h2>
            <table class="w-full text-sm">
              <thead>
                <tr class="text-left text-xs text-gray-400 border-b border-gray-100">
                  <th class="pb-2">Role</th>
                  <th class="pb-2">Count</th>
                  <th class="pb-2">This Week</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-gray-100">
                  <td class="py-2 text-blue-500">Student</td>
                  <td class="py-2">{{ stats.totalStudents }}</td>
                  <td class="py-2 text-green-500">+{{ stats.newStudentsThisWeek }}</td>
                </tr>
                <tr class="border-b border-gray-100">
                  <td class="py-2 text-yellow-500">Employer</td>
                  <td class="py-2">{{ stats.totalEmployers }}</td>
                  <td class="py-2 text-green-500">+{{ stats.newEmployersThisWeek }}</td>
                </tr>
                <tr>
                  <td class="py-2 text-gray-500">Admin</td>
                  <td class="py-2">{{ stats.totalAdmins }}</td>
                  <td class="py-2 text-gray-400">—</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api.js'

const loading = ref(true)
const error = ref(false)

const stats = ref({
  totalUsers: 0,
  totalListings: 0,
  totalApplications: 0,
  newUsersThisWeek: 0,
  totalStudents: 0,
  totalEmployers: 0,
  totalAdmins: 0,
  newStudentsThisWeek: 0,
  newEmployersThisWeek: 0
})

const activity = ref([])

onMounted(async () => {
  try {
    const res = await api.get('/api/admin/stats')
    stats.value = res.data.stats
    activity.value = res.data.activity
  } catch (err) {
    console.error(err)
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>