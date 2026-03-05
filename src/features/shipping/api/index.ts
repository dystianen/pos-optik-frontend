import apiClient from '@/lib/apiClient'
import { API_ROUTES } from '@/constants/api-routes'
import type { TResCustomerShipping, TResCustomerShippingAddresses, TResShipping, TReqCustomerShipping } from '../types'

export const getShipping = async () => {
  const response = await apiClient.get<TResShipping>(API_ROUTES.SHIPPING.BASE)
  return response.data.data
}

export const getAllShippingAddress = async () => {
  const response = await apiClient.get<TResCustomerShippingAddresses>(API_ROUTES.SHIPPING.ADDRESS)
  return response.data.data
}

export const getShippingAddress = async (id: string) => {
  const response = await apiClient.get<TResCustomerShipping>(`${API_ROUTES.SHIPPING.ADDRESS}/${id}`)
  return response.data.data
}

export const saveCustomerShipping = async (payload: TReqCustomerShipping) => {
  const response = await apiClient.post<TResCustomerShipping>(API_ROUTES.SHIPPING.SAVE, payload)
  return response.data.data
}
