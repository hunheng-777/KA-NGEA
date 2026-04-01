<template>
  <nav class="sticky top-0 z-[100] h-[60px] bg-[rgba(4,8,15,0.95)] border-b border-[#1a2740] backdrop-blur-xl flex items-center px-8 gap-6">

    <!-- Logo -->
    <RouterLink to="/" class="flex items-center gap-2.5 no-underline flex-shrink-0">
      <div class="w-[34px] h-[34px] rounded-[9px] bg-gradient-to-br from-[#00d4ff] to-[#006e8a] flex items-center justify-center text-base font-bold text-white shadow-[0_0_16px_rgba(0,212,255,0.3)]">KA</div>
      <span class="font-syne font-extrabold text-[19px] text-[#edf4fb] tracking-tight">KA-<span class="text-[#00d4ff]">NGEA</span></span>
    </RouterLink>

    <!-- Desktop Nav Links -->
    <div class="hidden md:flex gap-0.5 flex-1">
      <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to"
        class="font-dm font-medium text-[13.5px] text-[#7a9bbf] px-3.5 py-1.5 rounded-lg no-underline transition-all duration-200 hover:text-[#edf4fb] hover:bg-[#0e1623]">
        {{ link.label }}
      </RouterLink>
    </div>

    <!-- Desktop Right -->
    <div class="hidden md:flex items-center gap-2.5 ml-auto">
      <template v-if="!authStore.isLoggedIn">
        <RouterLink to="/login" class="font-dm font-medium text-[13.5px] text-[#7a9bbf] px-[18px] py-2 rounded-[9px] border border-[#233352] no-underline transition-all duration-200 hover:text-[#edf4fb] hover:border-[#3d5a7a]">Log In</RouterLink>
        <RouterLink to="/register" class="font-syne font-bold text-[13px] text-[#04080f] px-5 py-2 rounded-[9px] bg-gradient-to-br from-[#00d4ff] to-[#00a8cc] no-underline transition-all duration-200 shadow-[0_0_20px_rgba(0,212,255,0.2)] hover:opacity-90 hover:-translate-y-px">Sign Up Free</RouterLink>
      </template>
      <template v-else>
        <RouterLink v-if="authStore.isEmployer" to="/employer/post-job" class="font-dm font-medium text-[13.5px] text-[#7a9bbf] px-[18px] py-2 rounded-[9px] border border-[#233352] no-underline transition-all duration-200 hover:text-[#edf4fb] hover:border-[#3d5a7a]">+ Post Job</RouterLink>
        <RouterLink v-if="authStore.isAdmin" to="/admin/dashboard" class="font-dm font-medium text-[13.5px] text-[#7a9bbf] px-[18px] py-2 rounded-[9px] border border-[#233352] no-underline transition-all duration-200 hover:text-[#edf4fb] hover:border-[#3d5a7a]">Admin Panel</RouterLink>

        <!-- Avatar + Dropdown -->
        <div class="relative flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-[10px] border border-[#1a2740] cursor-pointer select-none transition-all duration-200 hover:border-[#233352] hover:bg-[#0e1623]" @click="dropdownOpen = !dropdownOpen">
          <div class="w-8 h-8 rounded-[8px] bg-gradient-to-br from-[#1a3a5c] to-[#0e253b] flex items-center justify-center font-syne text-xs font-bold text-[#00d4ff]">{{ initials }}</div>
          <div class="flex flex-col leading-tight">
            <span class="text-[13px] font-semibold text-[#edf4fb]">{{ authStore.user?.full_name || 'User' }}</span>
            <span class="text-[10px] font-mono text-[#3d5a7a] uppercase tracking-wider">{{ authStore.role }}</span>
          </div>
          <span class="text-[10px] text-[#3d5a7a] transition-transform duration-200" :class="{ 'rotate-180': dropdownOpen }">▾</span>

          <Transition name="dropdown">
            <div v-if="dropdownOpen" @click.stop class="absolute top-[calc(100%+10px)] right-0 bg-[#090f1a] border border-[#233352] rounded-[14px] min-w-[220px] overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.6)] z-[200]">
              <div class="flex items-center gap-3 p-4">
                <div class="w-[38px] h-[38px] flex-shrink-0 rounded-[9px] bg-gradient-to-br from-[#1a3a5c] to-[#0e253b] flex items-center justify-center font-syne text-sm font-bold text-[#00d4ff]">{{ initials }}</div>
                <div>
                  <div class="text-[13px] font-semibold text-[#edf4fb]">{{ authStore.user?.full_name }}</div>
                  <div class="text-[11px] font-mono text-[#3d5a7a] my-0.5">{{ authStore.user?.email }}</div>
                  <span v-if="authStore.isStudent" class="font-mono text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider bg-[rgba(0,212,255,0.1)] text-[#00d4ff] border border-[rgba(0,212,255,0.2)]">student</span>
                  <span v-if="authStore.isEmployer" class="font-mono text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider bg-[rgba(255,209,102,0.1)] text-[#ffd166] border border-[rgba(255,209,102,0.2)]">employer</span>
                  <span v-if="authStore.isAdmin" class="font-mono text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider bg-[rgba(255,71,87,0.1)] text-[#ff4757] border border-[rgba(255,71,87,0.2)]">admin</span>
                </div>
              </div>
              <div class="h-px bg-[#1a2740] my-1"></div>

              <template v-if="authStore.isStudent">
                <RouterLink v-for="item in studentLinks" :key="item.to" :to="item.to" class="flex items-center gap-2.5 px-4 py-[11px] text-[13.5px] text-[#7a9bbf] font-dm no-underline transition-all duration-150 hover:bg-[#0e1623] hover:text-[#edf4fb]" @click="dropdownOpen=false">{{ item.label }}</RouterLink>
              </template>
              <template v-if="authStore.isEmployer">
                <RouterLink v-for="item in employerLinks" :key="item.to" :to="item.to" class="flex items-center gap-2.5 px-4 py-[11px] text-[13.5px] text-[#7a9bbf] font-dm no-underline transition-all duration-150 hover:bg-[#0e1623] hover:text-[#edf4fb]" @click="dropdownOpen=false">{{ item.label }}</RouterLink>
              </template>
              <template v-if="authStore.isAdmin">
                <RouterLink v-for="item in adminLinks" :key="item.to" :to="item.to" class="flex items-center gap-2.5 px-4 py-[11px] text-[13.5px] text-[#7a9bbf] font-dm no-underline transition-all duration-150 hover:bg-[#0e1623] hover:text-[#edf4fb]" @click="dropdownOpen=false">{{ item.label }}</RouterLink>
              </template>

              <div class="h-px bg-[#1a2740] my-1"></div>
              <button class="flex items-center gap-2.5 w-full px-4 py-[11px] text-[13.5px] text-[#7a9bbf] font-dm bg-transparent border-none cursor-pointer text-left transition-all duration-150 hover:bg-[#0e1623] hover:text-[#ff4757]" @click="handleLogout">Log Out</button>
            </div>
          </Transition>
        </div>
      </template>
    </div>

    <!-- Hamburger -->
    <button class="md:hidden flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1 ml-auto" @click="mobileOpen = !mobileOpen">
      <span class="block w-[22px] h-0.5 bg-[#7a9bbf] rounded-sm"></span>
      <span class="block w-[22px] h-0.5 bg-[#7a9bbf] rounded-sm"></span>
      <span class="block w-[22px] h-0.5 bg-[#7a9bbf] rounded-sm"></span>
    </button>

    <!-- Mobile Menu -->
    <Transition name="slide-down">
      <div v-if="mobileOpen" class="absolute top-[60px] left-0 right-0 bg-[#090f1a] border-b border-[#1a2740] px-4 py-3 flex flex-col gap-0.5 z-[99]">
        <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to" class="block font-dm font-medium text-sm text-[#7a9bbf] px-4 py-3 rounded-[9px] no-underline transition-all duration-200 hover:bg-[#0e1623] hover:text-[#edf4fb]" @click="mobileOpen=false">{{ link.label }}</RouterLink>
        <div class="h-px bg-[#1a2740] my-1.5"></div>
        <template v-if="!authStore.isLoggedIn">
          <RouterLink to="/login" class="block font-dm font-medium text-sm text-[#7a9bbf] px-4 py-3 rounded-[9px] no-underline transition-all duration-200 hover:bg-[#0e1623] hover:text-[#edf4fb]" @click="mobileOpen=false">Log In</RouterLink>
          <RouterLink to="/register" class="block font-dm font-medium text-sm text-[#00d4ff] px-4 py-3 rounded-[9px] no-underline hover:bg-[#0e1623]" @click="mobileOpen=false">Sign Up Free</RouterLink>
        </template>
        <template v-else>
          <template v-if="authStore.isStudent">
            <RouterLink v-for="item in studentLinks" :key="item.to" :to="item.to" class="block font-dm font-medium text-sm text-[#7a9bbf] px-4 py-3 rounded-[9px] no-underline transition-all duration-200 hover:bg-[#0e1623] hover:text-[#edf4fb]" @click="mobileOpen=false">{{ item.label }}</RouterLink>
          </template>
          <template v-if="authStore.isEmployer">
            <RouterLink v-for="item in employerLinks" :key="item.to" :to="item.to" class="block font-dm font-medium text-sm text-[#7a9bbf] px-4 py-3 rounded-[9px] no-underline transition-all duration-200 hover:bg-[#0e1623] hover:text-[#edf4fb]" @click="mobileOpen=false">{{ item.label }}</RouterLink>
          </template>
          <template v-if="authStore.isAdmin">
            <RouterLink v-for="item in adminLinks" :key="item.to" :to="item.to" class="block font-dm font-medium text-sm text-[#7a9bbf] px-4 py-3 rounded-[9px] no-underline transition-all duration-200 hover:bg-[#0e1623] hover:text-[#edf4fb]" @click="mobileOpen=false">{{ item.label }}</RouterLink>
          </template>
          <div class="h-px bg-[#1a2740] my-1.5"></div>
          <button class="block w-full font-dm font-medium text-sm text-[#7a9bbf] px-4 py-3 rounded-[9px] bg-transparent border-none cursor-pointer text-left transition-all duration-200 hover:bg-[#0e1623] hover:text-[#ff4757]" @click="handleLogout">Log Out</button>
        </template>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const dropdownOpen = ref(false)
const mobileOpen = ref(false)

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/browse', label: 'Browse' },
  { to: '/browse?type=job', label: 'Jobs' },
  { to: '/browse?type=intern', label: 'Internships' },
  { to: '/browse?type=scholar', label: 'Scholarships' },
]
const studentLinks = [
  { to: '/student/dashboard', label: 'Dashboard' },
  { to: '/student/applications', label: 'My Applications' },
  { to: '/student/bookmarks', label: 'Bookmarks' },
  { to: '/student/profile', label: 'My Profile' },
]
const employerLinks = [
  { to: '/employer/dashboard', label: 'Dashboard' },
  { to: '/employer/post-job', label: 'Post a Job' },
  { to: '/employer/applicants', label: 'View Applicants' },
]
const adminLinks = [
  { to: '/admin/dashboard', label: 'Admin Dashboard' },
  { to: '/admin/users', label: 'Manage Users' },
  { to: '/admin/listings', label: 'Manage Listings' },
]

const initials = computed(() => {
  const name = authStore.user?.full_name || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'
})

async function handleLogout() {
  dropdownOpen.value = false
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active { transition: all .2s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-8px); }
.slide-down-enter-active, .slide-down-leave-active { transition: all .2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
