import apiClient from '@/lib/apiClient'
import type { TReqCheckout } from '@/types/order'

const orderService = {
  async orders() {
    const response = await apiClient.get('/orders')
    return response.data.data
  },
  async checkout(payload: TReqCheckout) {
    const response = await apiClient.post('/orders/checkout', payload)
    return response.data
  },
  async payment(payload: FormData) {
    const response = await apiClient.post('/orders/payment', payload, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },
  async checkStatus() {
    const response = await apiClient.get('/orders/check-status')
    return response.data
  }
}

export default orderService
