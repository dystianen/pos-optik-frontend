import apiClient from '@/lib/apiClient'
import { API_ROUTES } from '@/constants/api-routes'
import type { TResMenu } from '../types'

export const getMenu = async () => {
  const response = await apiClient.get<TResMenu>(API_ROUTES.MENU)
  return response.data.data
}
