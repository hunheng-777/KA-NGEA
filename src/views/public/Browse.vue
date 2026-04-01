<template>
  <div class="min-h-screen bg-gray-900 text-white px-6 py-10">
    <div class="max-w-5xl mx-auto">

      <!-- Header -->
      <h1 class="text-3xl font-bold mb-2">Browse Jobs </h1>
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
        <p class="text-4xl mb-3"></p>
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
          <p class="text-4xl mb-3"></p>
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

const route = useRoute()
const search = ref('')
const loading = ref(false)
const filters = ['All', 'Full-time', 'Internship', 'Scholarship']
const activeFilter = ref('All')

// Read query param from Navbar links (?type=job etc)
function applyQueryFilter() {
  const type = route.query.type
  if (type === 'job') activeFilter.value = 'Full-time'
  else if (type === 'intern') activeFilter.value = 'Internship'
  else if (type === 'scholar') activeFilter.value = 'Scholarship'
  else activeFilter.value = 'All'
}

onMounted(() => applyQueryFilter())
watch(() => route.query, () => applyQueryFilter())

// ================================
// WEEK 1 — Fake data
// ================================
const jobs = ref([
  { id: 1, title: 'Cybersecurity Intern', company: 'TM Berhad', location: 'Kuala Lumpur', type: 'Internship' },
  { id: 2, title: 'Network Engineer', company: 'Maxis', location: 'Penang', type: 'Full-time' },
  { id: 3, title: 'Security Analyst', company: 'CIMB', location: 'Remote', type: 'Full-time' },
  { id: 4, title: 'IT Scholarship 2025', company: 'YTL Foundation', location: 'KL', type: 'Scholarship' },
  { id: 5, title: 'SOC Analyst Intern', company: 'Celcom', location: 'Shah Alam', type: 'Internship' },
  { id: 6, title: 'Cloud Security Engineer', company: 'Tenaga Nasional', location: 'KL', type: 'Full-time' },
])

// ================================
// WEEK 2 — Uncomment when Person 4 ready
// ================================
// import { supabase } from '../../lib/supabase.js'
//
// onMounted(async () => {
//   loading.value = true
//   const { data, error } = await supabase
//     .from('listings')
//     .select('*')
//     .eq('status', 'active')
//   if (!error) jobs.value = data
//   loading.value = false
//   applyQueryFilter()
// })

// ================================
// WEEK 2 — Uncomment when Person 5 ready
// ================================
const handleBookmark = async (jobId) => {
  // const { data: { user } } = await supabase.auth.getUser()
  // if (!user) return alert('Please login to bookmark!')
  // const { error } = await supabase
  //   .from('bookmarks')
  //   .insert({ listing_id: jobId, student_id: user.id })
  // if (!error) alert('Bookmarked! ')
  alert('Bookmark coming soon! ')
}

// Search + Filter logic
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