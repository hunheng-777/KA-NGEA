<template>
  <footer class="bg-[#090f1a] border-t border-[#1a2740] font-dm">
    <div class="max-w-[1200px] mx-auto px-8">

      <!-- Grid -->
      <div class="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 py-12">

        <!-- Brand -->
        <div>
          <RouterLink to="/" class="flex items-center gap-2.5 no-underline mb-3.5">
            <div class="w-[30px] h-[30px] rounded-[8px] bg-gradient-to-br from-[#00d4ff] to-[#006e8a] flex items-center justify-center text-sm"></div>
            <span class="font-syne font-extrabold text-[17px] text-[#edf4fb]">KA-<span class="text-[#00d4ff]">NGEA</span></span>
          </RouterLink>
          <p class="text-[13px] text-[#3d5a7a] leading-[1.8] max-w-[280px] mb-5">Cambodia's dedicated cybersecurity career platform — connecting students with jobs, internships, and scholarships across government, finance, and tech.</p>
          <div class="flex gap-2">
            <a v-for="s in socials" :key="s" href="#" class="w-[34px] h-[34px] rounded-[9px] border border-[#1a2740] flex items-center justify-center text-base text-[#3d5a7a] no-underline transition-all duration-200 hover:border-[#00d4ff] hover:bg-[rgba(0,212,255,0.08)]">{{ s }}</a>
          </div>
        </div>

        <!-- Link Columns -->
        <div v-for="col in columns" :key="col.title">
          <h4 class="font-syne text-[11px] font-bold text-[#7a9bbf] uppercase tracking-widest mb-4">{{ col.title }}</h4>
          <component :is="link.to ? 'RouterLink' : 'a'" v-for="link in col.links" :key="link.label"
            :to="link.to" :href="link.href || '#'"
            class="block text-[13px] text-[#3d5a7a] no-underline mb-2.5 transition-all duration-200 hover:text-[#00d4ff] hover:pl-1">
            {{ link.label }}
          </component>
        </div>
      </div>

      <!-- Bottom -->
      <div class="h-px bg-[#1a2740]"></div>
      <div class="flex flex-wrap items-center justify-between gap-3 py-5">
        <p class="text-[12px] text-[#3d5a7a]">© 2025 KA-NGEA · Made in Cambodia · All rights reserved</p>
        <div class="flex gap-1.5">
          <span v-for="t in ['Vue.js','MySQL','Tailwind CSS']" :key="t" class="font-mono text-[10px] text-[#3d5a7a] border border-[#1a2740] px-2.5 py-0.5 rounded">{{ t }}</span>
        </div>
        <div class="flex gap-1">
          <button v-for="lang in langs" :key="lang.code"
            class="font-mono text-[11px] font-medium px-3 py-1 rounded-[7px] border border-[#1a2740] bg-transparent text-[#3d5a7a] cursor-pointer transition-all duration-200 hover:border-[#00d4ff] hover:text-[#00d4ff]"
            :class="{ 'border-[#00d4ff] text-[#00d4ff]': currentLang === lang.code }"
            @click="currentLang = lang.code">{{ lang.label }}</button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
const currentLang = ref('en')
const langs = [{ code: 'en', label: 'EN' }, { code: 'km', label: 'ខ្មែរ' }]
const socials = ['FB', 'TW', 'LI', 'IG']
const columns = [
  { title: 'Opportunities', links: [{ label: 'Browse All', to: '/browse' }, { label: 'Jobs', to: '/browse?type=job' }, { label: 'Internships', to: '/browse?type=intern' }, { label: 'Scholarships', to: '/browse?type=scholar' }, { label: 'Remote Work', to: '/browse?location=remote' }] },
  { title: 'For Employers', links: [{ label: 'Post a Job', to: '/employer/post-job' }, { label: 'Dashboard', to: '/employer/dashboard' }, { label: 'Create Account', to: '/register?role=employer' }, { label: 'Pricing', href: '#' }] },
  { title: 'Support', links: [{ label: 'About Us', href: '#' }, { label: 'Contact', href: '#' }, { label: 'FAQ', href: '#' }, { label: 'Privacy Policy', href: '#' }, { label: 'Terms of Use', href: '#' }] },
]
</script>
