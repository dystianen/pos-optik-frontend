import apiClient from '@/lib/apiClient'
import type { TReqAddToCart, TResCart, TResTotalCart } from '@/types/cart'

const cartService = {
  async addToCart(payload: TReqAddToCart) {
    const response = await apiClient.post('/cart/add-to-cart', payload)
    return response.data
  },
  async totalCart() {
    const response = await apiClient.get<TResTotalCart>('/cart/total-cart')
    return response.data.data
  },
  async cart() {
    const response = await apiClient.get<TResCart>('/cart')
    return response.data.data
  }
}

export default cartService
