import queryClient from '@/lib/reactQueryClient'
import shippingService from '@/services/shippingService'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useShipping = {
  getAllShippingAddress() {
    return useQuery({
      queryKey: ['SHIPPING_ADDRESSES'],
      queryFn: shippingService.getAllShippingAddress
    })
  },
  getShippingAddress(id: string) {
    return useQuery({
      queryKey: ['SHIPPING_ADDRESS'],
      queryFn: () => shippingService.getShippingAddress(id),
      enabled: !!id
    })
  },
  saveCustomerShipping() {
    return useMutation({
      mutationFn: shippingService.saveCustomerShipping,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['SHIPPING_ADDRESSES'] })
      }
    })
  }
}
