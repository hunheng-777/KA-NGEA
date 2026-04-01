<template>
  <div class="min-h-[calc(100vh-60px)] bg-[#04080f]">
    <div class="max-w-[1100px] mx-auto px-8 py-9 pb-20 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

      <!-- Sidebar -->
      <aside class="flex flex-col gap-4">

        <!-- Profile Card -->
        <div class="bg-[#090f1a] border border-[#1a2740] rounded-[14px] overflow-hidden">
          <div class="h-[72px] bg-gradient-to-br from-[#061626] via-[#0c2240] to-[#061a30]"></div>
          <div class="px-5 -mt-7 relative z-10">
            <div class="relative w-fit">
              <div class="w-14 h-14 rounded-[14px] bg-gradient-to-br from-[#1a3a5c] to-[#0e253b] border-2 border-[#090f1a] flex items-center justify-center font-syne text-xl font-extrabold text-[#00d4ff]">{{ initials }}</div>
              <button class="absolute -bottom-1 -right-1 w-[22px] h-[22px] rounded-full bg-[#0e1623] border border-[#233352] text-[11px] flex items-center justify-center cursor-pointer"></button>
            </div>
          </div>
          <div class="px-5 pt-3 pb-4">
            <h2 class="font-syne text-[16px] font-bold text-[#edf4fb] mb-1.5">{{ form.fullname || 'Your Name' }}</h2>
            <span class="inline-block font-mono text-[10px] font-semibold px-2.5 py-0.5 rounded-[6px] uppercase tracking-wider bg-[rgba(0,212,255,0.1)] text-[#00d4ff] border border-[rgba(0,212,255,0.2)] mb-2.5">Student</span>
            <p class="font-dm text-[12.5px] text-[#7a9bbf] leading-[1.65] mb-2">{{ form.bio || 'Add a bio to tell employers about yourself...' }}</p>
            <div class="flex flex-col gap-1 font-mono text-[11px] text-[#3d5a7a]">
              <span v-if="form.institution">{{ form.institution }}</span>
              <span v-if="form.location">{{ form.location }}</span>
            </div>
          </div>

          <!-- Stats -->
          <div class="flex border-t border-[#1a2740]">
            <div v-for="(s, i) in [{ num: stats.applications, lbl: 'Applied' }, { num: stats.bookmarks, lbl: 'Saved' }, { num: completionPct + '%', lbl: 'Complete' }]" :key="s.lbl"
              class="flex-1 py-3 text-center" :class="i < 2 ? 'border-r border-[#1a2740]' : ''">
              <div class="font-syne text-[18px] font-bold text-[#edf4fb]">{{ s.num }}</div>
              <div class="font-mono text-[10px] text-[#3d5a7a] mt-0.5">{{ s.lbl }}</div>
            </div>
          </div>

          <!-- Completion -->
          <div class="px-5 py-3.5 border-t border-[#1a2740]">
            <div class="flex justify-between mb-2">
              <span class="font-dm text-[12px] text-[#7a9bbf]">Profile Completion</span>
              <span class="font-mono text-[12px] font-semibold text-[#00d4ff]">{{ completionPct }}%</span>
            </div>
            <div class="h-1 bg-[#1a2740] rounded-full overflow-hidden">
              <div class="h-full rounded-full bg-gradient-to-r from-[#00d4ff] to-[#00ff88] transition-all duration-500" :style="{ width: completionPct + '%' }"></div>
            </div>
            <div v-if="missingFields.length" class="flex flex-wrap gap-1.5 mt-2.5">
              <span v-for="tip in missingFields" :key="tip" class="font-mono text-[10px] bg-[rgba(255,209,102,0.08)] border border-[rgba(255,209,102,0.18)] text-[#ffd166] px-2 py-0.5 rounded">+ {{ tip }}</span>
            </div>
          </div>
        </div>

        <!-- Sidebar Nav -->
        <nav class="bg-[#090f1a] border border-[#1a2740] rounded-[14px] overflow-hidden">
          <button v-for="item in navItems" :key="item.key"
            class="flex items-center gap-3 w-full px-[18px] py-[13px] font-dm text-[13.5px] font-medium text-[#7a9bbf] border-none border-l-2 bg-transparent cursor-pointer transition-all duration-150 border-b border-b-[#1a2740] text-left last:border-b-0 hover:bg-[#0e1623] hover:text-[#edf4fb]"
            :class="activeTab === item.key ? 'border-l-[#00d4ff] text-[#00d4ff] bg-[rgba(0,212,255,0.05)]' : 'border-l-transparent'"
            @click="activeTab = item.key">
            <span class="text-base w-5 text-center">{{ item.icon }}</span> {{ item.label }}
          </button>
        </nav>
      </aside>

      <!-- Main -->
      <main class="flex flex-col gap-[18px]">

        <!-- Personal Info -->
        <template v-if="activeTab === 'info'">
          <div class="bg-[#090f1a] border border-[#1a2740] rounded-[14px] overflow-hidden">
            <div class="flex items-center justify-between px-6 py-[18px] border-b border-[#1a2740]">
              <div>
                <h3 class="font-syne text-[15px] font-bold text-[#edf4fb]">Personal Information</h3>
                <p class="font-dm text-[12px] text-[#3d5a7a] mt-0.5">Your basic profile details visible to employers</p>
              </div>
            </div>
            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="f in infoFields" :key="f.key" :class="f.full ? 'md:col-span-2' : ''">
                <label class="block font-mono text-[11px] font-semibold text-[#3d5a7a] uppercase tracking-[0.6px] mb-1.5">{{ f.label }}</label>
                <textarea v-if="f.type === 'textarea'" v-model="form[f.key]" :placeholder="f.placeholder" rows="4"
                  class="w-full px-3.5 py-3 bg-[#0e1623] border border-[#1a2740] rounded-[9px] text-[#edf4fb] text-[13.5px] font-dm outline-none transition-all duration-200 placeholder:text-[#3d5a7a] focus:border-[#00d4ff] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.05)] resize-y min-h-[90px]"></textarea>
                <select v-else-if="f.type === 'select'" v-model="form[f.key]"
                  class="w-full px-3.5 py-3 bg-[#0e1623] border border-[#1a2740] rounded-[9px] text-[#edf4fb] text-[13.5px] font-dm outline-none transition-all duration-200 focus:border-[#00d4ff] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.05)]">
                  <option v-for="y in gradYears" :key="y" :value="y">{{ y }}</option>
                </select>
                <input v-else v-model="form[f.key]" :type="f.type || 'text'" :placeholder="f.placeholder" :disabled="f.disabled"
                  class="w-full px-3.5 py-3 bg-[#0e1623] border border-[#1a2740] rounded-[9px] text-[#edf4fb] text-[13.5px] font-dm outline-none transition-all duration-200 placeholder:text-[#3d5a7a] focus:border-[#00d4ff] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.05)] disabled:opacity-50 disabled:cursor-not-allowed" />
              </div>
            </div>
          </div>
        </template>

        <!-- Skills -->
        <template v-else-if="activeTab === 'skills'">
          <div class="bg-[#090f1a] border border-[#1a2740] rounded-[14px] overflow-hidden">
            <div class="px-6 py-[18px] border-b border-[#1a2740]">
              <h3 class="font-syne text-[15px] font-bold text-[#edf4fb]">Skills & Expertise</h3>
              <p class="font-dm text-[12px] text-[#3d5a7a] mt-0.5">Add cybersecurity skills to get matched with relevant jobs</p>
            </div>
            <div class="p-6">
              <div class="flex gap-2.5 mb-4">
                <input v-model="newSkill" type="text" placeholder="Type a skill and press Enter..."
                  class="flex-1 px-3.5 py-3 bg-[#0e1623] border border-[#1a2740] rounded-[9px] text-[#edf4fb] text-[13.5px] font-dm outline-none transition-all duration-200 placeholder:text-[#3d5a7a] focus:border-[#00d4ff] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.05)]"
                  @keydown.enter.prevent="addSkill" />
                <button class="px-5 py-3 bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.2)] text-[#00d4ff] rounded-[9px] font-syne text-[13px] font-bold cursor-pointer transition-all duration-200 hover:bg-[rgba(0,212,255,0.18)] whitespace-nowrap" @click="addSkill">Add</button>
              </div>
              <div class="font-mono text-[10px] text-[#3d5a7a] uppercase tracking-[0.7px] mb-2">Suggested skills:</div>
              <div class="flex flex-wrap gap-1.5 mb-5">
                <button v-for="s in suggestedSkills.filter(s => !form.skills.includes(s))" :key="s"
                  class="font-mono text-[11px] bg-transparent border border-dashed border-[#233352] text-[#3d5a7a] px-3 py-1 rounded-[7px] cursor-pointer transition-all duration-200 hover:border-[#00d4ff] hover:text-[#00d4ff]"
                  @click="form.skills.push(s)">+ {{ s }}</button>
              </div>
              <div v-if="form.skills.length" class="flex flex-wrap gap-2">
                <div v-for="(skill, i) in form.skills" :key="skill" class="inline-flex items-center gap-1.5 bg-[#0e1623] border border-[#1a2740] text-[#7a9bbf] font-mono text-[12px] px-3 py-1.5 rounded-[8px]">
                  {{ skill }}
                  <button class="text-[#3d5a7a] bg-transparent border-none cursor-pointer text-base leading-none px-0.5 transition-colors duration-150 hover:text-[#ff4757]" @click="form.skills.splice(i,1)">×</button>
                </div>
              </div>
              <p v-else class="font-dm text-[13px] text-[#3d5a7a]">No skills added yet.</p>
            </div>
          </div>
        </template>

        <!-- Resume -->
        <template v-else-if="activeTab === 'resume'">
          <div class="bg-[#090f1a] border border-[#1a2740] rounded-[14px] overflow-hidden">
            <div class="px-6 py-[18px] border-b border-[#1a2740]">
              <h3 class="font-syne text-[15px] font-bold text-[#edf4fb]">Resume / CV</h3>
              <p class="font-dm text-[12px] text-[#3d5a7a] mt-0.5">Upload your resume — PDF or DOCX, max 5MB</p>
            </div>
            <div class="p-6">
              <div v-if="form.resumeUrl" class="flex items-center gap-3.5 bg-[#0e1623] border border-[#1a2740] rounded-[10px] p-4">
                <div class="text-[28px]"></div>
                <div class="flex-1">
                  <div class="font-dm text-sm font-semibold text-[#edf4fb]">{{ form.resumeName }}</div>
                  <div class="font-mono text-[11px] text-[#3d5a7a] mt-0.5">Uploaded · PDF</div>
                </div>
                <div class="flex gap-2">
                  <a :href="form.resumeUrl" target="_blank" class="font-dm text-[12px] text-[#00d4ff] border border-[rgba(0,212,255,0.2)] bg-[rgba(0,212,255,0.08)] px-3.5 py-1.5 rounded-[7px] no-underline">View</a>
                  <button class="font-dm text-[12px] text-[#ff4757] border border-[rgba(255,71,87,0.2)] bg-transparent px-3.5 py-1.5 rounded-[7px] cursor-pointer" @click="form.resumeUrl=''">Remove</button>
                </div>
              </div>
              <div v-else class="border-2 border-dashed border-[#233352] rounded-[12px] p-10 text-center cursor-pointer transition-all duration-200 hover:border-[#00d4ff] hover:bg-[rgba(0,212,255,0.04)]"
                :class="{ 'border-[#00d4ff] bg-[rgba(0,212,255,0.04)]': isDragging }"
                @dragover.prevent="isDragging=true" @dragleave="isDragging=false" @drop.prevent="handleDrop" @click="$refs.fileInput.click()">
                <input ref="fileInput" type="file" accept=".pdf,.docx" class="hidden" @change="handleFileSelect"/>
                <div class="text-[36px] mb-3"></div>
                <div class="font-dm text-sm text-[#7a9bbf] mb-1.5">Drag & drop your resume here, or <span class="text-[#00d4ff]">click to browse</span></div>
                <div class="font-mono text-[11px] text-[#3d5a7a]">PDF or DOCX · Max 5MB</div>
              </div>
            </div>
          </div>
        </template>

        <!-- Security -->
        <template v-else-if="activeTab === 'security'">
          <div class="bg-[#090f1a] border border-[#1a2740] rounded-[14px] overflow-hidden">
            <div class="px-6 py-[18px] border-b border-[#1a2740]">
              <h3 class="font-syne text-[15px] font-bold text-[#edf4fb]">Security Settings</h3>
              <p class="font-dm text-[12px] text-[#3d5a7a] mt-0.5">Manage your password and account security</p>
            </div>
            <div class="p-6 max-w-[480px] flex flex-col gap-4">
              <div v-for="f in securityFields" :key="f.key">
                <label class="block font-mono text-[11px] font-semibold text-[#3d5a7a] uppercase tracking-[0.6px] mb-1.5">{{ f.label }}</label>
                <input v-model="security[f.key]" type="password" :placeholder="f.placeholder"
                  class="w-full px-3.5 py-3 bg-[#0e1623] border border-[#1a2740] rounded-[9px] text-[#edf4fb] text-[13.5px] font-dm outline-none transition-all duration-200 placeholder:text-[#3d5a7a] focus:border-[#00d4ff] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.05)]" />
              </div>
              <button class="font-syne text-[13px] font-bold text-[#04080f] px-[22px] py-2.5 rounded-[9px] bg-gradient-to-br from-[#00d4ff] to-[#00a8cc] border-none cursor-pointer transition-all duration-200 flex items-center gap-2 self-start hover:opacity-90" @click="handlePasswordChange">Update Password</button>
            </div>
          </div>
        </template>

        <!-- Save Bar -->
        <div v-if="['info','skills','resume'].includes(activeTab)" class="bg-[#090f1a] border border-[#1a2740] rounded-[14px] px-6 py-4 flex items-center justify-between">
          <div class="font-dm text-[13px] text-[#7a9bbf]">Save changes to <strong class="text-[#edf4fb]">update your profile</strong></div>
          <div class="flex gap-2.5">
            <button class="font-dm text-[13px] font-medium text-[#7a9bbf] px-5 py-2.5 rounded-[9px] border border-[#1a2740] bg-transparent cursor-pointer transition-all duration-200 hover:text-[#edf4fb] hover:border-[#3d5a7a]" @click="resetForm">Cancel</button>
            <button class="font-syne text-[13px] font-bold text-[#04080f] px-[22px] py-2.5 rounded-[9px] bg-gradient-to-br from-[#00d4ff] to-[#00a8cc] border-none cursor-pointer transition-all duration-200 flex items-center gap-2 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed" @click="handleSave" :disabled="saving">
              <span v-if="saving" class="w-3.5 h-3.5 border-2 border-black/20 border-t-[#04080f] rounded-full animate-spin"></span>
              <span v-else>Save Changes</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const activeTab = ref('info')
const saving = ref(false)
const isDragging = ref(false)
const newSkill = ref('')

const navItems = [
  { key: 'info', icon: '👤', label: 'Personal Info' },
  { key: 'skills', icon: '⚡', label: 'Skills' },
  { key: 'resume', icon: '📄', label: 'Resume / CV' },
  { key: 'security', icon: '🔒', label: 'Security' },
]
const stats = reactive({ applications: 0, bookmarks: 0 })
const form = reactive({ fullname: '', phone: '', institution: '', gradYear: 2026, bio: '', location: '', linkedin: '', github: '', skills: [], resumeUrl: '', resumeName: '' })
const security = reactive({ current: '', newPw: '', confirm: '' })
const gradYears = Array.from({ length: 8 }, (_, i) => 2024 + i)
const suggestedSkills = ['Penetration Testing','SIEM','Malware Analysis','Cloud Security','Incident Response','CTF','Kali Linux','Nmap','Burp Suite','Digital Forensics','OSCP','Ethical Hacking','Cryptography']

const infoFields = [
  { key: 'fullname', label: 'Full Name', placeholder: 'Sophea Ros' },
  { key: 'email', label: 'Email', type: 'email', placeholder: '', disabled: true },
  { key: 'phone', label: 'Phone', placeholder: '+855 12 345 678' },
  { key: 'institution', label: 'University / Institution', placeholder: 'e.g. RUPP, AUPP, ITC...' },
  { key: 'gradYear', label: 'Graduation Year', type: 'select' },
  { key: 'bio', label: 'Bio / About Me', type: 'textarea', placeholder: 'Describe your interests, goals, and cybersecurity focus areas...', full: true },
  { key: 'location', label: 'Location', placeholder: 'Phnom Penh, Cambodia' },
  { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'linkedin.com/in/sophea-ros' },
  { key: 'github', label: 'GitHub URL', placeholder: 'github.com/sophea-ros' },
]
const securityFields = [
  { key: 'current', label: 'Current Password', placeholder: 'Enter current password' },
  { key: 'newPw', label: 'New Password', placeholder: 'Min. 8 characters' },
  { key: 'confirm', label: 'Confirm New Password', placeholder: 'Repeat new password' },
]

const initials = computed(() => {
  const name = form.fullname || authStore.user?.full_name || 'User'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})
const completionPct = computed(() => {
  const checks = [form.fullname, form.bio, form.institution, form.location, form.phone, form.linkedin, form.skills.length > 0, form.resumeUrl]
  return Math.round((checks.filter(v => v).length / checks.length) * 100)
})
const missingFields = computed(() => {
  const tips = []
  if (!form.bio) tips.push('Add bio')
  if (!form.resumeUrl) tips.push('Upload resume')
  if (!form.linkedin) tips.push('Add LinkedIn')
  if (!form.location) tips.push('Add location')
  return tips.slice(0, 3)
})

function addSkill() {
  const s = newSkill.value.trim()
  if (s && !form.skills.includes(s)) { form.skills.push(s); newSkill.value = '' }
}
function handleDrop(e) { isDragging.value = false; const file = e.dataTransfer.files[0]; if (file) processFile(file) }
function handleFileSelect(e) { const file = e.target.files[0]; if (file) processFile(file) }
function processFile(file) {
  if (file.size > 5*1024*1024) { alert('File too large. Max 5MB.'); return }
  form.resumeUrl = URL.createObjectURL(file); form.resumeName = file.name
}

async function handleSave() {
  saving.value = true
  try {
    await authStore.updateProfile({
      full_name: form.fullname,
      phone: form.phone,
      institution: form.institution,
      grad_year: form.gradYear,
      bio: form.bio,
      location: form.location,
      linkedin: form.linkedin,
      github: form.github,
      skills: form.skills
    })
    await authStore.fetchUser()
    alert('Profile saved!')
  } catch (err) { alert('Failed to save: ' + err.message) }
  finally { saving.value = false }
}

async function handlePasswordChange() {
  if (security.newPw !== security.confirm) { alert('Passwords do not match'); return }
  try {
    await authStore.updatePassword(security.current, security.newPw)
    alert('Password updated!')
    security.current = ''; security.newPw = ''; security.confirm = ''
  } catch (err) { alert(err.message) }
}

function resetForm() {
  const user = authStore.user
  if (user) {
    form.fullname = user.full_name || ''
    form.phone = user.phone || ''
    form.institution = user.institution || ''
    form.gradYear = user.grad_year || 2026
    form.bio = user.bio || ''
    form.location = user.location || ''
    form.linkedin = user.linkedin || ''
    form.github = user.github || ''
    form.skills = user.skills || []
    form.resumeUrl = user.resume_url || ''
    form.resumeName = user.resume_name || ''
  }
}

onMounted(async () => {
  await authStore.fetchUser()
  const user = authStore.user
  if (user) {
    form.fullname = user.full_name || ''
    form.phone = user.phone || ''
    form.institution = user.institution || ''
    form.gradYear = user.grad_year || 2026
    form.bio = user.bio || ''
    form.location = user.location || ''
    form.linkedin = user.linkedin || ''
    form.github = user.github || ''
    form.skills = user.skills || []
    form.resumeUrl = user.resume_url || ''
    form.resumeName = user.resume_name || ''
    stats.applications = user.application_count || 0
    stats.bookmarks = user.bookmark_count || 0
  }
})
</script>
