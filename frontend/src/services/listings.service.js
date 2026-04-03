import api from './api'

export const listingsService = {
  async getFeaturedListings(limit = 6) {
    const response = await api.get('/listings/featured', { params: { limit } })
    return response.data
  },

  async getListings(params = {}) {
    const response = await api.get('/listings', { params })
    return response.data
  },

  async getListingById(id) {
    const response = await api.get(`/listings/${id}`)
    return response.data
  },

  async searchListings(query) {
    const response = await api.get('/listings/search', { params: { q: query } })
    return response.data
  },

  async getCategoryCounts() {
    const response = await api.get('/listings/counts')
    return response.data
  },

  // Add this function for stats
  async getStats() {
    const response = await api.get('/stats')
    return response.data
  }
}
