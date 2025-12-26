import apiClient from '@/lib/apiClient'
import type {
  TReqCustomerShipping,
  TResCustomerShipping,
  TResCustomerShippingAddresses
} from '@/types/shipping'

const shippingService = {
  async getAllShippingAddress() {
    const response = await apiClient.get<TResCustomerShippingAddresses>(`/shipping`)
    return response.data.data
  },
  async getShippingAddress(id: string) {
    const response = await apiClient.get<TResCustomerShipping>(`/shipping/${id}`)
    return response.data.data
  },
  async saveCustomerShipping(payload: TReqCustomerShipping) {
    const response = await apiClient.post('/shipping/save', payload)
    return response.data
  }
}

export default shippingService
