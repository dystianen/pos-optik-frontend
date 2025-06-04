import apiClient from '@/lib/apiClient'
import type { TReqLogin, TReqRegister } from '@/types/auth'

export const login = async (payload: TReqLogin) => {
  const response = await apiClient.post('/auth/login', payload)
  return response.data
}

export const register = async (payload: TReqRegister) => {
  const response = await apiClient.post('/auth/register', payload)
  return response.data
}
