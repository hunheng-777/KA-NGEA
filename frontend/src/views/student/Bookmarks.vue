<template>
  <div class="bookmarks-page">
    <div class="container">

      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Saved Jobs</h1>
          <p class="page-sub">Jobs you've bookmarked for later</p>
        </div>
        <span class="total-count" v-if="bookmarks.length">
          {{ bookmarks.length }} saved
        </span>
      </div>

      <!-- Sort + Search -->
      <div class="toolbar">
        <div class="search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input v-model="searchQuery" class="search-input" placeholder="Search saved jobs…" />
        </div>
        <div class="sort-wrap">
          <label class="sort-label">Sort by</label>
          <select v-model="sortBy" class="sort-select">
            <option value="saved_desc">Saved (newest)</option>
            <option value="saved_asc">Saved (oldest)</option>
            <option value="title">Job title A–Z</option>
            <option value="company">Company A–Z</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="state-center">
        <div class="loader-ring"></div>
      </div>

      <!-- Empty bookmarks -->
      <div v-else-if="bookmarks.length === 0" class="empty-state">
        <div class="empty-icon">🔖</div>
        <h3>No saved jobs yet</h3>
        <p>Browse jobs and hit the bookmark icon to save them here.</p>
        <RouterLink to="/browse" class="btn-primary">Browse Jobs</RouterLink>
      </div>

      <!-- No search results -->
      <div v-else-if="sorted.length === 0" class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>No results</h3>
        <p>Try a different search term.</p>
      </div>

      <!-- Grid -->
      <div v-else class="bookmarks-grid">
        <div
          v-for="bm in sorted"
          :key="bm.id"
          class="bookmark-card"
          :class="{ 'card--applied': hasApplied(bm.job_id) }"
        >
          <!-- Remove button -->
          <button class="remove-btn" title="Remove bookmark" @click="removeBookmark(bm)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          <!-- Logo -->
          <div class="card-logo">
            <img v-if="bm.jobs?.company_logo" :src="bm.jobs.company_logo" :alt="bm.jobs?.company_name" />
            <div v-else class="logo-fallback">{{ bm.jobs?.company_name?.charAt(0) }}</div>
          </div>

          <!-- Tags -->
          <div class="card-tags">
            <span v-if="bm.jobs?.job_type" class="tag tag--type">{{ bm.jobs.job_type }}</span>
            <span v-if="bm.jobs?.is_remote" class="tag tag--remote">Remote</span>
            <span v-if="hasApplied(bm.job_id)" class="tag tag--applied">Applied</span>
          </div>

          <!-- Title -->
          <RouterLink :to="`/jobs/${bm.job_id}`" class="card-title">
            {{ bm.jobs?.title ?? 'Listing removed' }}
          </RouterLink>
          <p class="card-company">{{ bm.jobs?.company_name }}</p>

          <!-- Meta -->
          <div class="card-meta">
            <span v-if="bm.jobs?.location">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
              {{ bm.jobs.location }}
            </span>
            <span v-if="bm.jobs?.salary_min && bm.jobs?.salary_max">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M9 9h4.5a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3H15"/></svg>
              ${{ formatSalary(bm.jobs.salary_min) }}–${{ formatSalary(bm.jobs.salary_max) }}
            </span>
          </div>

          <!-- Deadline warning -->
          <div v-if="bm.jobs?.deadline && isUrgent(bm.jobs.deadline)" class="deadline-warn">
            ⚡ Closes {{ formatDate(bm.jobs.deadline) }}
          </div>

          <!-- Actions -->
          <div class="card-footer">
            <RouterLink :to="`/jobs/${bm.job_id}`" class="btn-view">View Details</RouterLink>
            <button
              class="btn-apply"
              :class="{ applied: hasApplied(bm.job_id) }"
              :disabled="hasApplied(bm.job_id) || applyingId === bm.job_id"
              @click="applyToJob(bm)"
            >
              <span v-if="applyingId === bm.job_id" class="btn-spinner"></span>
              <span v-else-if="hasApplied(bm.job_id)">✓ Applied</span>
              <span v-else>Apply</span>
            </button>
          </div>

          <!-- Saved date -->
          <p class="saved-date">Saved {{ timeAgo(bm.created_at) }}</p>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast" :class="`toast--${toast.type}`">{{ toast.message }}</div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const bookmarks = ref([])
const appliedIds = ref(new Set())
const loading = ref(true)
const searchQuery = ref('')
const sortBy = ref('saved_desc')
const applyingId = ref(null)
const toast = ref({ show: false, message: '', type: 'success' })

onMounted(async () => {
  await Promise.all([fetchBookmarks(), fetchApplied()])
})

async function fetchBookmarks() {
  loading.value = true
  const { data } = await supabase
    .from('bookmarks')
    .select('*, jobs(id, title, company_name, company_logo, location, job_type, is_remote, salary_min, salary_max, deadline)')
    .eq('student_id', auth.user.id)
    .order('created_at', { ascending: false })
  bookmarks.value = data ?? []
  loading.value = false
}

async function fetchApplied() {
  const { data } = await supabase
    .from('applications')
    .select('job_id')
    .eq('student_id', auth.user.id)
  appliedIds.value = new Set((data ?? []).map(a => a.job_id))
}

const sorted = computed(() => {
  let list = bookmarks.value
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(bm =>
      bm.jobs?.title?.toLowerCase().includes(q) ||
      bm.jobs?.company_name?.toLowerCase().includes(q)
    )
  }
  return [...list].sort((a, b) => {
    if (sortBy.value === 'saved_desc') return new Date(b.created_at) - new Date(a.created_at)
    if (sortBy.value === 'saved_asc')  return new Date(a.created_at) - new Date(b.created_at)
    if (sortBy.value === 'title')      return (a.jobs?.title ?? '').localeCompare(b.jobs?.title ?? '')
    if (sortBy.value === 'company')    return (a.jobs?.company_name ?? '').localeCompare(b.jobs?.company_name ?? '')
    return 0
  })
})

const hasApplied = (jobId) => appliedIds.value.has(jobId)

async function removeBookmark(bm) {
  await supabase.from('bookmarks').delete().eq('id', bm.id)
  bookmarks.value = bookmarks.value.filter(b => b.id !== bm.id)
  showToast('Bookmark removed.', 'info')
}

async function applyToJob(bm) {
  if (!bm.jobs) return
  applyingId.value = bm.job_id
  const { error } = await supabase.from('applications').insert({
    job_id: bm.job_id,
    student_id: auth.user.id,
    status: 'pending',
  })
  applyingId.value = null
  if (error) showToast(error.message, 'error')
  else {
    appliedIds.value = new Set([...appliedIds.value, bm.job_id])
    showToast('Application submitted!', 'success')
  }
}

function showToast(message, type = 'success') {
  toast.value = { show: true, message, type }
  setTimeout(() => (toast.value.show = false), 3000)
}

const formatSalary = (n) => Number(n).toLocaleString()
const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
const isUrgent = (d) => (new Date(d) - Date.now()) / 86400000 <= 7
const timeAgo = (d) => {
  const days = Math.floor((Date.now() - new Date(d)) / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`
  return `${Math.floor(days / 30)} month(s) ago`
}
</script>

<style scoped>
.bookmarks-page {
  --accent: #00d4ff;
  --surface: #111827;
  --surface-2: #1a2235;
  --border: #1e2d45;
  --text: #e2e8f0;
  --muted: #64748b;
  --green: #10b981;
  --amber: #f59e0b;
  --blue: #3b82f6;
  --red: #ef4444;
  min-height: 100vh;
  background: #0b0f1a;
  color: var(--text);
  font-family: 'DM Sans', system-ui, sans-serif;
  padding-bottom: 60px;
}

.container { max-width: 1060px; margin: 0 auto; padding: 0 24px; }

.page-header {
  display: flex; justify-content: space-between; align-items: center;
  flex-wrap: wrap; gap: 14px; padding: 40px 0 26px;
}
.page-title {
  font-family: 'Syne', sans-serif; font-size: clamp(22px, 3vw, 30px);
  font-weight: 800; margin: 0 0 4px; color: #f1f5f9;
}
.page-sub { font-size: 14px; color: var(--muted); margin: 0; }
.total-count {
  padding: 6px 16px; background: var(--surface);
  border: 1px solid var(--border); border-radius: 20px;
  font-size: 13px; font-weight: 700; color: var(--accent);
}

.toolbar { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 28px; }
.search-wrap { position: relative; flex: 1; min-width: 200px; }
.search-wrap svg {
  position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
  width: 14px; height: 14px; color: var(--muted); pointer-events: none;
}
.search-input {
  width: 100%; padding: 9px 14px 9px 33px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 9px; color: var(--text); font-size: 13px;
  font-family: inherit; transition: border-color .2s; box-sizing: border-box;
}
.search-input::placeholder { color: var(--muted); }
.search-input:focus { outline: none; border-color: var(--accent); }
.sort-wrap { display: flex; align-items: center; gap: 8px; }
.sort-label { font-size: 12px; color: var(--muted); white-space: nowrap; }
.sort-select {
  padding: 8px 12px; background: var(--surface); border: 1px solid var(--border);
  border-radius: 9px; color: var(--text); font-size: 13px;
  font-family: inherit; cursor: pointer;
}
.sort-select:focus { outline: none; border-color: var(--accent); }

.state-center { display: flex; justify-content: center; padding: 60px 0; }
.loader-ring {
  width: 38px; height: 38px; border: 3px solid var(--border);
  border-top-color: var(--accent); border-radius: 50%; animation: spin .75s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.empty-state {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; padding: 70px 0; gap: 10px; color: var(--muted);
}
.empty-icon { font-size: 44px; }
.empty-state h3 { font-size: 18px; color: var(--text); margin: 0; }
.empty-state p  { font-size: 14px; margin: 0; }
.btn-primary {
  margin-top: 8px; padding: 10px 24px; background: var(--accent);
  color: #0b0f1a; border-radius: 9px; font-weight: 700;
  text-decoration: none; font-size: 13px; transition: all .2s;
}
.btn-primary:hover { background: #38e1ff; transform: translateY(-1px); }

.bookmarks-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px;
}

.bookmark-card {
  position: relative; display: flex; flex-direction: column;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 14px; padding: 22px; gap: 8px;
  transition: border-color .2s, transform .15s;
}
.bookmark-card:hover { border-color: #2d3f5a; transform: translateY(-2px); }
.bookmark-card.card--applied { border-color: rgba(16,185,129,.25); }

.remove-btn {
  position: absolute; top: 14px; right: 14px;
  width: 28px; height: 28px; background: transparent;
  border: 1px solid transparent; border-radius: 6px;
  color: var(--muted); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all .2s; opacity: 0;
}
.remove-btn svg { width: 13px; height: 13px; }
.bookmark-card:hover .remove-btn { opacity: 1; }
.remove-btn:hover { border-color: var(--red); color: var(--red); background: rgba(239,68,68,.08); }

.card-logo { width: 48px; height: 48px; margin-bottom: 4px; }
.card-logo img { width: 48px; height: 48px; border-radius: 10px; object-fit: cover; border: 1px solid var(--border); }
.logo-fallback {
  width: 48px; height: 48px; border-radius: 10px; background: var(--surface-2);
  border: 1px solid var(--border); display: flex; align-items: center;
  justify-content: center; font-size: 18px; font-weight: 800;
  color: var(--accent); font-family: 'Syne', sans-serif;
}

.card-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.tag {
  padding: 2px 9px; border-radius: 20px; font-size: 10px;
  font-weight: 700; text-transform: uppercase; letter-spacing: .04em;
}
.tag--type    { background: rgba(0,212,255,.1);   color: #00d4ff; border: 1px solid rgba(0,212,255,.2); }
.tag--remote  { background: rgba(16,185,129,.1);  color: #34d399; border: 1px solid rgba(16,185,129,.2); }
.tag--applied { background: rgba(16,185,129,.12); color: #10b981; border: 1px solid rgba(16,185,129,.3); }

.card-title {
  font-size: 15px; font-weight: 700; color: #f1f5f9;
  text-decoration: none; line-height: 1.3; transition: color .2s;
}
.card-title:hover { color: var(--accent); }
.card-company { font-size: 13px; color: #94a3b8; margin: 0; }

.card-meta { display: flex; flex-wrap: wrap; gap: 12px; }
.card-meta span { display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--muted); }
.card-meta svg { width: 12px; height: 12px; flex-shrink: 0; }

.deadline-warn {
  font-size: 11px; font-weight: 700; color: var(--amber);
  background: rgba(245,158,11,.08); border: 1px solid rgba(245,158,11,.2);
  border-radius: 6px; padding: 4px 10px;
}

.card-footer { display: flex; gap: 8px; margin-top: auto; padding-top: 10px; }

.btn-view {
  flex: 1; padding: 8px 12px; background: var(--surface-2);
  border: 1px solid var(--border); border-radius: 8px; color: var(--text);
  text-decoration: none; font-size: 12px; font-weight: 600;
  text-align: center; transition: all .2s;
}
.btn-view:hover { border-color: var(--accent); color: var(--accent); }

.btn-apply {
  flex: 1; padding: 8px 12px; background: var(--accent); border: none;
  border-radius: 8px; color: #0b0f1a; font-size: 12px; font-weight: 700;
  cursor: pointer; font-family: inherit; display: flex; align-items: center;
  justify-content: center; gap: 6px; transition: all .2s;
}
.btn-apply:hover:not(:disabled) { background: #38e1ff; }
.btn-apply:disabled { opacity: .6; cursor: not-allowed; }
.btn-apply.applied { background: rgba(16,185,129,.15); color: #10b981; border: 1px solid rgba(16,185,129,.3); }

.btn-spinner {
  width: 13px; height: 13px; border: 2px solid rgba(0,0,0,.25);
  border-top-color: #0b0f1a; border-radius: 50%; animation: spin .7s linear infinite;
}

.saved-date { font-size: 11px; color: var(--muted); margin: 2px 0 0; }

.toast {
  position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
  padding: 11px 22px; border-radius: 9px; font-size: 13px; font-weight: 600;
  z-index: 9999; box-shadow: 0 6px 24px rgba(0,0,0,.4);
}
.toast--success { background: var(--green); color: #fff; }
.toast--error   { background: var(--red); color: #fff; }
.toast--info    { background: var(--blue); color: #fff; }
.toast-enter-active, .toast-leave-active { transition: all .28s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(10px); }

@media (max-width: 500px) {
  .bookmarks-grid { grid-template-columns: 1fr; }
  .toolbar { flex-direction: column; align-items: stretch; }
  .sort-select { flex: 1; }
}
</style>
