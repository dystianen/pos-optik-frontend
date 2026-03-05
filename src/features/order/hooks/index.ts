import * as orderApi from '../api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useSummaryOrders() {
  return useMutation({
    mutationKey: ['SUMMARY_ORDERS'],
    mutationFn: orderApi.summaryOrders
  })
}

export function useOrders(payload: { statusId: string | null }) {
  return useQuery({
    queryKey: ['orders', payload],
    queryFn: () => orderApi.getOrders(payload)
  })
}

export function useDetailOrder(id: string) {
  return useQuery({
    queryKey: ['DETAIL_ORDER', id],
    queryFn: () => orderApi.getDetailOrder(id),
    enabled: !!id
  })
}

export function useSubmitOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: orderApi.submitOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['total_cart'] })
    }
  })
}

export function usePayment() {
  return useMutation({
    mutationFn: orderApi.payment
  })
}

export function useCheckStatus(orderId: string) {
  return useQuery({
    queryKey: ['CHECK_STATUS', orderId],
    queryFn: () => orderApi.checkStatus(orderId),
    enabled: !!orderId
  })
}

export function useUpdateStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, payload }: { orderId: string; payload: { status_id: string } }) =>
      orderApi.updateStatus(orderId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['CHECK_STATUS', variables.orderId] })
    }
  })
}

export function useRefundAccount() {
  return useQuery({
    queryKey: ['REFUND_ACCOUNT'],
    queryFn: orderApi.refundAccount
  })
}

export function useUpdateRefundAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: orderApi.updateRefundAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['REFUND_ACCOUNT'] })
    }
  })
}

export function useCancelOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: orderApi.cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['DETAIL_ORDER'] })
      queryClient.invalidateQueries({ queryKey: ['CHECK_STATUS'] })
    }
  })
}

export function useCancelStatus(id: string) {
  return useQuery({
    queryKey: ['CANCEL_STATUS', id],
    queryFn: () => orderApi.cancelStatus(id),
    enabled: !!id
  })
}

export function useRefundStatus(id: string) {
  return useQuery({
    queryKey: ['REFUND_STATUS', id],
    queryFn: () => orderApi.refundStatus(id),
    enabled: !!id
  })
}

export function useSubmitRefund() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: orderApi.submitRefund,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['DETAIL_ORDER'] })
      queryClient.invalidateQueries({ queryKey: ['REFUND_STATUS'] })
    }
  })
}

export function useShipItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: orderApi.shipItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['REFUND_STATUS'] })
      queryClient.invalidateQueries({ queryKey: ['DETAIL_ORDER'] })
    }
  })
}
