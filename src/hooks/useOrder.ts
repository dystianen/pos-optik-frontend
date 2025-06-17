import orderService from '@/services/orderService'
import { useMutation } from '@tanstack/react-query'

export const useOrder = {
  checkout() {
    return useMutation({
      mutationFn: orderService.checkout
    })
  },
  payment() {
    return useMutation({
      mutationFn: orderService.payment
    })
  }
}
