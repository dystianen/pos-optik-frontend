import { API_ROUTES } from '@/constants/api-routes'
import apiClient from '@/lib/apiClient'
import type {
  TPayloadForgotPassword,
  TPayloadLogin,
  TPayloadRegister,
  TResForgotPassword,
  TResLogin,
  TResProfile,
  TResRegister
} from '../types'

export const login = async (payload: TPayloadLogin) => {
  const response = await apiClient.post<TResLogin>(API_ROUTES.AUTH.LOGIN, payload)
  return response.data.data
}

export const register = async (payload: TPayloadRegister) => {
  const response = await apiClient.post<TResRegister>(API_ROUTES.AUTH.REGISTER, payload)
  return response.data.data
}

export const forgotPassword = async (payload: TPayloadForgotPassword) => {
  const response = await apiClient.post<TResForgotPassword>(
    API_ROUTES.AUTH.FORGOT_PASSWORD,
    payload
  )
  return response.data
}

export const getProfile = async () => {
  const response = await apiClient.get<TResProfile>(API_ROUTES.AUTH.PROFILE)
  return response.data.data
}
