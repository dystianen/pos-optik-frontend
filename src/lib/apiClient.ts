import { getCookieToken, removeCookieToken } from '@/utils/auth'
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  responseType: 'json',
  timeout: 3000000
})

const addAuthInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    async (config) => {
      const accessToken = await getCookieToken()
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken.value}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response
    },
    (error) => {
      if ((error.response && error.response.status === 401) || error.response.status === 403) {
        const pathname = window.location.pathname
        if (pathname !== '/signin') {
          removeCookieToken()
          window.location.href = '/signin'
        }
      }

      const err = error.response?.data
      return Promise.reject<AxiosError>(err)
    }
  )
}

addAuthInterceptor(apiClient)
export default apiClient
