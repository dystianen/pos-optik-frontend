import apiClient from '@/lib/apiClient'
import { API_ROUTES } from '@/constants/api-routes'
import type { TResCart, TResTotalCart } from '../types'

export const getCart = async () => {
  const response = await apiClient.get<TResCart>(API_ROUTES.CART.BASE)
  return response.data.data
}

export const updateCart = async (payload: { cart_item_id: string; quantity: number }) => {
  const response = await apiClient.put(`${API_ROUTES.CART.BASE}/update/${payload.cart_item_id}`, {
    quantity: payload.quantity
  })
  return response.data.data
}

export const deleteCart = async (id: string) => {
  const response = await apiClient.delete(`${API_ROUTES.CART.BASE}/delete/${id}`)
  return response.data.data
}

export const addCart = async (payload: { product_id: string; quantity: number; lens_id?: string; attributes?: any[] }) => {
  const response = await apiClient.post(`${API_ROUTES.CART.BASE}/add`, payload)
  return response.data
}

export const getTotalCart = async () => {
  const response = await apiClient.get<TResTotalCart>(API_ROUTES.CART.COUNT)
  return response.data.data
}
