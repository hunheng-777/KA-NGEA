<template>
  <div class="min-h-screen py-10 px-4">
    <div class="max-w-4xl mx-auto">

      <!-- LOADING -->
      <div v-if="loading" class="text-center py-20 text-gray-400">
        Loading job details...
      </div>

      <!-- ERROR -->
      <div v-else-if="error" class="text-center py-20 text-red-400">
        Job not found or failed to load.
      </div>

      <!-- CONTENT -->
      <div v-else>

        <!-- TOP CARD -->
        <div class="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
          <div class="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 class="text-2xl font-bold text-white mb-1">{{ job.title }}</h1>
              <p class="text-gray-400 text-sm">{{ job.company }}</p>
            </div>
            <span
              class="px-3 py-1 rounded-full text-xs font-semibold"
              :class="{
                'bg-blue-900 text-blue-300':   job.type === 'job',
                'bg-green-900 text-green-300':  job.type === 'internship',
                'bg-purple-900 text-purple-300': job.type === 'scholarship'
              }"
            >{{ job.type }}</span>
          </div>

          <!-- META INFO -->
          <div class="flex flex-wrap gap-4 mt-4 text-sm text-gray-400">
            <span>📍 {{ job.location || 'Not specified' }}</span>
            <span>💰 {{ job.salary || 'Not specified' }}</span>
            <span>📅 Deadline: {{ formatDate(job.deadline) }}</span>
          </div>
        </div>

        <!-- DESCRIPTION -->
        <div class="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
          <h2 class="text-lg font-semibold text-white mb-3">Job Description</h2>
          <p class="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{{ job.description }}</p>
        </div>

        <!-- REQUIREMENTS -->
        <div class="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
          <h2 class="text-lg font-semibold text-white mb-3">Requirements</h2>
          <p class="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{{ job.requirements }}</p>
        </div>

        <!-- RELATED LISTINGS -->
        <div v-if="relatedJobs.length > 0" class="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
          <h2 class="text-lg font-semibold text-white mb-3">Related Listings</h2>
          <div class="flex flex-col gap-3">
            <router-link
              v-for="related in relatedJobs"
              :key="related.id"
              :to="`/jobs/${related.id}`"
              class="flex justify-between items-center p-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition"
            >
              <div>
                <p class="text-sm font-medium text-white">{{ related.title }}</p>
                <p class="text-xs text-gray-400">{{ related.company }}</p>
              </div>
              <span class="text-xs text-gray-500">{{ formatDate(related.deadline) }}</span>
            </router-link>
          </div>
        </div>

        <!-- ACTION BUTTONS -->
        <div class="flex gap-3">

          <!-- APPLY BUTTON -->
          <button
            v-if="authStore.isStudent"
            @click="handleApply"
            :disabled="alreadyApplied || applying"
            class="flex-1 py-3 rounded-xl font-semibold text-sm transition"
            :class="alreadyApplied
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'"
          >
            {{ alreadyApplied ? 'Already Applied' : applying ? 'Applying...' : 'Apply Now' }}
          </button>

          <!-- NOT LOGGED IN -->
          <router-link
            v-else-if="!authStore.isLoggedIn"
            to="/login"
            class="flex-1 py-3 rounded-xl font-semibold text-sm text-center bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Login to Apply
          </router-link>

          <!-- BOOKMARK BUTTON -->
          <button
            v-if="authStore.isStudent"
            @click="handleBookmark"
            class="px-5 py-3 rounded-xl font-semibold text-sm border transition"
            :class="bookmarked
              ? 'border-yellow-500 text-yellow-400 hover:bg-yellow-900'
              : 'border-gray-600 text-gray-400 hover:bg-gray-800'"
          >
            {{ bookmarked ? '★ Saved' : '☆ Save' }}
          </button>

        </div>

        <!-- APPLY MODAL -->
        <div
          v-if="showApplyModal"
          class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
        >
          <div class="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <h3 class="text-lg font-semibold text-white mb-4">Apply for {{ job.title }}</h3>
            <label class="block text-sm text-gray-400 mb-1">Cover Letter (optional)</label>
            <textarea
              v-model="coverLetter"
              rows="4"
              placeholder="Write a short message to the employer..."
              class="w-full border border-gray-600 bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-2 text-sm mb-4"
            ></textarea>
            <p v-if="applyError" class="text-red-400 text-sm mb-3">{{ applyError }}</p>
            <div class="flex gap-3">
              <button
                @click="showApplyModal = false"
                class="flex-1 border border-gray-600 text-gray-300 rounded-lg py-2 text-sm hover:bg-gray-800"
              >Cancel</button>
              <button
                @click="submitApply"
                class="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm hover:bg-blue-700"
              >Submit Application</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api.js'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const job = ref({})
const relatedJobs = ref([])
const loading = ref(true)
const error = ref(false)
const bookmarked = ref(false)
const alreadyApplied = ref(false)
const applying = ref(false)
const showApplyModal = ref(false)
const coverLetter = ref('')
const applyError = ref('')

async function fetchJob() {
  loading.value = true
  error.value = false
  try {
    const res = await api.get(`/listings/${route.params.id}`)
    job.value = res.data.job
    relatedJobs.value = res.data.related || []
    bookmarked.value = res.data.bookmarked || false
    alreadyApplied.value = res.data.alreadyApplied || false
  } catch (err) {
    console.error(err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchJob)
watch(() => route.params.id, fetchJob)

function handleApply() {
  showApplyModal.value = true
}

async function submitApply() {
  applyError.value = ''
  applying.value = true
  try {
    await api.post('/applications', {
      listing_id: job.value.id,
      cover_letter: coverLetter.value
    })
    alreadyApplied.value = true
    showApplyModal.value = false
    coverLetter.value = ''
  } catch (err) {
    applyError.value = err.response?.data?.error || 'Failed to apply.'
  } finally {
    applying.value = false
  }
}

async function handleBookmark() {
  try {
    if (bookmarked.value) {
      await api.delete('/bookmarks', { data: { listing_id: job.value.id } })
      bookmarked.value = false
    } else {
      await api.post('/bookmarks', { listing_id: job.value.id })
      bookmarked.value = true
    }
  } catch (err) {
    console.error(err)
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}
</script>