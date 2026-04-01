<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow p-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Applicants</h1>
      <p class="text-gray-500 mb-6">{{ listing?.title }} — {{ listing?.company }}</p>

      <div v-if="loading" class="text-center text-gray-500">Loading...</div>

      <div v-else-if="applicants.length === 0" class="text-center text-gray-400 py-10">
        No one has applied yet.
      </div>

      <table v-else class="w-full text-sm text-left">
        <thead class="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th class="px-4 py-3">Name</th>
            <th class="px-4 py-3">Email</th>
            <th class="px-4 py-3">Date Applied</th>
            <th class="px-4 py-3">Cover Letter</th>
            <th class="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="app in applicants" :key="app.id" class="border-t">
            <td class="px-4 py-3">{{ app.full_name }}</td>
            <td class="px-4 py-3">{{ app.email }}</td>
            <td class="px-4 py-3">{{ formatDate(app.applied_at) }}</td>
            <td class="px-4 py-3 max-w-xs truncate">{{ app.cover_letter || '—' }}</td>
            <td class="px-4 py-3">
              <select v-model="app.status" @change="updateStatus(app.id, app.status)"
                class="border border-gray-300 rounded px-2 py-1 text-xs">
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="error" class="text-red-500 text-sm mt-4">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

const route = useRoute()
const listing_id = route.params.listing_id

const applicants = ref([])
const listing = ref(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {

    const [appsRes, listingRes] = await Promise.all([
      axios.get(`http://localhost:3000/api/applications/listing/${listing_id}`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      }),
      axios.get(`http://localhost:3000/api/listings/${listing_id}`)
    ])

    applicants.value = appsRes.data
    listing.value = listingRes.data
  } catch (err) {
    error.value = 'Failed to load applicants.'
  } finally {
    loading.value = false
  }
})

const updateStatus = async (id, status) => {
  try {
    await axios.put(`http://localhost:3000/api/applications/${id}`, { status }, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
  } catch (err) {
    error.value = 'Failed to update status.'
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}
</script>