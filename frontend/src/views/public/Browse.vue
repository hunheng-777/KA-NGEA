<template>
  <div class="min-h-screen bg-gray-900 text-white px-6 py-10">
    <div class="max-w-5xl mx-auto">

      <!-- Header -->
      <h1 class="text-3xl font-bold mb-2">Browse Jobs</h1>
      <p class="text-gray-400 mb-6">Find cybersecurity jobs, internships & scholarships</p>

      <!-- Search -->
      <input
        v-model="search"
        type="text"
        placeholder="Search job title or company..."
        class="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-blue-500 transition"
      />

      <!-- Filters -->
      <div class="flex gap-3 flex-wrap mb-8">
        <button
          v-for="f in filters" :key="f"
          @click="activeFilter = f"
          :class="activeFilter === f
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-transparent text-gray-400 border-gray-600 hover:border-blue-400'"
          class="border px-4 py-1.5 rounded-full text-sm transition">
          {{ f }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20 text-gray-500">
        <p>Loading jobs...</p>
      </div>

      <div v-else>
        <!-- Count -->
        <p class="text-gray-500 text-sm mb-4">{{ filteredJobs.length }} jobs found</p>

        <!-- Cards -->
        <div v-if="filteredJobs.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <JobCard
            v-for="job in filteredJobs"
            :key="job.id"
            :job="job"
            @bookmark="handleBookmark"
          />
        </div>

        <!-- Empty -->
        <div v-else class="text-center py-20 text-gray-500">
          <p>No jobs found. Try a different search.</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import JobCard from '../../components/JobCard.vue'
import api from '../../services/api.js'

const route = useRoute()
const search = ref('')
const loading = ref(false)
const filters = ['All', 'Full-time', 'Internship', 'Scholarship']
const activeFilter = ref('All')

function applyQueryFilter() {
  const type = route.query.type
  if (type === 'job') activeFilter.value = 'Full-time'
  else if (type === 'intern') activeFilter.value = 'Internship'
  else if (type === 'scholar') activeFilter.value = 'Scholarship'
  else activeFilter.value = 'All'
}

const jobs = ref([])

onMounted(async () => {
  loading.value = true
  try {
    const res = await api.get('/listings')
    jobs.value = res.data.map(job => ({
      ...job,
      type: job.type === 'job' ? 'Full-time' :
            job.type === 'internship' ? 'Internship' :
            job.type === 'scholarship' ? 'Scholarship' : job.type
    }))
  } catch (err) {
    console.error('Failed to load listings', err)
  } finally {
    loading.value = false
    applyQueryFilter()
  }
})

watch(() => route.query, () => applyQueryFilter())

const handleBookmark = async (jobId) => {
  try {
    await api.post('/bookmarks', { listing_id: jobId })
    alert('Bookmarked!')
  } catch (err) {
    alert('Please login to bookmark!')
  }
}

const filteredJobs = computed(() => {
  return jobs.value.filter(job => {
    const matchSearch =
      job.title.toLowerCase().includes(search.value.toLowerCase()) ||
      job.company.toLowerCase().includes(search.value.toLowerCase())
    const matchFilter = activeFilter.value === 'All' || job.type === activeFilter.value
    return matchSearch && matchFilter
  })
})
</script>