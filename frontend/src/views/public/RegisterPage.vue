<template>
  <div class="min-h-[calc(100vh-60px)] bg-[#04080f]">
    <div class="grid md:grid-cols-2 min-h-[calc(100vh-60px)]">

      <!-- Left Brand Panel -->
      <div class="hidden md:flex flex-col justify-center px-16 py-16 relative overflow-hidden bg-gradient-to-br from-[#06101e] to-[#020609] border-r border-[#1a2740]">
        <div class="absolute top-[-120px] left-[-80px] w-[500px] h-[500px] rounded-full pointer-events-none" style="background: radial-gradient(ellipse, rgba(0,212,255,0.07) 0%, transparent 65%)"></div>
        <div class="relative z-10">
          <div class="inline-flex items-center gap-2 bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.18)] rounded-full px-3.5 py-1.5 mb-8 w-fit">
            <span class="w-[7px] h-[7px] rounded-full bg-[#00ff88] animate-pulse flex-shrink-0"></span>
            <span class="font-mono text-[10px] text-[#00d4ff] uppercase tracking-wider">Join 1,200+ Cybersecurity Students</span>
          </div>
          <h1 class="font-syne font-extrabold leading-[1.12] mb-4 bg-gradient-to-br from-white to-[#00d4ff] bg-clip-text text-transparent" style="font-size: clamp(28px,3vw,38px)">Build your cyber<br/>career today.</h1>
          <p class="font-dm text-sm text-[#7a9bbf] leading-[1.75] mb-9 max-w-[340px]">Create a free account to apply for jobs, save opportunities, track your applications, and get discovered by top employers.</p>
          <div class="flex flex-col gap-3.5 mb-10">
            <div v-for="feature in features" :key="feature.icon" class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-[9px] bg-[#0e1623] border border-[#1a2740] flex items-center justify-center text-base flex-shrink-0">{{ feature.icon }}</div>
              <div class="font-dm text-[13.5px] text-[#7a9bbf]" v-html="feature.text"></div>
            </div>
          </div>
          <div class="flex gap-7">
            <div v-for="stat in stats" :key="stat.label">
              <div class="font-syne font-extrabold text-[24px] text-[#00d4ff] leading-none">{{ stat.num }}</div>
              <div class="font-mono text-[10px] text-[#3d5a7a] mt-1">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Form Panel -->
      <div class="flex flex-col justify-center items-center px-6 md:px-12 py-10 bg-[#04080f] overflow-y-auto">
        <div class="w-full max-w-[420px]">
          <span class="inline-block font-mono text-[10px] font-semibold text-[#3d5a7a] uppercase tracking-widest px-2.5 py-1 rounded border border-[#1a2740] bg-[#0e1623] mb-2.5">Create account</span>
          <h2 class="font-syne font-extrabold text-[28px] text-[#edf4fb] mb-1.5">Sign Up Free</h2>
          <p class="font-dm text-sm text-[#7a9bbf] mb-6">Already have an account? <RouterLink to="/login" class="text-[#00d4ff] no-underline font-medium hover:underline">Log in →</RouterLink></p>

          <!-- Role Selector -->
          <div class="mb-6">
            <div class="font-mono text-[11px] font-semibold text-[#3d5a7a] uppercase tracking-[0.7px] mb-2.5">I am a...</div>
            <div class="flex gap-2">
              <button v-for="roleItem in roles" :key="roleItem.value" type="button"
                class="flex-1 py-3 px-2 rounded-[10px] border text-[12px] font-semibold font-dm cursor-pointer transition-all duration-200 flex flex-col items-center gap-1.5"
                :class="form.role === roleItem.value ? 'border-[#00d4ff] bg-[rgba(0,212,255,0.08)] text-[#00d4ff]' : 'border-[#1a2740] bg-[#090f1a] text-[#7a9bbf] hover:border-[#233352] hover:text-[#edf4fb]'"
                @click="form.role = roleItem.value">
                <span class="text-[22px]">{{ roleItem.icon }}</span><span>{{ roleItem.label }}</span>
              </button>
            </div>
          </div>

          <form @submit.prevent="handleRegister" novalidate>
            <!-- Full Name -->
            <div class="mb-[18px]">
              <label class="block font-mono text-[11px] font-semibold text-[#3d5a7a] uppercase tracking-[0.7px] mb-2">Full Name</label>
              <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] pointer-events-none"></span>
                <input v-model="form.fullName" type="text" placeholder="Sophea Ros"
                  class="w-full pl-[42px] pr-3.5 py-3 bg-[#090f1a] border rounded-[10px] text-[#edf4fb] text-sm font-dm outline-none transition-all duration-200 placeholder:text-[#3d5a7a] focus:border-[#00d4ff] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.06)]"
                  :class="errors.fullName ? 'border-[#ff4757]' : 'border-[#1a2740]'" />
              </div>
              <p v-if="errors.fullName" class="font-mono text-[11px] text-[#ff4757] mt-1">{{ errors.fullName }}</p>
            </div>

            <!-- Email -->
            <div class="mb-[18px]">
              <label class="block font-mono text-[11px] font-semibold text-[#3d5a7a] uppercase tracking-[0.7px] mb-2">Email Address</label>
              <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] pointer-events-none"></span>
                <input v-model="form.email" type="email" placeholder="sophea@example.com" autocomplete="email"
                  class="w-full pl-[42px] pr-3.5 py-3 bg-[#090f1a] border rounded-[10px] text-[#edf4fb] text-sm font-dm outline-none transition-all duration-200 placeholder:text-[#3d5a7a] focus:border-[#00d4ff] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.06)]"
                  :class="errors.email ? 'border-[#ff4757]' : 'border-[#1a2740]'" />
              </div>
              <p v-if="errors.email" class="font-mono text-[11px] text-[#ff4757] mt-1">{{ errors.email }}</p>
            </div>

            <!-- Password -->
            <div class="mb-[18px]">
              <label class="block font-mono text-[11px] font-semibold text-[#3d5a7a] uppercase tracking-[0.7px] mb-2">Password</label>
              <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] pointer-events-none"></span>
                <input v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="Min. 8 characters" autocomplete="new-password" @input="checkStrength"
                  class="w-full pl-[42px] pr-10 py-3 bg-[#090f1a] border rounded-[10px] text-[#edf4fb] text-sm font-dm outline-none transition-all duration-200 placeholder:text-[#3d5a7a] focus:border-[#00d4ff] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.06)]"
                  :class="errors.password ? 'border-[#ff4757]' : 'border-[#1a2740]'" />
                <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-base p-1" @click="showPassword = !showPassword">{{ showPassword ? 'Hide' : 'Show' }}</button>
              </div>
              <!-- Strength bars -->
              <div v-if="form.password" class="flex items-center gap-2 mt-2">
                <div class="flex gap-1 flex-1">
                  <div v-for="i in 4" :key="i" class="flex-1 h-[3px] rounded-sm transition-all duration-300"
                    :class="i <= passwordScore ? { weak: 'bg-[#ff4757]', medium: 'bg-[#ffd166]', good: 'bg-[#00d4ff]', strong: 'bg-[#00ff88]' }[passwordStrength] : 'bg-[#1a2740]'"></div>
                </div>
                <span class="font-mono text-[11px]" :class="{ weak: 'text-[#ff4757]', medium: 'text-[#ffd166]', good: 'text-[#00d4ff]', strong: 'text-[#00ff88]' }[passwordStrength]">{{ strengthLabel }}</span>
              </div>
              <p v-if="errors.password" class="font-mono text-[11px] text-[#ff4757] mt-1">{{ errors.password }}</p>
            </div>

            <!-- Student / Employer extra field -->
            <div v-if="form.role === 'student'" class="mb-[18px]">
              <label class="block font-mono text-[11px] font-semibold text-[#3d5a7a] uppercase tracking-[0.7px] mb-2">University / Institution</label>
              <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] pointer-events-none"></span>
                <input v-model="form.institution" type="text" placeholder="e.g. RUPP, AUPP, ITC..."
                  class="w-full pl-[42px] pr-3.5 py-3 bg-[#090f1a] border border-[#1a2740] rounded-[10px] text-[#edf4fb] text-sm font-dm outline-none transition-all duration-200 placeholder:text-[#3d5a7a] focus:border-[#00d4ff] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.06)]" />
              </div>
            </div>
            <div v-if="form.role === 'employer'" class="mb-[18px]">
              <label class="block font-mono text-[11px] font-semibold text-[#3d5a7a] uppercase tracking-[0.7px] mb-2">Company Name</label>
              <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] pointer-events-none"></span>
                <input v-model="form.company" type="text" placeholder="e.g. CamSec Solutions"
                  class="w-full pl-[42px] pr-3.5 py-3 bg-[#090f1a] border border-[#1a2740] rounded-[10px] text-[#edf4fb] text-sm font-dm outline-none transition-all duration-200 placeholder:text-[#3d5a7a] focus:border-[#00d4ff] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.06)]" />
              </div>
            </div>

            <!-- Terms -->
            <div class="mb-4">
              <label class="flex items-start gap-2 font-dm text-[13px] text-[#7a9bbf] cursor-pointer leading-[1.5]">
                <input type="checkbox" v-model="form.agreed" class="accent-[#00d4ff] w-[15px] h-[15px] mt-0.5 flex-shrink-0" />
                I agree to the <a href="#" class="text-[#00d4ff] no-underline">Terms of Service</a> and <a href="#" class="text-[#00d4ff] no-underline">Privacy Policy</a>
              </label>
              <p v-if="errors.agreed" class="font-mono text-[11px] text-[#ff4757] mt-1">{{ errors.agreed }}</p>
            </div>

            <!-- Error -->
            <div v-if="authError" class="flex items-center gap-2 bg-[rgba(255,71,87,0.08)] border border-[rgba(255,71,87,0.2)] rounded-[9px] px-3.5 py-3 text-[13px] text-[#ff4757] font-dm mb-4">
              <span>!</span> {{ authError }}
            </div>

            <!-- Submit -->
            <button type="submit" :disabled="isLoading"
              class="w-full py-3.5 bg-gradient-to-br from-[#00d4ff] to-[#00a8cc] text-[#04080f] font-syne font-bold text-[15px] rounded-[10px] border-none cursor-pointer transition-all duration-200 shadow-[0_0_24px_rgba(0,212,255,0.2)] mb-[18px] flex items-center justify-center hover:opacity-90 hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed">
              <span v-if="isLoading" class="w-[18px] h-[18px] border-2 border-black/20 border-t-[#04080f] rounded-full animate-spin"></span>
              <span v-else>Create My Account →</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const showPassword = ref(false)
const isLoading = ref(false)
const authError = ref('')
const passwordScore = ref(0)

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  role: route.query.role || 'student',
  institution: '',
  company: '',
  agreed: false
})

const errors = reactive({
  fullName: '',
  email: '',
  password: '',
  agreed: ''
})

const roles = [
  { value: 'student', label: 'Student', icon: '' },
  { value: 'employer', label: 'Employer', icon: '' },
  { value: 'admin', label: 'Admin', icon: '' }
]

const features = [
  { icon: '', text: '<strong style="color:#edf4fb">One-click apply</strong> — save your profile, apply instantly' },
  { icon: '', text: '<strong style="color:#edf4fb">Bookmark anything</strong> — never miss a deadline' },
  { icon: '', text: '<strong style="color:#edf4fb">Track all applications</strong> — in your personal dashboard' },
]

const stats = [
  { num: 'Free', label: 'Forever' },
  { num: '2 min', label: 'Sign Up' },
  { num: '3 roles', label: 'Student / Employer / Admin' }
]

function checkStrength() {
  const password = form.password
  let score = 0

  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  passwordScore.value = score
}

const passwordStrength = computed(() => {
  if (passwordScore.value <= 1) return 'weak'
  if (passwordScore.value <= 2) return 'medium'
  if (passwordScore.value === 3) return 'good'
  return 'strong'
})

const strengthLabel = computed(() => {
  const labels = { weak: 'Weak', medium: 'Medium', good: 'Good', strong: 'Strong' }
  return labels[passwordStrength.value]
})

function validate() {
  // Clear all errors
  Object.keys(errors).forEach(key => errors[key] = '')
  let isValid = true

  if (!form.fullName.trim()) {
    errors.fullName = 'Full name is required'
    isValid = false
  }

  if (!form.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Enter a valid email'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
    isValid = false
  }

  if (!form.agreed) {
    errors.agreed = 'You must agree to the terms'
    isValid = false
  }

  return isValid
}

async function handleRegister() {
  if (!validate()) return

  isLoading.value = true
  authError.value = ''

  try {
    await authStore.register({
      email: form.email,
      password: form.password,
      fullName: form.fullName,
      role: form.role,
      institution: form.institution,
      company: form.company
    })

    // Redirect based on role
    if (form.role === 'employer') {
      router.push('/employer/dashboard')
    } else if (form.role === 'admin') {
      router.push('/admin/dashboard')
    } else {
      router.push('/student/dashboard')
    }
  } catch (error) {
    authError.value = error.message || 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>
