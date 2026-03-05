import apiClient from '@/lib/apiClient'
import { API_ROUTES } from '@/constants/api-routes'
import type { TPayloadLogin, TPayloadRegister, TResLogin, TResRegister } from '../types'

export const login = async (payload: TPayloadLogin) => {
  const response = await apiClient.post<TResLogin>(API_ROUTES.AUTH.LOGIN, payload)
  return response.data.data
}

export const register = async (payload: TPayloadRegister) => {
  const response = await apiClient.post<TResRegister>(API_ROUTES.AUTH.REGISTER, payload)
  return response.data.data
}
