import apiClient from '@/lib/apiClient'
import { API_ROUTES } from '@/constants/api-routes'
import type { TResCustomerShipping, TResCustomerShippingAddresses, TResShipping, TReqCustomerShipping, GeneralResponse } from '../types'

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

export const getProvinces = async () => {
  const response = await apiClient.get<GeneralResponse<any[]>>('/shipping/provinces')
  return response.data.data
}

export const getCities = async (provinceId?: string) => {
  const response = await apiClient.get<GeneralResponse<any[]>>('/shipping/cities', {
    params: provinceId ? { province_id: provinceId } : {}
  })
  return response.data.data
}

export const calculateShippingCost = async (addressId: string) => {
  const response = await apiClient.post<GeneralResponse<any[]>>('/shipping/calculate-cost', {
    address_id: addressId
  })
  return response.data.data
}

export const getDistricts = async (cityId?: string) => {
  const response = await apiClient.get<GeneralResponse<any[]>>('/shipping/districts', {
    params: cityId ? { city_id: cityId } : {}
  })
  return response.data.data
}
