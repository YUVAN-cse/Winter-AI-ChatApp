import api from './api'

export const aiService = {
  getAllThreads: () => api.get('/ai/v1/threads'),
  getThread: (threadId) => api.get(`/ai/v1/thread/${threadId}`),
  deleteThread: (threadId) => api.delete(`/ai/v1/thread/${threadId}`),
  chat: (threadId, message) => api.post(`/ai/v1/chat/${threadId}`, { message }),
}
