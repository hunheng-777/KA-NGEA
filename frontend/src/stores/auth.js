import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    role: null,
  }),
  getters: {
    isLoggedIn: () => false,
    isStudent: () => false,
    isEmployer: () => false,
    isAdmin: () => false,
  },
  actions: {
    async logout() {}
  }
})