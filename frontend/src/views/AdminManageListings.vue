<template>
  <div class="p-6 max-w-6xl mx-auto">

    <!-- TOP BAR -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Manage Listings</h1>
      <router-link to="/admin" class="text-sm text-gray-500 hover:underline">
        ← Back to Dashboard
      </router-link>
    </div>

    <!-- SEARCH + FILTER -->
    <div class="flex gap-3 mb-5">
      <input
        v-model="search"
        type="text"
        placeholder="Search by title or company..."
        class="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full max-w-sm"
      />
      <select v-model="typeFilter" class="border border-gray-300 rounded-lg px-3 py-2 text-sm">
        <option value="">All Types</option>
        <option value="job">Job</option>
        <option value="internship">Internship</option>
        <option value="scholarship">Scholarship</option>
      </select>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="text-center py-10 text-gray-400">Loading listings...</div>

    <!-- ERROR -->
    <div v-else-if="error" class="text-red-500 text-center py-10">
      Failed to load listings. Please refresh.
    </div>

    <!-- TABLE -->
    <div v-else>
      <table class="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
        <thead class="bg-gray-100 text-left text-xs text-gray-500">
          <tr>
            <th class="px-4 py-3">Title</th>
            <th class="px-4 py-3">Company</th>
            <th class="px-4 py-3">Type</th>
            <th class="px-4 py-3">Posted</th>
            <th class="px-4 py-3">Deadline</th>
            <th class="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredListings.length === 0">
            <td colspan="6" class="text-center py-6 text-gray-400">No listings found.</td>
          </tr>
          <tr
            v-for="listing in filteredListings"
            :key="listing.id"
            class="border-t border-gray-100 hover:bg-gray-50"
          >
            <td class="px-4 py-3 font-medium">{{ listing.title }}</td>
            <td class="px-4 py-3 text-gray-500">{{ listing.company_name }}</td>
            <td class="px-4 py-3">
              <span
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="{
                  'bg-blue-100 text-blue-600': listing.type === 'job',
                  'bg-green-100 text-green-600': listing.type === 'internship',
                  'bg-purple-100 text-purple-600': listing.type === 'scholarship'
                }"
              >
                {{ listing.type }}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-400">{{ formatDate(listing.created_at) }}</td>
            <td class="px-4 py-3 text-gray-400">{{ formatDate(listing.deadline) }}</td>
            <td class="px-4 py-3 flex gap-3">
              <router-link
                :to="`/jobs/${listing.id}`"
                class="text-blue-500 hover:underline text-xs"
              >
                View
              </router-link>
              <button
                @click="confirmDelete(listing)"
                class="text-red-500 hover:underline text-xs"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- CONFIRM DELETE MODAL -->
    <div
      v-if="listingToDelete"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl p-6 w-80 shadow-lg">
        <h3 class="font-semibold text-base mb-2">Delete Listing?</h3>
        <p class="text-sm text-gray-500 mb-4">
          Are you sure you want to delete <strong>{{ listingToDelete.title }}</strong>? This cannot be undone.
        </p>
        <div class="flex gap-3">
          <button
            @click="listingToDelete = null"
            class="flex-1 border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="deleteListing"
            class="flex-1 bg-red-500 text-white rounded-lg py-2 text-sm hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api.js'

const listings = ref([])
const loading = ref(true)
const error = ref(false)
const search = ref('')
const typeFilter = ref('')
const listingToDelete = ref(null)

onMounted(async () => {
  try {
    const res = await api.get('/api/admin/listings')
    listings.value = res.data
  } catch (err) {
    console.error(err)
    error.value = true
  } finally {
    loading.value = false
  }
})

const filteredListings = computed(() => {
  return listings.value.filter(listing => {
    const matchSearch =
      listing.title.toLowerCase().includes(search.value.toLowerCase()) ||
      listing.company_name.toLowerCase().includes(search.value.toLowerCase())
    const matchType = typeFilter.value === '' || listing.type === typeFilter.value
    return matchSearch && matchType
  })
})

function confirmDelete(listing) {
  listingToDelete.value = listing
}

async function deleteListing() {
  try {
    await api.delete(`/api/admin/listings/${listingToDelete.value.id}`)
    listings.value = listings.value.filter(l => l.id !== listingToDelete.value.id)
    listingToDelete.value = null
  } catch (err) {
    console.error(err)
    alert('Failed to delete listing.')
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}
</script>