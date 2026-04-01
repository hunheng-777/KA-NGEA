<template>
  <div class="min-h-[calc(100vh-60px)] bg-[#04080f]">
    <div class="grid md:grid-cols-2 min-h-[calc(100vh-60px)]">

      <!-- Left Brand Panel -->
      <div class="hidden md:flex flex-col justify-center px-16 py-16 relative overflow-hidden bg-gradient-to-br from-[#06101e] to-[#020609] border-r border-[#1a2740]">
        <div class="absolute top-[-120px] left-[-80px] w-[500px] h-[500px] rounded-full pointer-events-none" style="background: radial-gradient(ellipse, rgba(0,212,255,0.07) 0%, transparent 65%)"></div>
        <div class="relative z-10">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.18)] rounded-full px-3.5 py-1.5 mb-8 w-fit">
            <span class="w-[7px] h-[7px] rounded-full bg-[#00ff88] animate-pulse flex-shrink-0"></span>
            <span class="font-mono text-[10px] text-[#00d4ff] uppercase tracking-wider">Cambodia's #1 Cyber Career Platform</span>
          </div>
          <!-- Headline -->
          <h1 class="font-syne font-extrabold leading-[1.12] mb-4 bg-gradient-to-br from-white to-[#00d4ff] bg-clip-text text-transparent" style="font-size: clamp(28px,3vw,38px)">Your cybersecurity<br/>career starts here.</h1>
          <p class="font-dm text-sm text-[#7a9bbf] leading-[1.75] mb-9 max-w-[340px]">Connect with top government agencies, banks, and tech companies looking for the next generation of security professionals.</p>
          <!-- Features -->
          <div class="flex flex-col gap-3.5 mb-10">
            <div v-for="f in features" :key="f.icon" class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-[9px] bg-[#0e1623] border border-[#1a2740] flex items-center justify-center text-base flex-shrink-0"></div>
              <div class="font-dm text-[13.5px] text-[#7a9bbf]" v-html="f.text"></div>
            </div>
          </div>
          <!-- Stats -->
          <div class="flex gap-8">
            <div v-for="s in stats" :key="s.label">
              <div class="font-syne font-extrabold text-[26px] text-[#00d4ff] leading-none">{{ s.num }}</div>
              <div class="font-mono text-[11px] text-[#3d5a7a] mt-1">{{ s.label }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Form Panel -->
      <div class="flex flex-col justify-center items-center px-6 md:px-12 py-16 bg-[#04080f]">
        <div class="w-full max-w-[400px]">
          <span class="inline-block font-mono text-[10px] font-semibold text-[#3d5a7a] uppercase tracking-widest px-2.5 py-1 rounded border border-[#1a2740] bg-[#0e1623] mb-2.5">Welcome back</span>
          <h2 class="font-syne font-extrabold text-[28px] text-[#edf4fb] mb-1.5">Log In</h2>
          <p class="font-dm text-sm text-[#7a9bbf] mb-8">Don't have an account? <RouterLink to="/register" class="text-[#00d4ff] no-underline font-medium hover:underline">Create one free →</RouterLink></p>

          <form @submit.prevent="handleLogin" novalidate>
            <!-- Email -->
            <div class="mb-5">
              <label class="block font-mono text-[11px] font-semibold text-[#3d5a7a] uppercase tracking-[0.7px] mb-2">Email Address</label>
              <div class="relative">
                <input v-model="form.email" type="email" placeholder="sophea@example.com" autocomplete="email"
                  class="w-full px-3.5 py-3.5 bg-[#090f1a] border rounded-[10px] text-[#edf4fb] text-sm font-dm outline-none transition-all duration-200 placeholder:text-[#3d5a7a] focus:border-[#00d4ff] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.06)]"
                  :class="errors.email ? 'border-[#ff4757]' : 'border-[#1a2740]'" />
              </div>
              <p v-if="errors.email" class="font-mono text-[11px] text-[#ff4757] mt-1.5">{{ errors.email }}</p>
            </div>

            <!-- Password -->
            <div class="mb-5">
              <label class="block font-mono text-[11px] font-semibold text-[#3d5a7a] uppercase tracking-[0.7px] mb-2">Password</label>
              <div class="relative">
                <input v-model="form.password" :type="showPw ? 'text' : 'password'" placeholder="••••••••" autocomplete="current-password"
                  class="w-full px-3.5 pr-10 py-3.5 bg-[#090f1a] border rounded-[10px] text-[#edf4fb] text-sm font-dm outline-none transition-all duration-200 placeholder:text-[#3d5a7a] focus:border-[#00d4ff] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.06)]"
                  :class="errors.password ? 'border-[#ff4757]' : 'border-[#1a2740]'" />
                <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-sm font-mono text-[#7a9bbf] p-1 hover:text-[#00d4ff]" @click="showPw=!showPw">{{ showPw ? 'Hide' : 'Show' }}</button>
              </div>
              <p v-if="errors.password" class="font-mono text-[11px] text-[#ff4757] mt-1.5">{{ errors.password }}</p>
            </div>

            <!-- Remember me -->
            <div class="mb-4">
              <label class="flex items-center gap-2 font-dm text-[13px] text-[#7a9bbf] cursor-pointer">
                <input type="checkbox" v-model="form.remember" class="accent-[#00d4ff] w-[15px] h-[15px]" /> Remember me
              </label>
            </div>

            <!-- Error -->
            <div v-if="authError" class="flex items-center gap-2 bg-[rgba(255,71,87,0.08)] border border-[rgba(255,71,87,0.2)] rounded-[9px] px-3.5 py-3 text-[13px] text-[#ff4757] font-dm mb-4">
              <span>!</span> {{ authError }}
            </div>

            <!-- Submit -->
            <button type="submit" :disabled="loading"
              class="w-full py-3.5 bg-gradient-to-br from-[#00d4ff] to-[#00a8cc] text-[#04080f] font-syne font-bold text-[15px] rounded-[10px] border-none cursor-pointer transition-all duration-200 shadow-[0_0_24px_rgba(0,212,255,0.2)] mb-5 flex items-center justify-center hover:opacity-90 hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed">
              <span v-if="loading" class="w-[18px] h-[18px] border-2 border-black/20 border-t-[#04080f] rounded-full animate-spin"></span>
              <span v-else>Log In to KA-NGEA</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const form = reactive({ email: '', password: '', remember: false })
const errors = reactive({ email: '', password: '' })
const authError = ref('')
const loading = ref(false)
const showPw = ref(false)

const features = [
  { icon: '', text: '<strong style="color:#edf4fb">247 active listings</strong> — jobs, internships & scholarships' },
  { icon: '', text: '<strong style="color:#edf4fb">Cybersecurity-only</strong> — no irrelevant listings' },
  { icon: '', text: '<strong style="color:#edf4fb">Local & international</strong> — Phnom Penh + remote roles' },
]
const stats = [{ num: '247', label: 'Listings' }, { num: '58', label: 'Companies' }, { num: '1.2k', label: 'Students' }]

function validate() {
  errors.email = ''; errors.password = ''
  let ok = true
  if (!form.email) { errors.email = 'Email is required'; ok = false }
  else if (!/\S+@\S+\.\S+/.test(form.email)) { errors.email = 'Enter a valid email'; ok = false }
  if (!form.password) { errors.password = 'Password is required'; ok = false }
  return ok
}

async function handleLogin() {
  if (!validate()) return
  loading.value = true; authError.value = ''
  try {
    await authStore.login(form.email, form.password, form.remember)
    const role = authStore.role
    if (role === 'admin') router.push('/admin/dashboard')
    else if (role === 'employer') router.push('/employer/dashboard')
    else router.push('/student/dashboard')
  } catch (err) {
    authError.value = err.message || 'Invalid email or password. Please try again.'
  } finally { loading.value = false }
}
</script>
