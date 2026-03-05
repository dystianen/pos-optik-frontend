import apiClient from '@/lib/apiClient'
import { API_ROUTES } from '@/constants/api-routes'
import type { FormValuesUpdate } from '@/features/checkout/types'
import type {
  CancelOrder,
  TResCancelOrder,
  TResOrder,
  TResOrderDetail,
  TResRefund,
  TResRefundAccount,
  TResRefundStatus,
  TResSummaryOrders
} from '../types'

export const summaryOrders = async (id: string) => {
  const response = await apiClient.get<TResSummaryOrders>(API_ROUTES.ORDERS.SUMMARY(id))
  return response.data.data
}

export const getOrders = async (payload: { statusId: string | null }) => {
  const response = await apiClient.get<TResOrder>(API_ROUTES.ORDERS.BASE, {
    params: payload
  })
  return response.data.data
}

export const getDetailOrder = async (id: string) => {
  const response = await apiClient.get<TResOrderDetail>(`${API_ROUTES.ORDERS.BASE}/${id}`)
  return response.data.data
}

export const submitOrder = async (id: string) => {
  const response = await apiClient.post(API_ROUTES.ORDERS.SUBMIT(id))
  return response.data.data
}

export const payment = async (payload: FormData) => {
  const response = await apiClient.post(API_ROUTES.ORDERS.PAYMENT, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data.data
}

export const checkStatus = async (orderId: string) => {
  const response = await apiClient.get(API_ROUTES.ORDERS.CHECK_PAYMENT(orderId))
  return response.data.data
}

export const updateStatus = async (orderId: string, payload: { status_id: string }) => {
  const response = await apiClient.post(API_ROUTES.ORDERS.STATUS(orderId), payload)
  return response.data.data
}

export const cancelOrder = async (payload: CancelOrder) => {
  const response = await apiClient.post<TResCancelOrder>(API_ROUTES.CANCEL.SUBMIT, payload)
  return response.data.data
}

export const cancelStatus = async (id: string) => {
  const response = await apiClient.get<TResRefundStatus>(API_ROUTES.CANCEL.STATUS(id))
  return response.data.data
}

export const refundStatus = async (id: string) => {
  const response = await apiClient.get<TResRefundStatus>(API_ROUTES.REFUND.STATUS(id))
  return response.data.data
}

export const submitRefund = async (payload: FormData) => {
  const response = await apiClient.post<TResRefund>(API_ROUTES.REFUND.SUBMIT, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data.data
}

export const shipItem = async (payload: { refund_id: string; courier: string; tracking_number: string }) => {
  const response = await apiClient.post(API_ROUTES.REFUND.SHIP, payload)
  return response.data.data
}

export const refundAccount = async () => {
  const response = await apiClient.get<TResRefundAccount>(API_ROUTES.REFUND.ACCOUNTS)
  return response.data.data
}

export const updateRefundAccount = async (payload: FormValuesUpdate) => {
  const response = await apiClient.post<TResRefundAccount>(API_ROUTES.REFUND.SAVE_ACCOUNT, payload)
  return response.data.data
}
