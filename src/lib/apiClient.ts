import { getAccessToken, getRefreshToken, removeTokens, setAccessToken } from '@/utils/auth-server'
import axios, { AxiosInstance } from 'axios'

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  responseType: 'json',
  timeout: 30000
})

const addAuthInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    async (config) => {
      const accessToken = await getAccessToken()
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken.value}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response Interceptor - Auto refresh jika 401
  instance.interceptors.response.use(
    (response) => response, // Jika sukses, langsung return

    async (error) => {
      const originalRequest = error.config

      // Jika error 401 dan belum retry
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          // Ambil refresh token
          const refreshToken = await getRefreshToken()

          if (!refreshToken?.value) {
            // Tidak ada refresh token, logout
            handleLogout()
            return Promise.reject(error)
          }

          // Request token baru dengan refresh token
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/refresh`,
            {
              refresh_token: refreshToken.value
            }
          )

          const { access_token } = response.data.data

          // Simpan access token baru
          setAccessToken(access_token)

          // Update header dengan token baru
          originalRequest.headers.Authorization = `Bearer ${access_token}`

          // Retry request yang gagal tadi
          return instance(originalRequest)
        } catch (refreshError) {
          // Refresh token juga expired, logout paksa
          handleLogout()
          return Promise.reject(refreshError)
        }
      }

      function handleLogout() {
        removeTokens()
        window.location.href = '/signin'
      }

      return Promise.reject(error)
    }
  )
}

addAuthInterceptor(apiClient)
export default apiClient
