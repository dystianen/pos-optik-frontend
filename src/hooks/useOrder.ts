import orderService from '@/services/orderService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useSummaryOrders() {
  return useMutation({
    mutationKey: ['SUMMARY_ORDERS'],
    mutationFn: (id: string) => orderService.summaryOrders(id)
  })
}

export function useOrders(payload: { statusId: string | null }) {
  return useQuery({
    queryKey: ['orders', payload],
    queryFn: () => orderService.getOrders(payload)
  })
}

export function useDetailOrder(id: string) {
  return useQuery({
    queryKey: ['DETAIL_ORDER', id],
    queryFn: () => orderService.getDetailOrder(id),
    enabled: !!id
  })
}

export function useSubmitOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: orderService.submit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['total_cart'] })
    }
  })
}

export function usePayment() {
  return useMutation({
    mutationFn: orderService.payment
  })
}

export function useCheckStatus(orderId: string) {
  return useQuery({
    queryKey: ['CHECK_STATUS', orderId],
    queryFn: () => orderService.checkStatus(orderId),
    enabled: !!orderId
  })
}

export function useUpdateStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, payload }: { orderId: string; payload: { status_id: string } }) =>
      orderService.updateStatus(orderId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['CHECK_STATUS', variables.orderId] })
    }
  })
}

export function useRefundAccount() {
  return useQuery({
    queryKey: ['REFUND_ACCOUNT'],
    queryFn: orderService.refundAccount
  })
}

export function useUpdateRefundAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: orderService.updateRefundAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['REFUND_ACCOUNT'] })
    }
  })
}

export function useCancelOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: orderService.cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['DETAIL_ORDER'] })
      queryClient.invalidateQueries({ queryKey: ['CHECK_STATUS'] })
    }
  })
}

export function useCancelStatus(id: string) {
  return useQuery({
    queryKey: ['CANCEL_STATUS', id],
    queryFn: () => orderService.cancelStatus(id),
    enabled: !!id
  })
}

export function useRefundStatus(id: string) {
  return useQuery({
    queryKey: ['REFUND_STATUS', id],
    queryFn: () => orderService.refundStatus(id),
    enabled: !!id
  })
}

export function useSubmitRefund() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: orderService.submitRefund,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['DETAIL_ORDER'] })
      queryClient.invalidateQueries({ queryKey: ['REFUND_STATUS'] })
    }
  })
}

export function useShipItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: orderService.shipItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['REFUND_STATUS'] })
      queryClient.invalidateQueries({ queryKey: ['DETAIL_ORDER'] })
    }
  })
}
