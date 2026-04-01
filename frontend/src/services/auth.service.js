import api from './api'

export const authService = {
  async login(email, password, remember = false) {
    const response = await api.post('/auth/login', { email, password, remember })
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  async verifyResetCode(email, code) {
    const response = await api.post('/auth/verify-reset-code', { email, code })
    return response.data
  },

  async resetPassword(newPassword, code) {
    const response = await api.post('/auth/reset-password', { newPassword, code })
    return response.data
  },

  async fetchUser() {
    const response = await api.get('/users/profile')
    localStorage.setItem('user', JSON.stringify(response.data))
    return response.data
  },

  async updateProfile(profileData) {
    const response = await api.put('/users/profile', profileData)
    localStorage.setItem('user', JSON.stringify(response.data))
    return response.data
  },

  async updatePassword(currentPassword, newPassword) {
    const response = await api.put('/users/password', { currentPassword, newPassword })
    return response.data
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }
}
