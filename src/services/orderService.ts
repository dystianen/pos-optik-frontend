import apiClient from '@/lib/apiClient'
import type { TReqCheckout } from '@/types/order'

const orderService = {
  async checkout(payload: TReqCheckout) {
    const response = await apiClient.post('/order/checkout', payload)
    return response.data
  },
  async payment(payload: FormData) {
    const response = await apiClient.post('/order/payment', payload, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}

export default orderService
