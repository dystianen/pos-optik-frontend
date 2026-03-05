import * as shippingApi from '../api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useShipping() {
  return useQuery({
    queryKey: ['shipping'],
    queryFn: shippingApi.getShipping
  })
}

export function useAllShippingAddress() {
  return useQuery({
    queryKey: ['SHIPPING_ADDRESSES'],
    queryFn: shippingApi.getAllShippingAddress
  })
}

export function useGetShippingAddress(id: string) {
  return useQuery({
    queryKey: ['SHIPPING_ADDRESS', id],
    queryFn: () => shippingApi.getShippingAddress(id),
    enabled: !!id
  })
}

export function useSaveCustomerShipping() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: shippingApi.saveCustomerShipping,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['SHIPPING_ADDRESSES'] })
    }
  })
}
