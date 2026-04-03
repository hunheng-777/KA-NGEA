<template>
  <div class="min-h-screen py-10 px-4">
    <div class="max-w-5xl mx-auto">

      <!-- Welcome -->
      <h1 class="text-2xl font-bold text-white mb-2">Welcome, {{ user?.full_name }}!</h1>
      <p class="text-gray-400 mb-8">Manage your job listings and applicants here.</p>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4 mb-8">
        <div class="bg-gray-900 border border-gray-700 rounded-xl p-6 text-center">
          <p class="text-3xl font-bold text-blue-400">{{ stats.total }}</p>
          <p class="text-gray-400 text-sm mt-1">Total Listings</p>
        </div>
        <div class="bg-gray-900 border border-gray-700 rounded-xl p-6 text-center">
          <p class="text-3xl font-bold text-green-400">{{ stats.active }}</p>
          <p class="text-gray-400 text-sm mt-1">Active Listings</p>
        </div>
        <div class="bg-gray-900 border border-gray-700 rounded-xl p-6 text-center">
          <p class="text-3xl font-bold text-purple-400">{{ stats.total }}</p>
          <p class="text-gray-400 text-sm mt-1">Total Applicants</p>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="flex gap-3 mb-8">
        <router-link
          to="/employer/post-job"
          class="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
        >+ Post a Job</router-link>
      </div>

      <!-- My Listings -->
      <div class="bg-gray-900 border border-gray-700 rounded-xl p-6">
        <h2 class="text-lg font-semibold text-white mb-4">My Listings</h2>

        <div v-if="loading" class="text-center text-gray-400">Loading...</div>

        <div v-else-if="listings.length === 0" class="text-center text-gray-400 py-6">
          You have not posted any listings yet.
        </div>

        <table v-else class="w-full text-sm text-left">
          <thead class="bg-gray-800 text-gray-400 uppercase text-xs">
            <tr>
              <th class="px-4 py-3">Title</th>
              <th class="px-4 py-3">Type</th>
              <th class="px-4 py-3">Location</th>
              <th class="px-4 py-3">Deadline</th>
              <th class="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="listing in listings"
              :key="listing.id"
              class="border-t border-gray-700 hover:bg-gray-800"
            >
              <td class="px-4 py-3 font-medium text-white">{{ listing.title }}</td>
              <td class="px-4 py-3 text-gray-400 capitalize">{{ listing.type }}</td>
              <td class="px-4 py-3 text-gray-400">{{ listing.location }}</td>
              <td class="px-4 py-3 text-gray-400">{{ formatDate(listing.deadline) }}</td>
              <td class="px-4 py-3 flex gap-3">
                <router-link
                  :to="`/employer/edit-job/${listing.id}`"
                  class="text-blue-400 hover:text-blue-300 text-xs"
                >Edit</router-link>
                <router-link
                  :to="`/employer/applicants/${listing.id}`"
                  class="text-green-400 hover:text-green-300 text-xs"
                >Applicants</router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

const user = ref(null)
const listings = ref([])
const loading = ref(true)

const stats = computed(() => ({
  total: listings.value.length,
  active: listings.value.filter(l => l.is_active).length
}))

onMounted(async () => {
  try {
    const storedUser = localStorage.getItem('user')
    if (storedUser) user.value = JSON.parse(storedUser)

    const res = await axios.get('http://localhost:3000/api/listings', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })

    listings.value = res.data.filter(l => l.employer_id == user.value?.id)
  } catch (err) {
    console.error('Failed to load dashboard')
  } finally {
    loading.value = false
  }
})

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}
</script>