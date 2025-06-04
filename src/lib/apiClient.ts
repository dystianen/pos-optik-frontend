import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  responseType: 'json',
  timeout: 3000000,
  withCredentials: true
})

// Tambahkan interceptor untuk Authorization
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') // atau gunakan context, cookie, dll
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default apiClient
