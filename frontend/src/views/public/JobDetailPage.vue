<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <div class="max-w-4xl mx-auto">

      <!-- Loading -->
      <div v-if="loading" class="text-center text-gray-500 py-20">Loading...</div>

      <!-- Error -->
      <div v-else-if="error" class="text-center text-red-500 py-20">{{ error }}</div>

      <div v-else>
        <!-- Main Card -->
        <div class="bg-white rounded-xl shadow p-8 mb-6">

          <!-- Header -->
          <div class="flex items-start justify-between mb-6">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <span :class="typeBadgeClass" class="text-xs font-semibold px-3 py-1 rounded-full uppercase">
                  {{ listing.type }}
                </span>
                <span v-if="!listing.is_active" class="text-xs font-semibold px-3 py-1 rounded-full uppercase bg-gray-200 text-gray-600">
                  Closed
                </span>
              </div>
              <h1 class="text-3xl font-bold text-gray-900 mb-1">{{ listing.title }}</h1>
              <p class="text-lg text-gray-600">{{ listing.company }}</p>
            </div>

            <!-- Bookmark button (student only) -->
            <button v-if="isStudent" @click="toggleBookmark"
              class="text-2xl focus:outline-none transition"
              :title="bookmarked ? 'Remove bookmark' : 'Bookmark this listing'">
              {{ bookmarked ? '🔖' : '🤍' }}
            </button>
          </div>

          <!-- Info Row -->
          <div class="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
            <span class="flex items-center gap-1">📍 {{ listing.location || 'Not specified' }}</span>
            <span class="flex items-center gap-1">📅 Deadline: {{ formatDate(listing.deadline) }}</span>
            <span :class="daysLeft <= 7 ? 'text-red-500 font-semibold' : 'text-gray-600'" class="flex items-center gap-1">
              ⏰ {{ daysLeft }} days left
            </span>
          </div>

          <!-- Description -->
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-2">Description</h2>
            <p class="text-gray-600 leading-relaxed whitespace-pre-line">{{ listing.description }}</p>
          </div>

          <!-- Requirements -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-800 mb-2">Requirements</h2>
            <p class="text-gray-600 leading-relaxed whitespace-pre-line">{{ listing.requirements }}</p>
          </div>

          <!-- Apply Button -->
          <div v-if="isStudent">
            <div v-if="alreadyApplied" class="bg-green-50 border border-green-200 rounded-lg p-4 text-center text-green-700 font-medium">
              ✅ You have already applied to this listing
            </div>
            <div v-else>
              <button v-if="!showApplyForm" @click="showApplyForm = true"
                class="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition text-lg">
                Apply Now
              </button>

              <!-- Apply Form -->
              <div v-if="showApplyForm" class="mt-4 border border-gray-200 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-3">Submit Application</h3>
                <label class="block text-sm font-medium text-gray-700 mb-1">Cover Letter (optional)</label>
                <textarea v-model="coverLetter" rows="4" placeholder="Tell the employer why you're a great fit..."
                  class="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"></textarea>
                <div class="flex gap-3">
                  <button @click="submitApplication"
                    class="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition">
                    {{ applying ? 'Submitting...' : 'Submit Application' }}
                  </button>
                  <button @click="showApplyForm = false"
                    class="flex-1 bg-gray-100 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-200 transition">
                    Cancel
                  </button>
                </div>
                <p v-if="applyError" class="text-red-500 text-sm mt-2">{{ applyError }}</p>
                <p v-if="applySuccess" class="text-green-500 text-sm mt-2">{{ applySuccess }}</p>
              </div>
            </div>
          </div>

          <!-- Not logged in -->
          <div v-else-if="!isLoggedIn">
            <router-link to="/login"
              class="block w-full text-center bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition text-lg">
              Login to Apply
            </router-link>
          </div>

          <!-- Employer/Admin sees nothing -->
          <div v-else class="text-center text-gray-400 text-sm">
            Only students can apply to listings.
          </div>

        </div>

        <!-- Related Listings -->
        <div v-if="relatedListings.length > 0" class="bg-white rounded-xl shadow p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Related Listings</h2>
          <div class="space-y-3">
            <router-link v-for="related in relatedListings" :key="related.id"
              :to="`/job/${related.id}`"
              class="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
              <div>
                <p class="font-medium text-gray-800">{{ related.title }}</p>
                <p class="text-sm text-gray-500">{{ related.company }} · {{ related.location }}</p>
              </div>
              <span :class="getTypeBadge(related.type)" class="text-xs font-semibold px-2 py-1 rounded-full uppercase">
                {{ related.type }}
              </span>
            </router-link>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const id = route.params.id
const listing = ref(null)
const relatedListings = ref([])
const loading = ref(true)
const error = ref('')

const bookmarked = ref(false)
const showApplyForm = ref(false)
const coverLetter = ref('')
const applying = ref(false)
const applyError = ref('')
const applySuccess = ref('')
const alreadyApplied = ref(false)

const isLoggedIn = computed(() => authStore.isLoggedIn)
const isStudent = computed(() => authStore.isStudent)

const typeBadgeClass = computed(() => {
  if (!listing.value) return ''
  return getTypeBadge(listing.value.type)
})

const getTypeBadge = (type) => {
  if (type === 'job') return 'bg-blue-100 text-blue-700'
  if (type === 'internship') return 'bg-green-100 text-green-700'
  if (type === 'scholarship') return 'bg-purple-100 text-purple-700'
  return 'bg-gray-100 text-gray-700'
}

const daysLeft = computed(() => {
  if (!listing.value?.deadline) return 0
  const diff = new Date(listing.value.deadline) - new Date()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

onMounted(async () => {
  try {
    const [listingRes, allRes] = await Promise.all([
      axios.get(`http://localhost:3000/api/listings/${id}`),
      axios.get('http://localhost:3000/api/listings')
    ])

    listing.value = listingRes.data
    relatedListings.value = allRes.data
      .filter(l => l.id !== Number(id) && l.type === listingRes.data.type)
      .slice(0, 3)

    // Check if student already applied
    if (isStudent.value) {
      const appsRes = await axios.get(`http://localhost:3000/api/applications/student/${authStore.user.id}`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
      alreadyApplied.value = appsRes.data.some(a => a.listing_id === Number(id))

      // Check bookmark
      const bookmarkRes = await axios.get(`http://localhost:3000/api/bookmarks/${authStore.user.id}`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
      bookmarked.value = bookmarkRes.data.some(b => b.listing_id === Number(id))
    }
  } catch (err) {
    error.value = 'Failed to load listing.'
  } finally {
    loading.value = false
  }
})

const submitApplication = async () => {
  applyError.value = ''
  applySuccess.value = ''
  try {
    applying.value = true
    await axios.post('http://localhost:3000/api/applications', {
      listing_id: Number(id),
      cover_letter: coverLetter.value
    }, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    applySuccess.value = 'Application submitted successfully!'
    alreadyApplied.value = true
    showApplyForm.value = false
  } catch (err) {
    applyError.value = err.response?.data?.error || 'Failed to submit application.'
  } finally {
    applying.value = false
  }
}

const toggleBookmark = async () => {
  try {
    if (bookmarked.value) {
      await axios.delete('http://localhost:3000/api/bookmarks', {
        headers: { Authorization: `Bearer ${authStore.token}` },
        data: { listing_id: Number(id) }
      })
      bookmarked.value = false
    } else {
      await axios.post('http://localhost:3000/api/bookmarks', {
        listing_id: Number(id)
      }, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
      bookmarked.value = true
    }
  } catch (err) {
    console.error('Bookmark error:', err)
  }
}
</script>