import { FormValuesUpdate } from '@/components/Checkout/StepPayment'
import apiClient from '@/lib/apiClient'
import type {
  CancelOrder,
  TResCancelOrder,
  TResOrder,
  TResOrderDetail,
  TResRefund,
  TResRefundAccount,
  TResRefundStatus,
  TResSummaryOrders
} from '@/types/order'

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
  },

  // CANCEL
  async cancelOrder(payload: CancelOrder) {
    const response = await apiClient.post<TResCancelOrder>(`/cancel`, payload)
    return response.data.data
  },
  async cancelStatus(id: string) {
    const response = await apiClient.get<TResRefundStatus>(`/cancel/status/${id}`)
    return response.data.data
  },

  // REFUND
  async refundStatus(id: string) {
    const response = await apiClient.get<TResRefundStatus>(`/refund/status/${id}`)
    return response.data.data
  },
  async submitRefund(payload: FormData) {
    const response = await apiClient.post<TResRefund>(`/refund/submit`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data.data
  },
  async shipItem(payload: { refund_id: string; courier: string; tracking_number: string }) {
    const response = await apiClient.post(`/refund/ship`, payload)
    return response.data.data
  },
  async refundAccount() {
    const response = await apiClient.get<TResRefundAccount>(`/refund/accounts`)
    return response.data.data
  },
  async updateRefundAccount(payload: FormValuesUpdate) {
    const response = await apiClient.post<TResRefundAccount>(`/refund/accounts/save`, payload)
    return response.data.data
  }
}

export default orderService
