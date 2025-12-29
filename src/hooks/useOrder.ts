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
  orders() {
    return useQuery({
      queryKey: ['orders'],
      queryFn: orderService.orders
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
      queryKey: ['check_status'],
      queryFn: () => orderService.checkStatus(orderId),
      enabled: !!orderId
    })
  }
}
