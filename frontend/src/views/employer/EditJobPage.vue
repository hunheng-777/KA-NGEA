<template>
  <div class="min-h-screen py-10 px-4">
    <div class="max-w-2xl mx-auto bg-gray-900 border border-gray-700 rounded-xl p-8">
      <h1 class="text-2xl font-bold text-white mb-6">Edit Job</h1>

      <div v-if="loadingData" class="text-center text-gray-400">Loading...</div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-1">Job Title</label>
          <input v-model="form.title" type="text"
            class="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-1">Company Name</label>
          <input v-model="form.company" type="text"
            class="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-1">Type</label>
          <select v-model="form.type"
            class="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="job">Job</option>
            <option value="internship">Internship</option>
            <option value="scholarship">Scholarship</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-1">Location</label>
          <input v-model="form.location" type="text"
            class="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-1">Description</label>
          <textarea v-model="form.description" rows="4"
            class="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-1">Requirements</label>
          <textarea v-model="form.requirements" rows="3"
            class="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-1">Deadline</label>
          <input v-model="form.deadline" type="date"
            class="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>
        <p v-if="success" class="text-green-400 text-sm">{{ success }}</p>

        <div class="flex gap-3">
          <button type="submit"
            class="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition">
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
          <button type="button" @click="handleDelete"
            class="flex-1 bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition">
            Delete Listing
          </button>
        </div>

        <router-link to="/employer/dashboard" class="block text-center text-sm text-gray-400 hover:text-white mt-2">
          ← Back to Dashboard
        </router-link>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

const route = useRoute()
const router = useRouter()
const id = route.params.id

const form = ref({
  title: '',
  company: '',
  type: '',
  location: '',
  description: '',
  requirements: '',
  deadline: ''
})

const loading = ref(false)
const loadingData = ref(true)
const error = ref('')
const success = ref('')

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:3000/api/listings/${id}`)
    const d = res.data
    form.value = {
      title: d.title,
      company: d.company,
      type: d.type,
      location: d.location,
      description: d.description,
      requirements: d.requirements,
      deadline: d.deadline?.split('T')[0]
    }
  } catch (err) {
    error.value = 'Failed to load listing.'
  } finally {
    loadingData.value = false
  }
})

const handleSubmit = async () => {
  error.value = ''
  success.value = ''
  try {
    loading.value = true
    await axios.put(`http://localhost:3000/api/listings/${id}`, form.value, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    success.value = 'Listing updated successfully!'
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to update listing.'
  } finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  if (!confirm('Are you sure you want to delete this listing?')) return
  try {
    await axios.delete(`http://localhost:3000/api/listings/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    router.push('/employer/dashboard')
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to delete listing.'
  }
}
</script>