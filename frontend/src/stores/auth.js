import { defineStore } from 'pinia'
import { authService } from '@/services/auth.service'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: authService.getCurrentUser(),
    token: localStorage.getItem('token') || null,
    loading: false
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isStudent: (state) => state.user?.role === 'student',
    isEmployer: (state) => state.user?.role === 'employer',
    isAdmin: (state) => state.user?.role === 'admin',
    role: (state) => state.user?.role,
    userName: (state) => state.user?.full_name || state.user?.name || 'User'
  },

  actions: {
    async login(email, password, remember) {
      this.loading = true
      try {
        const data = await authService.login(email, password, remember)
        this.token = data.token
        this.user = data.user
        return data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      try {
        const data = await authService.register(userData)
        this.token = data.token
        this.user = data.user
        return data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async forgotPassword(email) {
      this.loading = true
      try {
        return await authService.forgotPassword(email)
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async verifyResetCode(email, code) {
      this.loading = true
      try {
        return await authService.verifyResetCode(email, code)
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async resetPassword(newPassword, code) {
      this.loading = true
      try {
        return await authService.resetPassword(newPassword, code)
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchUser() {
      try {
        const user = await authService.fetchUser()
        this.user = user
        return user
      } catch (error) {
        throw error
      }
    },

    async updateProfile(profileData) {
      try {
        const user = await authService.updateProfile(profileData)
        this.user = user
        return user
      } catch (error) {
        throw error
      }
    },

    async updatePassword(currentPassword, newPassword) {
      return await authService.updatePassword(currentPassword, newPassword)
    },

    logout() {
      authService.logout()
      this.token = null
      this.user = null
    }
  }
})
