<template>
  <div class="min-h-screen bg-[#04080f]">
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-[#04080f] via-[#06101e] to-[#020609]">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,212,255,0.1)_0%,_transparent_70%)]"></div>
      <div class="relative max-w-[1200px] mx-auto px-8 py-20 md:py-28">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div class="inline-flex items-center gap-2 bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.18)] rounded-full px-4 py-1.5 mb-6">
              <span class="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></span>
              <span class="font-mono text-[11px] text-[#00d4ff] uppercase tracking-wider">Cambodia's #1 Cyber Career Platform</span>
            </div>
            <h1 class="font-syne font-extrabold text-5xl md:text-6xl leading-[1.2] mb-5 bg-gradient-to-br from-white to-[#00d4ff] bg-clip-text text-transparent">
              Launch Your Cybersecurity Career
            </h1>
            <p class="font-dm text-base text-[#7a9bbf] leading-relaxed mb-8 max-w-lg">
              Connect with top government agencies, banks, and tech companies looking for the next generation of security professionals in Cambodia.
            </p>
            <div class="flex flex-wrap gap-4">
              <RouterLink to="/browse" class="px-8 py-3.5 bg-gradient-to-br from-[#00d4ff] to-[#00a8cc] text-[#04080f] font-syne font-bold rounded-[10px] transition-all duration-200 hover:opacity-90 hover:-translate-y-px shadow-[0_0_24px_rgba(0,212,255,0.2)]">
                Browse Opportunities →
              </RouterLink>
              <RouterLink v-if="!authStore.isLoggedIn" to="/register" class="px-8 py-3.5 border border-[#1a2740] text-[#edf4fb] font-dm font-medium rounded-[10px] transition-all duration-200 hover:border-[#00d4ff] hover:text-[#00d4ff]">
                Create Free Account
              </RouterLink>
            </div>
          </div>

          <!-- Featured Jobs Preview -->
          <div class="relative hidden md:block">
            <div class="bg-[#090f1a] border border-[#1a2740] rounded-[20px] p-6 shadow-2xl">
              <div class="flex items-center gap-2 mb-4">
                <div class="w-3 h-3 rounded-full bg-[#ff4757]"></div>
                <div class="w-3 h-3 rounded-full bg-[#ffd166]"></div>
                <div class="w-3 h-3 rounded-full bg-[#00ff88]"></div>
                <span class="ml-2 font-mono text-[10px] text-[#3d5a7a]">featured_jobs</span>
              </div>
              <div v-if="loading" class="space-y-3">
                <div v-for="i in 3" :key="i" class="bg-[#0e1623] border border-[#1a2740] rounded-[12px] p-4 animate-pulse">
                  <div class="h-4 bg-[#1a2740] rounded w-3/4 mb-2"></div>
                  <div class="h-3 bg-[#1a2740] rounded w-1/2"></div>
                </div>
              </div>
              <div v-else class="space-y-3">
                <div v-for="job in previewJobs" :key="job.id" class="bg-[#0e1623] border border-[#1a2740] rounded-[12px] p-4">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="font-syne font-bold text-[#edf4fb]">{{ job.title }}</h3>
                      <p class="font-dm text-xs text-[#3d5a7a] mt-1">{{ job.company }} • {{ job.location }}</p>
                    </div>
                    <span class="font-mono text-[10px] px-2 py-1 rounded bg-[rgba(0,212,255,0.1)] text-[#00d4ff]">{{ job.type }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="max-w-[1200px] mx-auto px-8 py-16">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div v-for="stat in stats" :key="stat.label">
          <div class="font-syne font-extrabold text-3xl text-[#00d4ff]">{{ stat.value }}</div>
          <div class="font-mono text-xs text-[#3d5a7a] mt-2">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- Featured Jobs Section -->
    <section class="max-w-[1200px] mx-auto px-8 py-12">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="font-syne font-extrabold text-3xl text-[#edf4fb]">Featured Opportunities</h2>
          <p class="font-dm text-[#7a9bbf] mt-2">Latest cybersecurity jobs and internships</p>
        </div>
        <RouterLink to="/browse" class="font-dm text-[#00d4ff] hover:underline">View all →</RouterLink>
      </div>

      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="i in 6" :key="i" class="bg-[#090f1a] border border-[#1a2740] rounded-[14px] p-5 animate-pulse">
          <div class="w-10 h-10 rounded-[10px] bg-[#1a2740] mb-3"></div>
          <div class="h-5 bg-[#1a2740] rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-[#1a2740] rounded w-1/2"></div>
        </div>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <div class="text-[#ff4757] font-dm mb-4">{{ error }}</div>
        <button @click="loadFeaturedJobs" class="px-6 py-2 bg-[#00d4ff] text-[#04080f] rounded-[8px] font-dm cursor-pointer">
          Try Again
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <JobCard v-for="job in featuredJobs" :key="job.id" :job="job" />
      </div>
    </section>

    <!-- Categories Section -->
    <section class="max-w-[1200px] mx-auto px-8 py-12">
      <h2 class="font-syne font-extrabold text-3xl text-[#edf4fb] text-center mb-4">Browse by Category</h2>
      <p class="font-dm text-[#7a9bbf] text-center mb-10">Find the perfect opportunity that matches your career path</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <RouterLink v-for="cat in categories" :key="cat.name" :to="`/browse?type=${cat.type}`"
          class="group bg-[#090f1a] border border-[#1a2740] rounded-[14px] p-6 text-center transition-all duration-200 hover:border-[#00d4ff] hover:bg-[rgba(0,212,255,0.04)]">
          <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-[#0e1623] border border-[#1a2740] flex items-center justify-center font-mono text-sm font-bold text-[#00d4ff] group-hover:border-[#00d4ff]">
            {{ cat.icon || '•' }}
          </div>
          <h3 class="font-syne font-bold text-[#edf4fb] group-hover:text-[#00d4ff]">{{ cat.name }}</h3>
          <p class="font-dm text-xs text-[#3d5a7a] mt-2">{{ cat.count }} opportunities</p>
        </RouterLink>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="max-w-[1200px] mx-auto px-8 py-16">
      <div class="bg-gradient-to-br from-[#0e1623] to-[#090f1a] border border-[#1a2740] rounded-[24px] p-12 text-center">
        <h2 class="font-syne font-extrabold text-3xl text-[#edf4fb] mb-4">Ready to Start Your Cyber Career?</h2>
        <p class="font-dm text-[#7a9bbf] max-w-2xl mx-auto mb-8">Join thousands of students who have already found their dream cybersecurity jobs through KA-NGEA.</p>
        <RouterLink v-if="!authStore.isLoggedIn" to="/register" class="inline-block px-8 py-3.5 bg-gradient-to-br from-[#00d4ff] to-[#00a8cc] text-[#04080f] font-syne font-bold rounded-[10px] transition-all duration-200 hover:opacity-90 hover:-translate-y-px shadow-[0_0_24px_rgba(0,212,255,0.2)]">
          Create Free Account →
        </RouterLink>
        <RouterLink v-else to="/browse" class="inline-block px-8 py-3.5 bg-gradient-to-br from-[#00d4ff] to-[#00a8cc] text-[#04080f] font-syne font-bold rounded-[10px] transition-all duration-200 hover:opacity-90 hover:-translate-y-px shadow-[0_0_24px_rgba(0,212,255,0.2)]">
          Browse Opportunities →
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import JobCard from '@/components/JobCard.vue'
import { listingsService } from '@/services/listings.service'

const authStore = useAuthStore()
const featuredJobs = ref([])
const previewJobs = ref([])
const loading = ref(true)
const error = ref('')

const stats = ref([
  { label: 'Active Listings', value: '0' },
  { label: 'Partner Companies', value: '0' },
  { label: 'Students Joined', value: '0' },
  { label: 'Placement Rate', value: '0%' }
])

const categories = ref([
  { name: 'Full-Time Jobs', type: 'job', icon: '', count: 0 },
  { name: 'Internships', type: 'intern', icon: '', count: 0 },
  { name: 'Scholarships', type: 'scholar', icon: '', count: 0 },
  { name: 'Remote', type: 'remote', icon: '', count: 0 }
])

async function loadFeaturedJobs() {
  loading.value = true
  error.value = ''

  try {
    const response = await listingsService.getFeaturedListings(6)
    featuredJobs.value = response.data || []
    previewJobs.value = featuredJobs.value.slice(0, 3)
  } catch (err) {
    console.error('Failed to load featured jobs:', err)
    error.value = err.response?.data?.message || 'Failed to load opportunities. Please try again.'
    featuredJobs.value = []
    previewJobs.value = []
  } finally {
    loading.value = false
  }
}

async function loadStats() {
  try {
    const response = await listingsService.getStats()
    if (response.data) {
      stats.value = [
        { label: 'Active Listings', value: response.data.totalListings || '0' },
        { label: 'Partner Companies', value: response.data.totalCompanies || '0' },
        { label: 'Students Joined', value: response.data.totalStudents || '0' },
        { label: 'Placement Rate', value: response.data.placementRate || '0%' }
      ]
    }
  } catch (err) {
    console.error('Failed to load stats:', err)
  }
}

async function loadCategoryCounts() {
  try {
    const response = await listingsService.getCategoryCounts()
    if (response.data) {
      categories.value = [
        { name: 'Full-Time Jobs', type: 'job', icon: '', count: response.data.job || 0 },
        { name: 'Internships', type: 'intern', icon: '', count: response.data.intern || 0 },
        { name: 'Scholarships', type: 'scholar', icon: '', count: response.data.scholar || 0 },
        { name: 'Remote', type: 'remote', icon: '', count: response.data.remote || 0 }
      ]
    }
  } catch (err) {
    console.error('Failed to load category counts:', err)
  }
}

onMounted(() => {
  loadFeaturedJobs()
  loadStats()
  loadCategoryCounts()
})
</script>
