import shippingService from '@/services/shippingService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useGetAllShippingAddress() {
  return useQuery({
    queryKey: ['SHIPPING_ADDRESSES'],
    queryFn: shippingService.getAllShippingAddress
  })
}

export function useGetShippingAddress(id: string) {
  return useQuery({
    queryKey: ['SHIPPING_ADDRESS', id],
    queryFn: () => shippingService.getShippingAddress(id),
    enabled: !!id
  })
}

export function useSaveCustomerShipping() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: shippingService.saveCustomerShipping,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ALL_SHIPPING_ADDRESS'] })
    }
  })
}
