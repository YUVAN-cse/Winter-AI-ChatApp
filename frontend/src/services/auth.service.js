import api from './api'

export const authService = {
  register: (data) => api.post('/auth/v1/register', data),
  login: (data) => api.post('/auth/v1/login', data),
  logout: () => api.post('/auth/v1/logout'),
  refresh: () => api.post('/auth/v1/refresh'),
  getProfile: () => api.get('/auth/v1/profile'),
  getAllUsers: () => api.get('/auth/v1/users'),
  deleteAccount: () => api.post('/auth/v1/delete'),
}
