<template>
  <div class="job-detail-page">

    <!-- Loading -->
    <div v-if="loading" class="state-screen">
      <div class="loader-ring"></div>
      <p>Fetching job details…</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="state-screen">
      <span class="state-icon">⚠</span>
      <h2>Job not found</h2>
      <p>{{ error }}</p>
      <RouterLink to="/browse" class="btn-ghost">← Back to Browse</RouterLink>
    </div>

    <!-- Content -->
    <template v-else-if="job">

      <!-- Hero -->
      <section class="hero">
        <div class="hero-glow"></div>
        <div class="container">
          <RouterLink to="/browse" class="breadcrumb">← Back to Browse</RouterLink>

          <div class="hero-body">
            <!-- Logo -->
            <div class="logo-wrap">
              <img v-if="job.company_logo" :src="job.company_logo" :alt="job.company_name" class="logo-img" />
              <div v-else class="logo-fallback">{{ job.company_name?.charAt(0) }}</div>
            </div>

            <!-- Title block -->
            <div class="title-block">
              <div class="tags-row">
                <span class="tag tag--type">{{ job.job_type }}</span>
                <span class="tag tag--level">{{ job.experience_level }}</span>
                <span v-if="job.is_remote" class="tag tag--remote">Remote</span>
              </div>
              <h1 class="job-title">{{ job.title }}</h1>
              <p class="company-name">{{ job.company_name }}</p>
              <div class="meta-row">
                <span class="meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  {{ job.location }}
                </span>
                <span class="meta-item" v-if="job.department">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                  {{ job.department }}
                </span>
                <span class="meta-item" v-if="job.salary_min && job.salary_max">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M9 9h4.5a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3H15"/></svg>
                  ${{ formatSalary(job.salary_min) }} – ${{ formatSalary(job.salary_max) }}
                </span>
                <span class="meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Posted {{ timeAgo(job.created_at) }}
                </span>
              </div>
            </div>

            <!-- CTA -->
            <div class="cta-block">
              <button
                class="btn-apply"
                :class="{ applied: hasApplied, loading: applyLoading }"
                :disabled="hasApplied || applyLoading"
                @click="applyToJob"
              >
                <span v-if="applyLoading" class="btn-spinner"></span>
                <span v-else-if="hasApplied">✓ Applied</span>
                <span v-else>Apply Now</span>
              </button>
              <button
                class="btn-bookmark"
                :class="{ bookmarked: isBookmarked }"
                :title="isBookmarked ? 'Remove bookmark' : 'Save job'"
                @click="toggleBookmark"
              >
                <svg viewBox="0 0 24 24" :fill="isBookmarked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Body -->
      <div class="body-grid container">
        <!-- Main -->
        <main class="main-col">
          <div class="card" v-if="job.description">
            <h2 class="card-heading">About the Role</h2>
            <div class="prose" v-html="formattedDescription"></div>
          </div>

          <div class="card" v-if="job.responsibilities?.length">
            <h2 class="card-heading">Responsibilities</h2>
            <ul class="dot-list">
              <li v-for="(item, i) in job.responsibilities" :key="i">{{ item }}</li>
            </ul>
          </div>

          <div class="card" v-if="job.requirements?.length">
            <h2 class="card-heading">Requirements</h2>
            <ul class="dot-list">
              <li v-for="(item, i) in job.requirements" :key="i">{{ item }}</li>
            </ul>
          </div>

          <div class="card" v-if="job.skills?.length">
            <h2 class="card-heading">Skills & Technologies</h2>
            <div class="chips">
              <span v-for="skill in job.skills" :key="skill" class="chip">{{ skill }}</span>
            </div>
          </div>
        </main>

        <!-- Sidebar -->
        <aside class="side-col">
          <div class="card" v-if="job.deadline">
            <p class="side-label">Application Deadline</p>
            <p class="deadline-date" :class="{ urgent: isUrgent }">
              {{ formatDate(job.deadline) }}
            </p>
            <span v-if="isUrgent" class="urgent-pill">⚡ Closing soon</span>
          </div>

          <div class="card">
            <p class="side-label">Job Overview</p>
            <ul class="ov-list">
              <li><span>Type</span><span>{{ job.job_type }}</span></li>
              <li><span>Level</span><span>{{ job.experience_level }}</span></li>
              <li><span>Location</span><span>{{ job.location }}</span></li>
              <li v-if="job.is_remote"><span>Remote</span><span class="tag tag--remote tag--sm">Yes</span></li>
              <li v-if="job.openings"><span>Openings</span><span>{{ job.openings }}</span></li>
            </ul>
          </div>

          <div class="card" v-if="job.company_description">
            <p class="side-label">About {{ job.company_name }}</p>
            <p class="company-bio">{{ job.company_description }}</p>
          </div>
        </aside>
      </div>

    </template>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast" :class="`toast--${toast.type}`">
        {{ toast.message }}
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const auth = useAuthStore()

const job = ref(null)
const loading = ref(true)
const error = ref(null)
const hasApplied = ref(false)
const isBookmarked = ref(false)
const applyLoading = ref(false)
const toast = ref({ show: false, message: '', type: 'success' })

onMounted(async () => {
  await fetchJob()
  if (auth.user) await Promise.all([checkApplied(), checkBookmark()])
})

async function fetchJob() {
  loading.value = true
  const { data, error: err } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', route.params.id)
    .single()

  if (err || !data) {
    error.value = err?.message ?? 'Job not found.'
  } else {
    job.value = data
  }
  loading.value = false
}

async function checkApplied() {
  const { data } = await supabase
    .from('applications')
    .select('id')
    .eq('job_id', route.params.id)
    .eq('student_id', auth.user.id)
    .maybeSingle()
  hasApplied.value = !!data
}

async function checkBookmark() {
  const { data } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('job_id', route.params.id)
    .eq('student_id', auth.user.id)
    .maybeSingle()
  isBookmarked.value = !!data
}

async function applyToJob() {
  if (!auth.user) return showToast('Please log in to apply.', 'error')
  applyLoading.value = true
  const { error: err } = await supabase.from('applications').insert({
    job_id: job.value.id,
    student_id: auth.user.id,
    status: 'pending',
  })
  applyLoading.value = false
  if (err) showToast(err.message, 'error')
  else { hasApplied.value = true; showToast('Application submitted!', 'success') }
}

async function toggleBookmark() {
  if (!auth.user) return showToast('Please log in to bookmark.', 'error')
  if (isBookmarked.value) {
    await supabase.from('bookmarks').delete()
      .eq('job_id', job.value.id).eq('student_id', auth.user.id)
    isBookmarked.value = false
    showToast('Bookmark removed.', 'info')
  } else {
    await supabase.from('bookmarks').insert({ job_id: job.value.id, student_id: auth.user.id })
    isBookmarked.value = true
    showToast('Saved to bookmarks!', 'success')
  }
}

function showToast(message, type = 'success') {
  toast.value = { show: true, message, type }
  setTimeout(() => (toast.value.show = false), 3000)
}

const formatSalary = (n) => Number(n).toLocaleString()
const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
const timeAgo = (d) => {
  const days = Math.floor((Date.now() - new Date(d)) / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`
  return `${Math.floor(days / 30)} month(s) ago`
}
const isUrgent = computed(() => job.value?.deadline && (new Date(job.value.deadline) - Date.now()) / 86400000 <= 7)
const formattedDescription = computed(() => job.value?.description?.replace(/\n/g, '<br>') ?? '')
</script>

<style scoped>
/* tokens */
.job-detail-page {
  --accent: #00d4ff;
  --accent-glow: rgba(0, 212, 255, 0.1);
  --surface: #111827;
  --surface-2: #1a2235;
  --border: #1e2d45;
  --text: #e2e8f0;
  --muted: #64748b;
  --green: #10b981;
  --amber: #f59e0b;
  min-height: 100vh;
  background: #0b0f1a;
  color: var(--text);
  font-family: 'DM Sans', system-ui, sans-serif;
}

.container { max-width: 1080px; margin: 0 auto; padding: 0 24px; }

/* loading / error */
.state-screen {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; min-height: 60vh; gap: 14px;
  color: var(--muted); text-align: center;
}
.state-icon { font-size: 36px; }
.loader-ring {
  width: 40px; height: 40px;
  border: 3px solid var(--border); border-top-color: var(--accent);
  border-radius: 50%; animation: spin .75s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.btn-ghost {
  padding: 9px 20px; background: var(--surface-2); border: 1px solid var(--border);
  border-radius: 8px; color: var(--accent); text-decoration: none; font-size: 13px;
  transition: background .2s;
}
.btn-ghost:hover { background: var(--border); }

/* hero */
.hero {
  position: relative; background: var(--surface);
  border-bottom: 1px solid var(--border); padding: 44px 0 36px; overflow: hidden;
}
.hero-glow {
  position: absolute; top: -100px; right: -100px;
  width: 420px; height: 420px;
  background: radial-gradient(circle, var(--accent-glow) 0%, transparent 65%);
  pointer-events: none;
}
.breadcrumb {
  display: inline-block; color: var(--muted); text-decoration: none;
  font-size: 13px; margin-bottom: 26px; transition: color .2s;
}
.breadcrumb:hover { color: var(--accent); }

.hero-body {
  display: grid; grid-template-columns: auto 1fr auto;
  gap: 22px; align-items: flex-start;
}

/* logo */
.logo-img {
  width: 68px; height: 68px; border-radius: 12px;
  object-fit: cover; border: 1px solid var(--border);
}
.logo-fallback {
  width: 68px; height: 68px; border-radius: 12px;
  background: var(--surface-2); border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; font-weight: 800; color: var(--accent);
  font-family: 'Syne', sans-serif;
}

/* tags */
.tags-row { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 10px; }
.tag {
  padding: 3px 10px; border-radius: 20px; font-size: 11px;
  font-weight: 700; letter-spacing: .04em; text-transform: uppercase;
}
.tag--type  { background: rgba(0,212,255,.1);  color: #00d4ff; border: 1px solid rgba(0,212,255,.25); }
.tag--level { background: rgba(59,130,246,.1); color: #60a5fa; border: 1px solid rgba(59,130,246,.25); }
.tag--remote{ background: rgba(16,185,129,.1); color: #34d399; border: 1px solid rgba(16,185,129,.25); }
.tag--sm    { padding: 2px 8px; font-size: 10px; }

.job-title {
  font-family: 'Syne', sans-serif; font-size: clamp(20px, 2.8vw, 30px);
  font-weight: 800; color: #f1f5f9; line-height: 1.2; margin: 0 0 5px;
}
.company-name { font-size: 15px; color: #94a3b8; margin: 0 0 14px; }

.meta-row { display: flex; flex-wrap: wrap; gap: 18px; }
.meta-item { display: flex; align-items: center; gap: 5px; font-size: 13px; color: var(--muted); }
.meta-item svg { width: 13px; height: 13px; flex-shrink: 0; }

/* cta */
.cta-block { display: flex; flex-direction: column; gap: 10px; align-items: flex-end; }

.btn-apply {
  padding: 11px 26px; background: var(--accent); color: #0b0f1a;
  border: none; border-radius: 9px; font-size: 14px; font-weight: 700;
  cursor: pointer; min-width: 130px; display: flex; align-items: center;
  justify-content: center; gap: 7px; font-family: inherit;
  transition: all .2s;
}
.btn-apply:hover:not(:disabled) {
  background: #38e1ff; transform: translateY(-1px);
  box-shadow: 0 4px 18px rgba(0,212,255,.3);
}
.btn-apply:disabled { opacity: .6; cursor: not-allowed; }
.btn-apply.applied { background: var(--green); color: #fff; }
.btn-spinner {
  width: 15px; height: 15px;
  border: 2px solid rgba(0,0,0,.25); border-top-color: #0b0f1a;
  border-radius: 50%; animation: spin .7s linear infinite;
}

.btn-bookmark {
  width: 42px; height: 42px; background: var(--surface-2);
  border: 1px solid var(--border); border-radius: 9px;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: var(--muted); transition: all .2s;
}
.btn-bookmark svg { width: 17px; height: 17px; }
.btn-bookmark:hover { border-color: var(--accent); color: var(--accent); }
.btn-bookmark.bookmarked {
  color: var(--accent); border-color: var(--accent);
  background: var(--accent-glow);
}

/* body grid */
.body-grid {
  display: grid; grid-template-columns: 1fr 300px;
  gap: 26px; padding: 32px 24px 60px; align-items: start;
}
.main-col { display: flex; flex-direction: column; gap: 22px; }
.side-col { display: flex; flex-direction: column; gap: 18px; position: sticky; top: 22px; }

/* cards */
.card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 13px; padding: 26px;
}
.card-heading {
  font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700;
  color: #f1f5f9; margin: 0 0 18px; padding-bottom: 14px;
  border-bottom: 1px solid var(--border);
}
.prose { font-size: 14px; line-height: 1.8; color: #94a3b8; }

.dot-list {
  list-style: none; padding: 0; margin: 0;
  display: flex; flex-direction: column; gap: 9px;
}
.dot-list li {
  font-size: 14px; color: #94a3b8; line-height: 1.6;
  padding-left: 18px; position: relative;
}
.dot-list li::before {
  content: ''; position: absolute; left: 0; top: 9px;
  width: 5px; height: 5px; border-radius: 50%; background: var(--accent);
}

.chips { display: flex; flex-wrap: wrap; gap: 9px; }
.chip {
  padding: 5px 13px; background: var(--surface-2); border: 1px solid var(--border);
  border-radius: 7px; font-size: 12px; color: #94a3b8; transition: all .2s;
}
.chip:hover { border-color: var(--accent); color: var(--accent); }

/* sidebar */
.side-label {
  font-size: 11px; font-weight: 700; color: var(--muted);
  text-transform: uppercase; letter-spacing: .08em; margin: 0 0 12px;
}
.deadline-date { font-size: 15px; font-weight: 600; color: var(--text); margin: 0 0 8px; }
.deadline-date.urgent { color: var(--amber); }
.urgent-pill {
  display: inline-block; padding: 3px 10px;
  background: rgba(245,158,11,.12); color: var(--amber);
  border: 1px solid rgba(245,158,11,.3); border-radius: 20px;
  font-size: 11px; font-weight: 700;
}

.ov-list {
  list-style: none; padding: 0; margin: 0;
  display: flex; flex-direction: column; gap: 11px;
}
.ov-list li {
  display: flex; justify-content: space-between; align-items: center; font-size: 13px;
}
.ov-list li > span:first-child { color: var(--muted); }
.ov-list li > span:last-child { color: var(--text); font-weight: 500; }

.company-bio { font-size: 13px; line-height: 1.7; color: var(--muted); margin: 0; }

/* toast */
.toast {
  position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
  padding: 11px 22px; border-radius: 9px; font-size: 13px;
  font-weight: 600; z-index: 9999; box-shadow: 0 6px 24px rgba(0,0,0,.4);
}
.toast--success { background: var(--green); color: #fff; }
.toast--error   { background: #ef4444; color: #fff; }
.toast--info    { background: #3b82f6; color: #fff; }
.toast-enter-active, .toast-leave-active { transition: all .28s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(10px); }

/* responsive */
@media (max-width: 860px) {
  .hero-body { grid-template-columns: auto 1fr; }
  .cta-block { flex-direction: row; align-items: center; grid-column: 1 / -1; }
  .body-grid { grid-template-columns: 1fr; }
  .side-col { position: static; }
}
@media (max-width: 520px) {
  .hero-body { grid-template-columns: 1fr; }
}
</style>
