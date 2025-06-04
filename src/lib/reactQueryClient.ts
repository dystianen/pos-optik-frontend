'use client'
import { QueryClient } from '@tanstack/react-query'
import apiClient from './apiClient'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const [url, params] = queryKey
        const response = await apiClient.get(url as string, { params })
        return response.data
      }
      // Kamu juga bisa tambahkan retry, staleTime, dll di sini
    },
    mutations: {
      mutationFn: async (data) => {
        const { url, payload } = data as { url: string; payload: any }
        const response = await apiClient.post(url, payload)
        return response.data
      }
    }
  }
})

export default queryClient
