import queryClient from '@/lib/reactQueryClient'
import orderService from '@/services/orderService'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useOrder = {
  summaryOrders() {
    return useMutation({
      mutationKey: ['SUMMARY_ORDERS'],
      mutationFn: (id: string) => orderService.summaryOrders(id)
    })
  },
  orders(payload: { statusId: string | null }) {
    return useQuery({
      queryKey: ['orders', payload],
      queryFn: () => orderService.getOrders(payload)
    })
  },
  detailOrder(id: string) {
    return useQuery({
      queryKey: ['DETAIL_ORDER'],
      queryFn: () => orderService.getDetailOrder(id)
    })
  },
  submit() {
    return useMutation({
      mutationFn: orderService.submit,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['total_cart'] })
      }
    })
  },
  payment() {
    return useMutation({
      mutationFn: orderService.payment
    })
  },
  checkStatus(orderId: string) {
    return useQuery({
      queryKey: ['CHECK_STATUS'],
      queryFn: () => orderService.checkStatus(orderId),
      enabled: !!orderId
    })
  },
  updateStatus() {
    return useMutation({
      mutationFn: ({ orderId, payload }: { orderId: string; payload: { status_id: string } }) =>
        orderService.updateStatus(orderId, payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['CHECK_STATUS'] })
      }
    })
  }
}
