<template>
  <div class="p-6 max-w-6xl mx-auto">

    <!-- TOP BAR -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-white">Manage Users</h1>
      <router-link to="/admin" class="text-sm text-gray-400 hover:text-white">
        ← Back to Dashboard
      </router-link>
    </div>

    <!-- SEARCH + FILTER -->
    <div class="flex gap-3 mb-5">
      <input
        v-model="search"
        type="text"
        placeholder="Search by name or email..."
        class="border border-gray-600 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm w-full max-w-sm placeholder-gray-400"
      />
      <select v-model="roleFilter" class="border border-gray-600 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm">
        <option value="">All Roles</option>
        <option value="student">Student</option>
        <option value="employer">Employer</option>
        <option value="admin">Admin</option>
      </select>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="text-center py-10 text-gray-400">Loading users...</div>

    <!-- ERROR -->
    <div v-else-if="error" class="text-red-400 text-center py-10">
      Failed to load users. Please refresh.
    </div>

    <!-- TABLE -->
    <div v-else>
      <table class="w-full text-sm border border-gray-700 rounded-lg overflow-hidden">
        <thead class="bg-gray-800 text-left text-xs text-gray-400">
          <tr>
            <th class="px-4 py-3">Name</th>
            <th class="px-4 py-3">Email</th>
            <th class="px-4 py-3">Role</th>
            <th class="px-4 py-3">Registered</th>
            <th class="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="5" class="text-center py-6 text-gray-400">No users found.</td>
          </tr>
          <tr
            v-for="user in filteredUsers"
            :key="user.id"
            class="border-t border-gray-700 hover:bg-gray-800"
          >
            <td class="px-4 py-3 text-white">{{ user.full_name }}</td>
            <td class="px-4 py-3 text-gray-400">{{ user.email }}</td>
            <td class="px-4 py-3">
              <span
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="{
                  'bg-blue-900 text-blue-300':   user.role === 'student',
                  'bg-yellow-900 text-yellow-300': user.role === 'employer',
                  'bg-purple-900 text-purple-300': user.role === 'admin'
                }"
              >{{ user.role }}</span>
            </td>
            <td class="px-4 py-3 text-gray-400">{{ formatDate(user.created_at) }}</td>
            <td class="px-4 py-3">
              <button
                @click="confirmDelete(user)"
                class="text-red-400 hover:text-red-300 text-xs"
              >Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- CONFIRM DELETE MODAL -->
    <div
      v-if="userToDelete"
      class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
    >
      <div class="bg-gray-800 border border-gray-700 rounded-xl p-6 w-80">
        <h3 class="font-semibold text-base mb-2 text-white">Delete User?</h3>
        <p class="text-sm text-gray-400 mb-4">
          Are you sure you want to delete <strong class="text-white">{{ userToDelete.full_name }}</strong>? This cannot be undone.
        </p>
        <div class="flex gap-3">
          <button
            @click="userToDelete = null"
            class="flex-1 border border-gray-600 rounded-lg py-2 text-sm text-gray-300 hover:bg-gray-700"
          >Cancel</button>
          <button
            @click="deleteUser"
            class="flex-1 bg-red-600 text-white rounded-lg py-2 text-sm hover:bg-red-700"
          >Delete</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api.js'

const users = ref([])
const loading = ref(true)
const error = ref(false)
const search = ref('')
const roleFilter = ref('')
const userToDelete = ref(null)

onMounted(async () => {
  try {
    const res = await api.get('/admin/users')
    users.value = res.data
  } catch (err) {
    console.error(err)
    error.value = true
  } finally {
    loading.value = false
  }
})

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchSearch =
      (user.full_name || '').toLowerCase().includes(search.value.toLowerCase()) ||
      user.email.toLowerCase().includes(search.value.toLowerCase())
    const matchRole = roleFilter.value === '' || user.role === roleFilter.value
    return matchSearch && matchRole
  })
})

function confirmDelete(user) {
  userToDelete.value = user
}

async function deleteUser() {
  try {
    await api.delete(`/admin/users/${userToDelete.value.id}`)
    users.value = users.value.filter(u => u.id !== userToDelete.value.id)
    userToDelete.value = null
  } catch (err) {
    console.error(err)
    alert('Failed to delete user.')
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}
</script>