import apiClient from '@/lib/apiClient'
import type { TResOrder, TResOrderDetail, TResSummaryOrders } from '@/types/order'

const orderService = {
  async summaryOrders(id: string) {
    const response = await apiClient.get<TResSummaryOrders>(`/orders/summary/${id}`)
    return response.data.data
  },
  async getOrders(paylod: { statusId: string | null }) {
    const response = await apiClient.get<TResOrder>('/orders', {
      params: paylod
    })
    return response.data.data
  },
  async getDetailOrder(id: string) {
    const response = await apiClient.get<TResOrderDetail>(`/orders/${id}`)
    return response.data.data
  },
  async submit(id: string) {
    const response = await apiClient.post(`/orders/submit/${id}`)
    return response.data.data
  },
  async payment(payload: FormData) {
    const response = await apiClient.post('/orders/payment', payload, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data.data
  },
  async checkStatus(orderId: string) {
    const response = await apiClient.get(`/orders/check-payment-status/${orderId}`)
    return response.data.data
  },
  async updateStatus(orderId: string, payload: { status_id: string }) {
    const response = await apiClient.post(`/orders/${orderId}/status`, payload)
    return response.data.data
  }
}

export default orderService
