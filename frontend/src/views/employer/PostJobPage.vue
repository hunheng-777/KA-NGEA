<template>
  <div class="min-h-screen py-10 px-4">
    <div class="max-w-2xl mx-auto bg-gray-900 border border-gray-700 rounded-xl p-8">
      <h1 class="text-2xl font-bold text-white mb-6">Post a Job</h1>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-1">Job Title</label>
          <input v-model="form.title" type="text" placeholder="e.g. Network Engineer"
            class="w-full border border-gray-600 bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-1">Company Name</label>
          <input v-model="form.company" type="text" placeholder="e.g. NexaCorp"
            class="w-full border border-gray-600 bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-1">Type</label>
          <select v-model="form.type"
            class="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select type</option>
            <option value="job">Job</option>
            <option value="internship">Internship</option>
            <option value="scholarship">Scholarship</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-1">Location</label>
          <input v-model="form.location" type="text" placeholder="e.g. Phnom Penh"
            class="w-full border border-gray-600 bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-1">Description</label>
          <textarea v-model="form.description" rows="4" placeholder="Describe the job..."
            class="w-full border border-gray-600 bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-1">Requirements</label>
          <textarea v-model="form.requirements" rows="3" placeholder="e.g. CCNA certified..."
            class="w-full border border-gray-600 bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-1">Deadline</label>
          <input v-model="form.deadline" type="date"
            class="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>
        <p v-if="success" class="text-green-400 text-sm">{{ success }}</p>

        <button type="submit"
          class="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition">
          {{ loading ? 'Posting...' : 'Post Job' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

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
const error = ref('')
const success = ref('')

const handleSubmit = async () => {
  error.value = ''
  success.value = ''

  if (!form.value.title || !form.value.company || !form.value.type || !form.value.deadline) {
    error.value = 'Please fill in all required fields.'
    return
  }

  try {
    loading.value = true
    await axios.post('http://localhost:3000/api/listings', form.value, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    success.value = 'Job posted successfully!'
    form.value = { title: '', company: '', type: '', location: '', description: '', requirements: '', deadline: '' }
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to post job.'
  } finally {
    loading.value = false
  }
}
</script>