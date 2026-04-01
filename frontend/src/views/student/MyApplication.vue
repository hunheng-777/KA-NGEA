<template>
  <div class="p-6 max-w-6xl mx-auto">

    <!-- TOP BAR -->
    <h1 class="text-2xl font-bold mb-6">My Applications</h1>

    <!-- LOADING -->
    <div v-if="loading" class="text-center py-10 text-gray-400">
      Loading applications...
    </div>

    <!-- EMPTY STATE -->
    <div v-else-if="applications.length === 0" class="text-center py-10 text-gray-400">
      You have not applied to any jobs yet.
      <div class="mt-4">
        <router-link to="/browse" class="border border-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-50">
          Browse Jobs
        </router-link>
      </div>
    </div>

    <!-- APPLICATIONS LIST -->
    <div v-else class="border border-gray-200 rounded-lg overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr class="text-left text-xs text-gray-500 border-b border-gray-200">
            <th class="px-4 py-3">Job Title</th>
            <th class="px-4 py-3">Company</th>
            <th class="px-4 py-3">Date Applied</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="app in applications"
            :key="app.id"
            class="border-b border-gray-100 last:border-0 hover:bg-gray-50"
          >
            <td class="px-4 py-3">
              <router-link :to="`/jobs/${app.listing_id}`" class="text-blue-500 hover:underline">
                {{ app.title }}
              </router-link>
            </td>
            <td class="px-4 py-3 text-gray-600">{{ app.company_name }}</td>
            <td class="px-4 py-3 text-gray-400">{{ formatDate(app.applied_at) }}</td>
            <td class="px-4 py-3">
              <span
                class="text-xs px-2 py-1 rounded-full"
                :class="{
                  'bg-yellow-100 text-yellow-700': app.status === 'pending',
                  'bg-green-100 text-green-700':  app.status === 'accepted',
                  'bg-red-100 text-red-700':      app.status === 'rejected'
                }"
              >{{ app.status }}</span>
            </td>
            <td class="px-4 py-3">
              <button
                v-if="app.status === 'pending'"
                @click="withdraw(app.id)"
                class="text-xs text-red-500 hover:underline"
              >
                Withdraw
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api.js'

const loading = ref(true)
const applications = ref([])

onMounted(async () => {
  try {
    const res = await api.get('/applications/my')
    applications.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})

async function withdraw(id) {
  if (confirm('Are you sure you want to withdraw this application?')) {
    await api.delete(`/applications/${id}`)
    applications.value = applications.value.filter(a => a.id !== id)
  }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString()
}
</script>